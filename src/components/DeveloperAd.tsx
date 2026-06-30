import React from 'react';
import { Cpu, Zap, ShoppingBag, ExternalLink } from 'lucide-react';

interface SponsorAd {
  id: string;
  title: string;
  description: string;
  badge: string;
  ctaText: string;
  type: 'gpu' | 'api' | 'hardware';
  discountCode?: string;
}

const SPONSORS: SponsorAd[] = [
  {
    id: 'runpod-sponsored',
    title: 'RunPod Cloud GPUs',
    description: 'Spin up on-demand RTX 4090 or A100 instances starting at $0.44/hour. Deploy Llama 3.3 or DeepSeek-R1 with 1-click Templates.',
    badge: 'EXCLUSIVE OFFER',
    ctaText: 'Claim $50 Free Credit',
    type: 'gpu',
    discountCode: 'OPENLLM50'
  },
  {
    id: 'groq-sponsored',
    title: 'Groq LPU Inference',
    description: 'Instant serverless API execution at 500+ tokens per second. Experience the world\'s fastest Qwen 2.5 and Llama 3 API instances.',
    badge: 'API PARTNER',
    ctaText: 'Get API Key',
    type: 'api'
  },
  {
    id: 'workstation-sponsored',
    title: 'LlamaRigs Workstations',
    description: 'Pre-configured, whisper-quiet local AI workstations with triple RTX 3090/4090 setup. Engineered for local fine-tuning.',
    badge: 'HARDWARE CORNER',
    ctaText: 'Configure Custom Rig',
    type: 'hardware'
  }
];

export default function DeveloperAd({ variant = 'horizontal' }: { variant?: 'horizontal' | 'vertical' | 'sidebar' }) {
  const [activeSponsor, setActiveSponsor] = React.useState<SponsorAd>(SPONSORS[0]);
  const [isRedirecting, setIsRedirecting] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Cycle sponsors occasionally or randomly pick on load
    const randomIndex = Math.floor(Math.random() * SPONSORS.length);
    setActiveSponsor(SPONSORS[randomIndex]);
  }, []);

  const handleCtaClick = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      setIsRedirecting(false);
    }, 1500);
  };

  const getIcon = () => {
    switch (activeSponsor.type) {
      case 'gpu': return <Cpu className="w-5 h-5 text-indigo-400" id="sponsor-icon-gpu" />;
      case 'api': return <Zap className="w-5 h-5 text-amber-400" id="sponsor-icon-api" />;
      case 'hardware': return <ShoppingBag className="w-5 h-5 text-emerald-400" id="sponsor-icon-hardware" />;
    }
  };

  if (variant === 'sidebar') {
    return (
      <div className="bg-brand-card border border-brand-border rounded-md p-4 shadow-lg flex flex-col justify-between" id={`sidebar-ad-${activeSponsor.id}`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-sm uppercase">
              {activeSponsor.badge}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Sponsor</span>
          </div>
          <div className="flex items-start gap-2.5 mb-2">
            <div className="p-1.5 bg-slate-950 rounded-sm shrink-0 border border-brand-border">
              {getIcon()}
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">{activeSponsor.title}</h4>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed mb-3">
            {activeSponsor.description}
          </p>
          {activeSponsor.discountCode && (
            <div className="mb-3 px-2 py-1 bg-indigo-500/5 border border-dashed border-indigo-500/20 rounded-sm text-center">
              <span className="text-[10px] text-indigo-300 font-mono">Use Code: </span>
              <strong className="text-xs text-indigo-250 font-mono tracking-wider">{activeSponsor.discountCode}</strong>
            </div>
          )}
        </div>
        <button
          onClick={handleCtaClick}
          className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-all border cursor-pointer ${
            isRedirecting
              ? 'bg-indigo-650 text-indigo-200 border-indigo-650'
              : 'bg-slate-900 hover:bg-slate-950 text-indigo-400 hover:text-indigo-350 border-brand-border hover:border-slate-700'
          }`}
          id={`sidebar-ad-btn-${activeSponsor.id}`}
          disabled={isRedirecting}
        >
          <span>{isRedirecting ? 'SIMULATING LINK...' : activeSponsor.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="bg-brand-card border border-brand-border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full" id={`horizontal-ad-${activeSponsor.id}`}>
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-slate-950 rounded-sm shrink-0 border border-brand-border">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.5 rounded-sm uppercase">
                {activeSponsor.badge}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Sponsor Campaign</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-sans">{activeSponsor.title}</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed mt-0.5 max-w-2xl">
              {activeSponsor.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {activeSponsor.discountCode && (
            <div className="hidden lg:block px-3 py-1.5 bg-indigo-500/5 border border-dashed border-indigo-500/20 rounded-sm text-center">
              <div className="text-[9px] text-indigo-300 font-mono font-bold">CODE</div>
              <strong className="text-xs text-indigo-250 font-mono tracking-wider">{activeSponsor.discountCode}</strong>
            </div>
          )}
          <button
            onClick={handleCtaClick}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              isRedirecting
                ? 'bg-indigo-700 text-indigo-100'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
            }`}
            id={`horizontal-ad-btn-${activeSponsor.id}`}
            disabled={isRedirecting}
          >
            <span>{isRedirecting ? 'SIMULATING...' : activeSponsor.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
