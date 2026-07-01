import React, { useState } from 'react';
import { ModelMetadata, OPEN_SOURCE_MODELS } from '../data/models';
import { HelpCircle, RefreshCw, CheckCircle, Flame, ArrowRight, ShieldCheck, HeartHandshake, Cpu } from 'lucide-react';

interface MatchingWizardProps {
  models: ModelMetadata[];
  onSelectModel: (id: string) => void;
}

export default function MatchingWizard({ models, onSelectModel }: MatchingWizardProps) {
  const [step, setStep] = useState<number>(1);
  
  // Answers
  const [useCase, setUseCase] = useState<string>('Coding');
  const [hardware, setHardware] = useState<string>('mid'); // entry, mid, high, unlimited
  const [license, setLicense] = useState<string>('commercial'); // commercial, any
  const [context, setContext] = useState<string>('standard'); // large, standard

  const resetWizard = () => {
    setStep(1);
    setUseCase('Coding');
    setHardware('mid');
    setLicense('commercial');
    setContext('standard');
  };

  // Recommendations score computer
  const recommendations = React.useMemo(() => {
    if (step < 5) return [];

    const scored = models.map((model) => {
      let score = 100;
      const reasons: string[] = [];

      // 1. Check Use Case
      const useCaseMapped = useCase === 'Coding' 
        ? 'Coding' 
        : useCase === 'Reasoning'
        ? 'Reasoning & Math'
        : useCase === 'Local'
        ? 'Local / On-device'
        : 'General Assistant';
      
      if (model.primaryUseCases.includes(useCaseMapped as any)) {
        score += 20;
        reasons.push(`Superb fit for your targeted task: ${useCaseMapped}`);
      } else {
        score -= 20;
        reasons.push(`Mainly tailored for other specialties instead of ${useCaseMapped}`);
      }

      // 2. Hardware constraints
      // Approx memory needed at Q4 quantization (standard practice)
      const paramCount = parseFloat(model.parameters.replace(/[^\d.]/g, ''));
      const estimatedQ4VramGb = paramCount * 0.6 + 2.0;

      if (hardware === 'entry') {
        if (estimatedQ4VramGb <= 8) {
          score += 25;
          reasons.push('Fits easily in low-spec 8GB VRAM/RAM hardware');
        } else if (estimatedQ4VramGb <= 16) {
          score -= 10;
          reasons.push('Might experience minor slowdowns on entry hardware unless highly quantized (Q2_K)');
        } else {
          score -= 60;
          reasons.push('Too large for entry hardware (needs more VRAM)');
        }
      } else if (hardware === 'mid') {
        if (estimatedQ4VramGb <= 24) {
          score += 25;
          reasons.push('Perfect match for consumer workstation/high-end PC memory limits');
        } else {
          score -= 40;
          reasons.push('Substantially exceeds comfortable mid-tier VRAM capacity');
        }
      } else if (hardware === 'high') {
        if (estimatedQ4VramGb <= 48) {
          score += 20;
          reasons.push('Excellent usage of your dual-GPU / professional hardware');
        } else {
          score -= 15;
          reasons.push('Slightly high memory overhead for enthusiast rigs');
        }
      } else {
        // Unlimited
        score += 20;
        reasons.push('Harnesses the complete depth of enterprise datacenter resources');
      }

      // 3. License Safety
      if (license === 'commercial') {
        if (model.commercialAllowed) {
          score += 20;
          reasons.push(`Commercially safe for business deployment (${model.license})`);
        } else {
          score -= 50;
          reasons.push(`License restricted (${model.license}) - non-commercial research use only`);
        }
      } else {
        score += 10;
        reasons.push('Meets your flexible open-research guidelines');
      }

      // 4. Context scale
      if (context === 'large') {
        if (model.contextWindow >= 128000) {
          score += 15;
          reasons.push('Incredible 128k context support for extreme RAG files');
        } else {
          score -= 20;
          reasons.push(`Context window restricted to ${model.contextWindow / 1000}k tokens`);
        }
      } else {
        score += 5;
      }

      return {
        model,
        score: Math.max(0, Math.min(100, score)),
        reasons: reasons.slice(0, 3) // Return top 3 reasons
      };
    });

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score);
  }, [step, useCase, hardware, license, context, models]);

  return (
    <div className="bg-brand-card border border-brand-border rounded-md p-6 font-sans shadow-xl max-w-3xl mx-auto animate-fade-in" id="matching-wizard-widget">
      {/* Wizard Progress Bar */}
      {step < 5 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mb-2 font-bold tracking-widest uppercase">
            <span>LLM MATCHING ADVISOR</span>
            <span>STEP {step} OF 4</span>
          </div>
          <div className="w-full bg-slate-950 rounded-sm h-1.5 overflow-hidden border border-brand-border/20">
            <div 
              className="bg-indigo-500 h-1.5 rounded-sm transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: USE CASE */}
      {step === 1 && (
        <div className="space-y-5" id="wizard-step-1">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2 font-display">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              What is your primary use case?
            </h3>
            <p className="text-xs text-slate-400 mt-1">We will recommend models that are specifically pre-trained and fine-tuned for this task.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'Coding', title: 'Software Engineering', desc: 'Code synthesis, unit-testing, scripting, debugging, and systems architecture.' },
              { id: 'Reasoning', title: 'Logic & Reasoning', desc: 'Complex multi-step math puzzles, financial research, and logical chaining.' },
              { id: 'Assistant', title: 'General Conversational', desc: 'Roleplay, customer support, document summarizing, and creative copywriting.' },
              { id: 'Local', title: 'Low Power / Offline Edge', desc: 'Running fast on standard laptops, mobile apps, or low-powered computers.' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setUseCase(opt.id)}
                className={`p-4 text-left border rounded-md transition-all relative cursor-pointer ${
                  useCase === opt.id 
                    ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-300' 
                    : 'border-brand-border bg-white dark:bg-brand-bg/30 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                id={`wizard-usecase-${opt.id}`}
              >
                <h4 className={`text-xs font-bold font-sans mb-1 ${
                  useCase === opt.id ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'
                }`}>{opt.title}</h4>
                <p className={`text-[10px] leading-normal ${
                  useCase === opt.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer font-mono font-bold uppercase tracking-wider"
              id="wizard-next-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: HARDWARE */}
      {step === 2 && (
        <div className="space-y-5" id="wizard-step-2">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2 font-display">
              <Cpu className="w-5 h-5 text-teal-400" />
              What is your target memory resource?
            </h3>
            <p className="text-xs text-slate-400 mt-1">We will filter out models that exceed your physical system hardware capabilities to prevent crashes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'entry', title: 'Entry-Level (<8 GB VRAM)', desc: 'Standard business laptops, mobile phones, or standard computer system RAM.' },
              { id: 'mid', title: 'Mid-Tier (8 - 24 GB VRAM)', desc: 'Apple M1/M2/M3 with 16GB/24GB Unified memory, single RTX 3060/4060 GPUs.' },
              { id: 'high', title: 'Professional (24 - 48 GB VRAM)', desc: 'Dual RTX 3090/4090 gaming clusters, or single professional workstation setups.' },
              { id: 'unlimited', title: 'Enterprise Cloud (Unlimited)', desc: 'Docker nodes, serverless providers, or A100/H100 corporate setups.' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setHardware(opt.id)}
                className={`p-4 text-left border rounded-md transition-all relative cursor-pointer ${
                  hardware === opt.id 
                    ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-500/10 text-teal-900 dark:text-teal-300' 
                    : 'border-brand-border bg-white dark:bg-brand-bg/30 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                id={`wizard-hardware-${opt.id}`}
              >
                <h4 className={`text-xs font-bold font-sans mb-1 ${
                  hardware === opt.id ? 'text-teal-900 dark:text-teal-200' : 'text-slate-700 dark:text-slate-300'
                }`}>{opt.title}</h4>
                <p className={`text-[10px] leading-normal ${
                  hardware === opt.id ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
                }`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-brand-border dark:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              id="wizard-prev-2"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              id="wizard-next-2"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LICENSE */}
      {step === 3 && (
        <div className="space-y-5" id="wizard-step-3">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2 font-display">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              What are your licensing restrictions?
            </h3>
            <p className="text-xs text-slate-400 mt-1">If building commercial platforms, some models require restricted use agreements or high-tier fee permissions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'commercial', title: 'Commercially Permissive Safe', desc: 'Requires standard Apache 2.0 or MIT licenses with zero restrictions on commercialization.' },
              { id: 'any', title: 'Flexible Research & All Open', desc: 'Allows research/open licenses (Llama 3, Mistral Research, Gemma) allowing general business usage with custom size boundaries.' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLicense(opt.id)}
                className={`p-4 text-left border rounded-md transition-all relative cursor-pointer ${
                  license === opt.id 
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300' 
                    : 'border-brand-border bg-white dark:bg-brand-bg/30 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                id={`wizard-license-${opt.id}`}
              >
                <h4 className={`text-xs font-bold font-sans mb-1 ${
                  license === opt.id ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-700 dark:text-slate-300'
                }`}>{opt.title}</h4>
                <p className={`text-[10px] leading-normal ${
                  license === opt.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                }`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-brand-border dark:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              id="wizard-prev-3"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              id="wizard-next-3"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONTEXT */}
      {step === 4 && (
        <div className="space-y-5" id="wizard-step-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2 font-display">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              Do you require long context support?
            </h3>
            <p className="text-xs text-slate-400 mt-1">Longer contexts (32k-128k+) allow summarizing huge files, but require substantially more RAM cache.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'large', title: 'High Context (32k - 128k+ tokens)', desc: 'Necessary for document RAG, reading massive codebases, or complex persistent histories.' },
              { id: 'standard', title: 'Standard Context is Okay (<16k)', desc: 'Perfect for simple chat assistants, quick code snippets, or basic prompt responses.' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setContext(opt.id)}
                className={`p-4 text-left border rounded-md transition-all relative cursor-pointer ${
                  context === opt.id 
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300' 
                    : 'border-brand-border bg-white dark:bg-brand-bg/30 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                id={`wizard-context-${opt.id}`}
              >
                <h4 className={`text-xs font-bold font-sans mb-1 ${
                  context === opt.id ? 'text-amber-900 dark:text-amber-200' : 'text-slate-700 dark:text-slate-300'
                }`}>{opt.title}</h4>
                <p className={`text-[10px] leading-normal ${
                  context === opt.id ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                }`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-brand-border dark:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              id="wizard-prev-4"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-lg shadow-indigo-600/10"
              id="wizard-run-cta"
            >
              <span>Match Report</span>
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: MATCH RECOMMENDATIONS REPORT */}
      {step === 5 && (
        <div className="space-y-6" id="wizard-results">
          <div className="text-center border-b border-brand-border pb-5">
            <div className="inline-flex p-2.5 bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 rounded-full mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-display">Your Perfect Open-Source Matches</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Our recommender engine completed mapping across hardware thresholds, licenses, and benchmark curves.
            </p>
          </div>

          <div className="space-y-4">
            {recommendations.slice(0, 3).map((item, idx) => (
              <div 
                key={item.model.id}
                className="bg-white dark:bg-brand-bg/60 border border-brand-border hover:border-slate-300 dark:hover:border-slate-700/80 rounded-md p-5 transition-all flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden"
              >
                {/* Ranking Tag */}
                <div className="absolute top-0 left-0">
                  <span className={`text-[9px] font-mono font-bold px-2.5 py-1 block rounded-br-md uppercase tracking-wider ${
                    idx === 0 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-r border-b border-slate-200 dark:border-brand-border'
                  }`}>
                    MATCH RANK #{idx + 1}
                  </span>
                </div>

                <div className="space-y-2 mt-2 md:mt-0 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono tracking-wider bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-400 px-2 py-0.5 border border-slate-200 dark:border-brand-border rounded-sm uppercase font-bold">
                      {item.model.provider}
                    </span>
                    <span className="text-[9px] font-mono tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-500/5 dark:text-indigo-300 px-2 py-0.5 border border-indigo-100 dark:border-indigo-500/10 rounded-sm font-bold">
                      {item.model.parameters}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">{item.model.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-sans">{item.model.description}</p>
                  
                  {/* Matching reasons */}
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-brand-border/40 mt-2">
                    {item.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-650 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-sans font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between shrink-0 items-end gap-3 min-w-[120px]">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Match Score</span>
                    <strong className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">{item.score}%</strong>
                  </div>
                  <button
                    onClick={() => onSelectModel(item.model.id)}
                    className="w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-sm"
                    id={`wizard-match-select-${item.model.id}`}
                  >
                    Load Specs
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-brand-border pt-5">
            <button
              onClick={resetWizard}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-brand-border dark:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer"
              id="wizard-restart-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
            <p className="text-[9px] text-slate-500 font-mono font-semibold uppercase tracking-wider">
              Calculation completed using dynamic parameter-weight memory mapping.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
