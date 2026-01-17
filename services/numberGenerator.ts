// Local number generation service
// Purely algorithmic, instant generation without external dependencies.
// NO AI OR EXTERNAL APIS USED.

// Common Indian mobile prefixes (3 digits) to make generation feel more realistic
// Mix of major operators across circles (Airtel, Jio, Vi, BSNL)
const COMMON_PREFIXES = [
  // 9 series
  '981', '982', '983', '984', '986', '987', '989', 
  '990', '991', '992', '993', '994', '995', '996', '997', '998', '999',
  '900', '901', '902', '903', '904', 
  '916', '917', '915',
  '930', '931', '932', '933', '934', // Old Reliance/CDMA blocks often converted
  '940', '941', '942', '943', '944', '945', '946', '947', '948', '949', // BSNL
  '950', '951', '952', '953', '954', '955', '956', '957', '958', '959',
  '960', '961', '962', '963', '964', '965', '966', '967', '968', '969',
  '970', '971', '972', '973', '974', '975', '976', '977', '978', '979',

  // 8 series
  '800', '801', '805', '807', '808', '809', 
  '810', '811', '812', '813', '814', '819', 
  '828', '838', '848', '858', '878', '880', '888', '889', '897', '898',

  // 7 series (Largely Jio and newer allocations)
  '700', '701', '702', '703', '704', '705', '706', '707', '708', '709', 
  '720', '729', '730', '738', '740', '741', '750', '758', 
  '760', '766', '767', '770', '771', '773', '776', '778', '779', 
  '780', '781', '782', '783', '788', '789', 
  '790', '797', '798', '799',

  // 6 series (Newer Jio)
  '600', '620', '623', '626', '628', '629', 
  '630', '635', '636', '637', '638', '639'
];

export const generateNumbers = async (
  referenceNumber: string,
  count: number
): Promise<string[]> => {
  // Use a Set to ensure all generated numbers in this batch are unique
  const numbers: Set<string> = new Set();
  const validStarts = ['6', '7', '8', '9'];
  
  // Clean reference to digits only
  const cleanRef = referenceNumber ? referenceNumber.replace(/\D/g, '') : '';
  
  let basePrefix = '';
  let useRandomCommonPrefix = false;
  
  // Logic to determine the base prefix strategy
  if (cleanRef.length >= 1) {
      if (!validStarts.includes(cleanRef[0])) {
          // Invalid start digit provided in reference, ignore it and go random
          useRandomCommonPrefix = true;
      } else {
          // If the user provided 4 or more digits, respect that specific pattern
          if (cleanRef.length >= 4) {
             // If they provided a full number (10+ digits), we assume they want
             // numbers from the same series (HLR), so we take the first 5 digits.
             if (cleanRef.length >= 10) {
                 basePrefix = cleanRef.slice(0, 5);
             } else {
                 basePrefix = cleanRef;
             }
          } else {
             // If user provided short input (1-3 digits), e.g. "9" or "98"
             // We want to pick from our common list to make it realistic, 
             // but restricted to those matching the input.
             const matching = COMMON_PREFIXES.filter(p => p.startsWith(cleanRef));
             if (matching.length > 0) {
                 // We will pick randomly from 'matching' inside the loop
                 basePrefix = 'VARIES'; 
             } else {
                 // No match in our common list, but it's a valid start (e.g. 911), so use it.
                 basePrefix = cleanRef;
             }
          }
      }
  } else {
      // Empty reference
      useRandomCommonPrefix = true;
  }

  let attempts = 0;
  // Safety break to prevent infinite loops (e.g. if count is high but possible combinations are low)
  const maxAttempts = count * 20; 

  while (numbers.size < count && attempts < maxAttempts) {
    attempts++;
    let currentPrefix = '';

    if (useRandomCommonPrefix) {
        currentPrefix = COMMON_PREFIXES[Math.floor(Math.random() * COMMON_PREFIXES.length)];
    } else if (basePrefix === 'VARIES') {
         // Pick a random prefix that matches the user's short input
         const matching = COMMON_PREFIXES.filter(p => p.startsWith(cleanRef));
         if (matching.length > 0) {
             currentPrefix = matching[Math.floor(Math.random() * matching.length)];
         } else {
             currentPrefix = cleanRef; // Fallback
         }
    } else {
        currentPrefix = basePrefix;
    }

    // Fill remaining digits to reach length of 10
    let currentNum = currentPrefix;
    while (currentNum.length < 10) {
        currentNum += Math.floor(Math.random() * 10).toString();
    }
    
    // Final validation
    if (currentNum.length === 10 && validStarts.includes(currentNum[0])) {
        numbers.add(currentNum);
    }
  }

  return Array.from(numbers);
};