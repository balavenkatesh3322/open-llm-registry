import React, { useState } from 'react';
import { ModelMetadata } from '../data/models';
import { Check, X, ArrowLeft, BarChart2, Cpu, Copy, BookOpen, Layers, ShieldAlert as LockIcon } from 'lucide-react';
import ProUnlockModal from './ProUnlockModal';

interface ComparisonCanvasProps {
  selectedModelIds: string[];
  models: ModelMetadata[];
  onRemoveModel: (id: string) => void;
  onClearAll: () => void;
  onBackToRegistry: () => void;
}

export default function ComparisonCanvas({
  selectedModelIds,
  models,
  onRemoveModel,
  onClearAll,
  onBackToRegistry
}: ComparisonCanvasProps) {
  // Slots for comparing
  const [slot1, setSlot1] = useState<string>(selectedModelIds[0] || 'deepseek-r1');
  const [slot2, setSlot2] = useState<string>(selectedModelIds[1] || 'llama-3.3-70b-instruct');
  const [slot3, setSlot3] = useState<string>(selectedModelIds[2] || '');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);

  const compareList = React.useMemo(() => {
    const list: ModelMetadata[] = [];
    const m1 = models.find((m) => m.id === slot1);
    const m2 = models.find((m) => m.id === slot2);
    const m3 = models.find((m) => m.id === slot3);

    if (m1) list.push(m1);
    if (m2) list.push(m2);
    if (m3) list.push(m3);
    return list;
  }, [slot1, slot2, slot3, models]);

  const copyCommand = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="comparison-canvas-panel">
      {/* Header controls - Sharp rectangular block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-card border border-brand-border p-4 rounded-md shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRegistry}
            className="p-2.5 bg-slate-900/50 hover:bg-slate-900 border border-brand-border hover:border-slate-700 text-slate-400 hover:text-slate-100 rounded-md transition-all cursor-pointer"
            id="comp-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-display tracking-tight">Model Comparison Matrix</h2>
            <p className="text-xs text-slate-400 font-sans">Analyze tradeoffs, benchmarks, and licensing constraints side-by-side.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsUnlockOpen(true)}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 hover:from-indigo-500/20 hover:to-emerald-500/20 text-indigo-300 hover:text-indigo-200 px-3 py-1.5 rounded-full border border-indigo-500/30 cursor-pointer animate-pulse font-bold uppercase"
          >
            <LockIcon className="w-3 h-3 text-indigo-400" />
            Unlock Matrix PRO
          </button>
          <button
            onClick={() => {
              setSlot1('deepseek-r1');
              setSlot2('llama-3.3-70b-instruct');
              setSlot3('');
              setIsUnlockOpen(true);
            }}
            className="px-3.5 py-2 bg-slate-900/60 hover:bg-slate-900 border border-brand-border text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 rounded-md transition-all cursor-pointer"
            id="comp-preset-btn"
          >
            LOAD DEEPSEEK VS LLAMA
          </button>
          <button
            onClick={() => {
              setSlot1('');
              setSlot2('');
              setSlot3('');
              setIsUnlockOpen(true);
            }}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-brand-border text-xs font-mono font-bold text-slate-500 hover:text-slate-350 rounded-md transition-all cursor-pointer uppercase tracking-wider"
            id="comp-clear-btn"
          >
            Clear Slots
          </button>
        </div>
      </div>

      {/* Comparison Slot Pickers (Up to 3) - Sharp bento arrangement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-card border border-brand-border p-4 rounded-md">
        {/* SLOT 1 */}
        <div className="space-y-1.5" id="comp-slot-1-container">
          <label className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold block">Comparison Slot A</label>
          <select
            value={slot1}
            onChange={(e) => {
              setSlot1(e.target.value);
              setIsUnlockOpen(true);
            }}
            className="w-full bg-brand-bg border border-brand-border hover:border-slate-700 text-xs text-slate-100 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
            id="select-slot-1"
          >
            <option value="">-- Empty (Choose Model) --</option>
            {models.map((m) => (
              <option key={m.id} value={m.id} disabled={slot2 === m.id || slot3 === m.id}>
                {m.name} ({m.parameters})
              </option>
            ))}
          </select>
        </div>

        {/* SLOT 2 */}
        <div className="space-y-1.5" id="comp-slot-2-container">
          <label className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold block">Comparison Slot B</label>
          <select
            value={slot2}
            onChange={(e) => {
              setSlot2(e.target.value);
              setIsUnlockOpen(true);
            }}
            className="w-full bg-brand-bg border border-brand-border hover:border-slate-700 text-xs text-slate-100 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
            id="select-slot-2"
          >
            <option value="">-- Empty (Choose Model) --</option>
            {models.map((m) => (
              <option key={m.id} value={m.id} disabled={slot1 === m.id || slot3 === m.id}>
                {m.name} ({m.parameters})
              </option>
            ))}
          </select>
        </div>

        {/* SLOT 3 */}
        <div className="space-y-1.5" id="comp-slot-3-container">
          <label className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold block">Comparison Slot C (Optional)</label>
          <select
            value={slot3}
            onChange={(e) => {
              setSlot3(e.target.value);
              setIsUnlockOpen(true);
            }}
            className="w-full bg-brand-bg border border-brand-border hover:border-slate-700 text-xs text-slate-100 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
            id="select-slot-3"
          >
            <option value="">-- Empty (Choose Model) --</option>
            {models.map((m) => (
              <option key={m.id} value={m.id} disabled={slot1 === m.id || slot2 === m.id}>
                {m.name} ({m.parameters})
              </option>
            ))}
          </select>
        </div>
      </div>

      {compareList.length === 0 ? (
        <div className="text-center bg-brand-card border border-brand-border rounded-md py-12 px-6" id="empty-compare-slate">
          <Layers className="w-12 h-12 text-indigo-500/40 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">No models selected for comparison</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Please use the dropdown slot pickers above to select models to compare side-by-side, or go back to the directory grid.
          </p>
          <button
            onClick={onBackToRegistry}
            className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            id="empty-comp-back-cta"
          >
            Browse Models
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-brand-card border border-brand-border rounded-md shadow-xl" id="compare-matrix-table-wrapper">
          <table className="w-full border-collapse text-left text-xs font-sans min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-border bg-brand-nav/50">
                <th className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] w-1/4">Specification</th>
                {compareList.map((m) => (
                  <th key={m.id} className="p-4 text-slate-100 font-bold w-1/4 border-l border-brand-border/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono tracking-wider uppercase text-indigo-400 font-bold block">{m.provider}</span>
                        <span className="text-sm font-bold tracking-tight block mt-0.5 font-display">{m.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (slot1 === m.id) setSlot1('');
                          else if (slot2 === m.id) setSlot2('');
                          else if (slot3 === m.id) setSlot3('');
                        }}
                        className="text-slate-500 hover:text-slate-350 p-1 hover:bg-slate-800/60 rounded-md border border-transparent hover:border-brand-border transition-all cursor-pointer"
                        title="Remove model"
                        id={`remove-table-slot-${m.id}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
                {/* Pad columns if comparing fewer than 3 */}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <th key={`pad-head-${i}`} className="p-4 text-slate-600 font-mono text-[9px] uppercase tracking-wider font-semibold border-l border-brand-border/40">Slot Empty</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {/* DESCRIPTION */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">Description</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 text-slate-300 leading-relaxed font-sans border-l border-brand-border/40">{m.description}</td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-desc-${i}`} className="p-4 text-slate-700 bg-brand-bg/20 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* PARAMETERS */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">Parameter Class</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 font-mono font-bold text-indigo-350 border-l border-brand-border/40">
                    <div className="text-xs">{m.parameters}</div>
                    {m.activeParameters && (
                      <span className="text-[9px] text-slate-500 font-bold tracking-wider block uppercase mt-0.5">Active/MoE: {m.activeParameters}</span>
                    )}
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-params-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* CONTEXT WINDOW */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">Context Window</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 font-mono text-slate-300 font-semibold border-l border-brand-border/40">
                    {m.contextWindow.toLocaleString()} tokens
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-context-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* LICENSE & COMMERCIAL USE */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">License Audit</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 border-l border-brand-border/40">
                    <span className="font-mono bg-slate-950 text-slate-300 border border-brand-border px-2.5 py-1 rounded-sm text-[10px] font-bold block w-fit mb-2">
                      {m.license}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {m.commercialAllowed ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase tracking-wide">Commercially Safe</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-amber-500" />
                          <span className="text-amber-500 font-bold font-mono text-[10px] uppercase tracking-wide">Research Only</span>
                        </>
                      )}
                    </div>
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-license-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* BENCHMARKS */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <span>Evaluation</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-semibold block leading-normal uppercase">
                    MMLU: KNOWLEDGE<br/>CODE: HumanEval<br/>MATH: GSM8k
                  </span>
                </td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 space-y-3 border-l border-brand-border/40">
                    {/* MMLU */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">MMLU (General)</span>
                        <strong className="text-slate-200 font-mono font-bold">{m.benchmarks.mmlu}%</strong>
                      </div>
                      <div className="w-full bg-slate-950 rounded-sm h-1.5 overflow-hidden border border-brand-border/20">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-sm"
                          style={{ width: `${m.benchmarks.mmlu}%` }}
                        />
                      </div>
                    </div>

                    {/* HumanEval */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">HumanEval (Code)</span>
                        <strong className="text-slate-200 font-mono font-bold">{m.benchmarks.humanEval}%</strong>
                      </div>
                      <div className="w-full bg-slate-950 rounded-sm h-1.5 overflow-hidden border border-brand-border/20">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-sm"
                          style={{ width: `${m.benchmarks.humanEval}%` }}
                        />
                      </div>
                    </div>

                    {/* GSM8k */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">GSM8K (Math)</span>
                        <strong className="text-slate-200 font-mono font-bold">{m.benchmarks.gsm8k}%</strong>
                      </div>
                      <div className="w-full bg-slate-950 rounded-sm h-1.5 overflow-hidden border border-brand-border/20">
                        <div
                          className="bg-amber-500 h-1.5 rounded-sm"
                          style={{ width: `${m.benchmarks.gsm8k}%` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-bench-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* PRIMARY USE CASES */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">Target Strengths</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 border-l border-brand-border/40">
                    <div className="flex flex-wrap gap-1">
                      {m.primaryUseCases.map((useCase) => (
                        <span
                          key={useCase}
                          className="text-[9px] font-medium font-mono px-2 py-0.5 rounded-sm bg-slate-950 text-slate-300 border border-brand-border"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-usecase-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* PROS & CONS */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">Pros & Cons</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 space-y-3 font-sans border-l border-brand-border/40">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">Advantages</span>
                      <ul className="space-y-1">
                        {m.pros.map((p, idx) => (
                          <li key={idx} className="text-[11px] text-slate-350 flex items-start gap-1">
                            <span className="text-emerald-500 shrink-0 select-none">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-455 block mb-1">Limitations</span>
                      <ul className="space-y-1">
                        {m.cons.map((c, idx) => (
                          <li key={idx} className="text-[11px] text-slate-450 flex items-start gap-1">
                            <span className="text-rose-500 shrink-0 select-none">✗</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-proscons-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>

              {/* LOCAL DEPLOYMENT COMMAND */}
              <tr>
                <td className="p-4 text-slate-400 font-bold uppercase tracking-wider font-mono text-[9px] bg-brand-bg/40">Ollama Bootup CLI</td>
                {compareList.map((m) => (
                  <td key={m.id} className="p-4 border-l border-brand-border/40">
                    <div className="bg-brand-bg border border-brand-border rounded-md p-3 flex flex-col justify-between h-full space-y-2">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Local terminal run:</span>
                      <div className="flex items-center justify-between gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-sm border border-brand-border font-mono text-[10px] text-slate-300 break-all select-all">
                        <span>{m.deployment.runCommand}</span>
                        <button
                          onClick={() => copyCommand(m.id, m.deployment.runCommand)}
                          className="shrink-0 p-1 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 cursor-pointer border border-transparent hover:border-brand-border rounded-sm transition-all"
                          title="Copy command"
                          id={`copy-table-cmd-${m.id}`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {copiedId === m.id && (
                        <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase block text-right">Copied CLI!</span>
                      )}
                    </div>
                  </td>
                ))}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <td key={`pad-deploy-${i}`} className="p-4 text-slate-700 border-l border-brand-border/40"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <ProUnlockModal 
        isOpen={isUnlockOpen} 
        onClose={() => setIsUnlockOpen(false)} 
        featureName="Compare Matrix" 
      />
    </div>
  );
}
