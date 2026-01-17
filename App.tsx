import React, { useState, useCallback } from 'react';
import { GlassCard } from './components/GlassCard';
import { NumberList } from './components/NumberList';
import { generateNumbers } from './services/numberGenerator';
import { Layers, Zap, Send, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  // Fixed batch size for infinite scroll
  const count = 30; 
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateInput = (input: string): string | null => {
      if (!input) return null; 
      if (!/^\d+$/.test(input)) return "Digits only";
      if (![6, 7, 8, 9].includes(parseInt(input.charAt(0)))) return "Start with 6-9";
      if (input.length > 10) return "Max 10 digits";
      return null;
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setGeneratedNumbers([]);
    setIsGenerating(true);

    const validationError = validateInput(referenceNumber);
    if (validationError) {
        setError(validationError);
        setIsGenerating(false);
        return;
    }

    try {
      // Direct call to local service (No API/AI)
      const numbers = await generateNumbers(referenceNumber, count);
      if (numbers.length === 0) {
          setError("Try a different pattern");
      } else {
          setGeneratedNumbers(numbers);
      }
    } catch (err: any) {
      setError("Error generating");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
      if (isGenerating || generatedNumbers.length === 0) return;
      setIsGenerating(true);
      try {
        const nextBatch = await generateNumbers(referenceNumber, count);
        setGeneratedNumbers(prev => [...prev, ...nextBatch]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
  }, [generatedNumbers.length, isGenerating, referenceNumber, count]);

  return (
    <div className="min-h-screen w-full relative font-sans text-[#1C1C1E]">
      
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#F2F2F7]">
         <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-400/10 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
         <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-400/10 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-400/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            
            {/* Controller / Sidebar */}
            <div className="w-full lg:w-[24rem] shrink-0 lg:sticky lg:top-12 transition-all duration-300 z-30">
                
                {/* Branding */}
                <div className="mb-8 pl-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="text-white w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">v2.1</span>
                    </div>
                    <h1 className="text-[34px] leading-[1.1] font-bold text-[#1C1C1E] tracking-tight">
                        TG Generator
                    </h1>
                    <p className="mt-2 text-[17px] text-[#8E8E93] font-normal leading-snug">
                        Girls Whatsapp Number Generator
                    </p>

                    <a href="https://t.me/Its_Gods" target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 bg-[#007AFF]/10 hover:bg-[#007AFF]/20 rounded-full transition-colors cursor-pointer group no-underline">
                        <Send size={12} className="text-[#007AFF] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        <span className="text-[13px] font-semibold text-[#007AFF]">@Its_Gods</span>
                    </a>
                </div>

                {/* iOS Settings Group Style Form */}
                <div className="space-y-6">
                    
                    <div className="bg-white/70 backdrop-blur-xl rounded-[20px] shadow-sm border border-white/50 overflow-hidden">
                        
                        {/* Reference Input */}
                        <div className="p-4">
                            <label className="block text-[13px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">Pattern</label>
                            <div className="flex items-center bg-[#767680]/10 rounded-xl px-3 py-2.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-[#007AFF]/20">
                                <span className="text-slate-400 font-medium mr-2 text-lg">+91</span>
                                <input
                                    type="text"
                                    value={referenceNumber}
                                    onChange={(e) => {
                                        setReferenceNumber(e.target.value.replace(/\D/g, ''));
                                        if(error) setError(null);
                                    }}
                                    maxLength={10}
                                    placeholder="987..."
                                    className="bg-transparent border-none outline-none w-full text-lg font-semibold text-[#1C1C1E] placeholder-slate-400/70"
                                />
                            </div>
                            {error && <p className="mt-2 text-[13px] font-medium text-red-500 flex items-center gap-1 animate-shake"><span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>{error}</p>}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGenerate}
                        className="
                            w-full
                            bg-[#007AFF] hover:bg-[#0062cc]
                            text-white
                            font-semibold text-[17px]
                            py-3.5 rounded-[16px]
                            shadow-[0_4px_14px_0_rgba(0,118,255,0.39)]
                            hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)]
                            active:scale-[0.98]
                            transition-all duration-200 ease-ios
                            flex items-center justify-center gap-2
                        "
                    >
                        <Zap size={18} fill="currentColor" />
                        Generate
                    </button>

                </div>
            </div>

            {/* Results List */}
            <div className="flex-1 w-full min-w-0 pt-2">
                 <NumberList 
                    numbers={generatedNumbers} 
                    onLoadMore={handleLoadMore}
                    hasMore={generatedNumbers.length > 0} 
                 />
                 
                 {generatedNumbers.length === 0 && !error && (
                     <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-40 animate-fade-in">
                        <div className="w-16 h-16 bg-slate-200/50 rounded-2xl flex items-center justify-center mb-4">
                            <Layers className="text-slate-400 w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-medium">Enter a pattern to start</p>
                     </div>
                 )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default App;