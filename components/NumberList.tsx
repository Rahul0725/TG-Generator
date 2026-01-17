import React, { useEffect, useRef } from 'react';
import { Phone, Copy, Check, UserPlus, Loader2, Share2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface NumberListProps {
  numbers: string[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const NumberList: React.FC<NumberListProps> = ({ numbers, onLoadMore, hasMore = false }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, onLoadMore, numbers.length]);

  const handleCopy = (num: string, index: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const openWhatsApp = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    const url = `https://wa.me/91${cleanNum}`;
    window.open(url, '_blank');
  };

  if (numbers.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full pb-20">
        
        {/* List Header */}
        <div className="flex justify-between items-end px-2 mb-2 animate-fade-in">
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">Generated</h3>
             <span className="text-[11px] font-medium text-slate-400 bg-white/40 px-2 py-1 rounded-lg backdrop-blur-md">{numbers.length} Results</span>
        </div>
      
      <div className="grid gap-3">
        {numbers.map((num, index) => (
            <div 
                key={`${num}-${index}`} 
                className="animate-slide-up fill-mode-backwards"
                style={{ animationDelay: `${(index % 12) * 40}ms` }}
            >
                <div className="
                    group relative overflow-hidden
                    bg-white
                    rounded-2xl
                    p-4
                    shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]
                    border border-slate-100/50
                    flex items-center justify-between
                    transition-all duration-300 ease-ios
                    hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)]
                    hover:scale-[1.005]
                    active:scale-[0.98]
                ">
                    
                    {/* Number Display */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#007AFF] group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-300">
                             <Phone size={18} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-sans text-[17px] font-semibold text-slate-900 tracking-tight tabular-nums">
                                {num.replace(/(\d{5})(\d{5})/, '$1 $2')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                                +91 • INDIA
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                         {/* WhatsApp Action - Branded Button */}
                         <button 
                            onClick={(e) => { e.stopPropagation(); openWhatsApp(num); }}
                            className="
                                w-10 h-10 flex items-center justify-center rounded-full 
                                bg-[#25D366]/10 text-[#25D366] 
                                hover:bg-[#25D366] hover:text-white 
                                transition-all duration-300 
                                shadow-sm hover:shadow-lg hover:shadow-[#25D366]/30
                            "
                            title="Chat on WhatsApp"
                            aria-label="Chat on WhatsApp"
                         >
                            {/* Official WhatsApp Logo SVG */}
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                         </button>

                         {/* Copy Action */}
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleCopy(num, index); }}
                            className={`
                                w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                                ${copiedIndex === index 
                                    ? 'bg-blue-500 text-white shadow-md scale-110' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}
                            `}
                         >
                            {copiedIndex === index ? <Check size={18} strokeWidth={3} /> : <Copy size={17} strokeWidth={2.2} />}
                         </button>
                    </div>

                </div>
            </div>
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-10 opacity-60">
           <Loader2 className="animate-spin text-slate-400 w-5 h-5" />
        </div>
      )}
      
    </div>
  );
};