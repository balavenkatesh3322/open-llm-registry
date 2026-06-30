import React, { useEffect, useState } from 'react';
import { Sparkles, MessageSquare, ShieldCheck, X, Cpu, Layers, Trophy, Zap } from 'lucide-react';

interface ProUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: 'VRAM Predictor' | 'Compare Matrix' | 'General Pro';
}

export default function ProUnlockModal({ isOpen, onClose, featureName }: ProUnlockModalProps) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Create confetti particle stream
      const emojis = ['🎉', '✨', '🔑', '🚀', '💬', '🏆', '💚', '💎', '🔥', '🧠'];
      const newParticles = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100, // percentage
        delay: Math.random() * 2, // seconds
        duration: 3 + Math.random() * 4, // seconds
        size: 16 + Math.floor(Math.random() * 24), // pixels
      }));
      setParticles(newParticles);
      
      // Auto-lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappUrl = `https://wa.me/919003812808?text=Hi%20Bala,%20I%20am%20using%20the%20OpenLLM%20Index%20and%20want%20to%20unlock%20the%20PRO%20features%20for%20the%20${encodeURIComponent(featureName)}!`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" id="pro-unlock-overlay">
      {/* Backdrop with extreme glass blur */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Drifting Celebration Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bottom-[-50px] animate-bounce-slow text-slate-100 select-none opacity-85"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}px`,
              animation: `floatUp ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* CSS injection for drift up effect */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Modal Dialog Body with Intense Golden/Indigo Radial Glowing border */}
      <div 
        className="relative bg-slate-900 border border-indigo-500/30 rounded-lg p-6 sm:p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(99,102,241,0.25)] z-20 overflow-hidden transform transition-all duration-300 animate-scale-up"
        id="pro-unlock-dialog"
      >
        {/* Glow effect */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 rounded transition-all cursor-pointer"
          id="pro-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Interactive Badge Icon Group with floating Sparkle */}
        <div className="flex justify-center mb-5 relative">
          <div className="relative p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-full animate-pulse">
            <Trophy className="w-10 h-10 text-indigo-400" />
            <Sparkles className="w-5 h-5 text-emerald-400 absolute -top-1 -right-1 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-100 px-3 py-1 rounded-full shadow-md border border-indigo-400/40">
            PRO EDITION ACTIVE
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-100 font-display tracking-tight leading-tight mt-3">
          🎉 Unlock OpenLLM PRO Access! 🎉
        </h3>
        
        <p className="text-xs sm:text-sm text-indigo-300 font-mono font-extrabold tracking-wider uppercase mt-2">
          Exclusive Feature: {featureName}
        </p>

        {/* Benefits Grid */}
        <div className="my-5 bg-slate-950/60 border border-brand-border/60 rounded-md p-4 text-left space-y-3">
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 font-sans leading-normal">
              <span className="font-bold text-slate-100">Full Parameter Slider Unlocks:</span> Adjust context windows up to 2M tokens and calculate multi-GPU parameters.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 font-sans leading-normal">
              <span className="font-bold text-slate-100">Unlimited Side-by-Side Matrix:</span> Load, compare, and copy prompt templates for all open-source models.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 font-sans leading-normal">
              <span className="font-bold text-slate-100">1-on-1 Developer Consultation:</span> Free advice on running models optimally on your specific workstation hardware.
            </p>
          </div>
        </div>

        {/* Direct Call-to-Action to WhatsApp with animated bounce */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold text-sm uppercase tracking-wide rounded-md transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:scale-[1.02] active:scale-[0.98] animate-bounce-slow"
            id="whatsapp-unlock-btn"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            Connect via WhatsApp & Unlock FREE PRO
          </a>

          <p className="text-[10px] text-slate-500 font-mono tracking-wide">
            100% Free for Open Source Developers. Instantly unlock with a single message!
          </p>
        </div>

        {/* Cancel option */}
        <div className="mt-4 pt-3 border-t border-brand-border/40">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 underline transition-all cursor-pointer"
            id="cancel-unlock-btn"
          >
            Stay on Limited Preview Mode
          </button>
        </div>

      </div>
    </div>
  );
}
