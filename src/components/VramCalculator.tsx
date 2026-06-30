import React, { useState, useMemo } from 'react';
import { ModelMetadata, QUANTIZATION_OPTIONS, OPEN_SOURCE_MODELS } from '../data/models';
import { Cpu, Server, Laptop, Sliders, Info, ShieldAlert, CheckCircle2, ShieldAlert as LockIcon } from 'lucide-react';
import ProUnlockModal from './ProUnlockModal';

interface VramCalculatorProps {
  initialModelId?: string;
  models: ModelMetadata[];
}

export default function VramCalculator({ initialModelId, models }: VramCalculatorProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    initialModelId || models[0]?.id || 'llama-3.3-70b-instruct'
  );
  const [selectedQuantId, setSelectedQuantId] = useState<string>('q4_k_m');
  const [contextLength, setContextLength] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);

  const model = useMemo(() => {
    return models.find((m) => m.id === selectedModelId) || models[0];
  }, [selectedModelId, models]);

  const quant = useMemo(() => {
    return QUANTIZATION_OPTIONS.find((q) => q.id === selectedQuantId) || QUANTIZATION_OPTIONS[2];
  }, [selectedQuantId]);

  // Handle setting valid context when model changes
  React.useEffect(() => {
    if (contextLength > model.contextWindow) {
      setContextLength(model.contextWindow);
    }
  }, [model, contextLength]);

  // Compute VRAM
  // Base parameter size in billions
  const paramCount = parseFloat(model.parameters.replace(/[^\d.]/g, ''));
  const isMoE = model.parameters.toLowerCase().includes('moe');
  
  // Weights size: params * multiplier
  const weightsMemoryGb = paramCount * quant.memoryMultiplier;
  
  // KV cache memory (simplified real estimation: 2 * batch * context * parameters * 0.00012)
  const kvCacheMemoryGb = contextLength * batchSize * paramCount * 0.00011;
  const systemOverheadGb = 2.0; // runtime context overhead
  
  const totalMemoryGb = parseFloat((weightsMemoryGb + kvCacheMemoryGb + systemOverheadGb).toFixed(1));

  // Determine Hardware Recommendations
  const hardwareTier = useMemo(() => {
    if (totalMemoryGb <= 8) {
      return {
        title: 'Entry-Level Local',
        icon: <Laptop className="w-5 h-5 text-emerald-400" />,
        color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
        devices: [
          'Consumer Laptop / PC (16GB System RAM)',
          'Apple Mac Air/Pro (M1/M2/M3 with 16GB Unified Memory)',
          'NVIDIA RTX 3050 (8GB) or RTX 4060 (8GB)',
          'High-end mobile phone (iPhone 16 Pro, Samsung S24 Ultra)'
        ],
        details: 'Runs beautifully offline at high speeds with perfect local utility.'
      };
    } else if (totalMemoryGb <= 16) {
      return {
        title: 'Mid-Range Developer',
        icon: <Laptop className="w-5 h-5 text-teal-400" />,
        color: 'border-teal-500/20 bg-teal-500/5 text-teal-300',
        devices: [
          'Common Developer Laptop / Desktop (32GB System RAM)',
          'Apple Mac Air/Pro/Mini with 24GB or 36GB Unified RAM',
          'NVIDIA RTX 4060 Ti (16GB) or RTX 3060 (12GB)',
          'NVIDIA RTX 4070 / 4080 (12GB/16GB VRAM)'
        ],
        details: 'Highly responsive. Excellent for building local RAG pipelines and coding assistants.'
      };
    } else if (totalMemoryGb <= 24) {
      return {
        title: 'Enthusiast / Single Pro GPU',
        icon: <Cpu className="w-5 h-5 text-indigo-400" />,
        color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-300',
        devices: [
          'Single NVIDIA RTX 3090 or RTX 4090 (24GB VRAM)',
          'NVIDIA RTX 5000 / RTX A5000 (24GB)',
          'Apple Mac Studio / MacBook Pro with 48GB or 64GB Unified Memory',
          'Standard Cloud VM (RTX 4090) on RunPod/Vast.ai'
        ],
        details: 'The professional standard. Fast inference, supports larger context windows with low quantization loss.'
      };
    } else if (totalMemoryGb <= 48) {
      return {
        title: 'Professional Workstation',
        icon: <Cpu className="w-5 h-5 text-violet-400" />,
        color: 'border-violet-500/20 bg-violet-500/5 text-violet-305',
        devices: [
          'Dual NVIDIA RTX 3090/4090 GPUs (48GB combined VRAM)',
          'Single NVIDIA RTX 6000 Ada (48GB VRAM) or A6000',
          'Apple Mac Studio / Mac Pro with 64GB or 96GB Unified Memory',
          'Enterprise Cloud Instance (1x A40 or A100-40GB)'
        ],
        details: 'Capable of serving production requests for small startup applications.'
      };
    } else if (totalMemoryGb <= 128) {
      return {
        title: 'Multi-GPU Cluster Node',
        icon: <Server className="w-5 h-5 text-amber-400" />,
        color: 'border-amber-500/20 bg-amber-500/5 text-amber-300',
        devices: [
          'Triple / Quad NVIDIA RTX 4090 setup with NVLink (72GB-96GB VRAM)',
          'Dual NVIDIA A100 (80GB each) or H100',
          'Apple Mac Studio with 128GB or 192GB Unified Memory',
          'Dedicated GPU cloud VM (A100-80GB / H100)'
        ],
        details: 'Intense computing layer. Outstanding option for running top-tier 70B models at full precision.'
      };
    } else {
      return {
        title: 'Datacenter / Enterprise Cluster',
        icon: <Server className="w-5 h-5 text-rose-400" />,
        color: 'border-rose-500/20 bg-rose-500/5 text-rose-300',
        devices: [
          '8x NVIDIA A100 / H100 (80GB SXM) clustered node server',
          'Clustered serverless hosts (Groq, OctoAI, Hugging Face Pro TGI)',
          'High-end custom rackmount workstation with multiple professional server cards'
        ],
        details: 'Requires complex networking, vLLM tensor-parallel pipelines, or specialized serverless hosting.'
      };
    }
  }, [totalMemoryGb]);

  return (
    <div className="bg-brand-card border border-brand-border rounded-md p-6 font-sans shadow-xl animate-fade-in" id="vram-calculator-widget">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-5 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Hardware & VRAM Estimator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate memory parameters and predict hardware compatibility before downloading.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsUnlockOpen(true)}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 hover:from-indigo-500/20 hover:to-emerald-500/20 text-indigo-300 hover:text-indigo-200 px-3 py-1.5 rounded-full border border-indigo-500/30 cursor-pointer animate-pulse font-bold uppercase"
          >
            <LockIcon className="w-3 h-3 text-indigo-400" />
            Unlock Unlimited Pro Mode
          </button>
          <span className="text-[9px] font-mono tracking-widest bg-slate-900 text-slate-400 px-2.5 py-1 rounded-sm border border-brand-border font-bold uppercase">
            {model.provider}
          </span>
          <span className="text-[9px] font-mono tracking-widest bg-indigo-500/5 text-indigo-300 px-2.5 py-1 rounded-sm border border-indigo-500/20 font-bold uppercase">
            {model.parameters} Parameters
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Model Selector */}
          <div>
            <label className="block text-[9px] font-semibold text-slate-500 uppercase tracking-widest mb-2 font-mono">
              1. Select Model
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => {
                setSelectedModelId(e.target.value);
                setIsUnlockOpen(true);
              }}
              className="w-full bg-brand-bg border border-brand-border hover:border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
              id="calc-model-selector"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.parameters} - {m.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Quantization selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[9px] font-semibold text-slate-500 uppercase tracking-widest font-mono">
                2. Quantization Level (Bitrate)
              </label>
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">{quant.bitsPerWeight} bits/weight</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUANTIZATION_OPTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuantId(q.id);
                    setIsUnlockOpen(true);
                  }}
                  className={`p-3 rounded-md border text-left transition-all relative ${
                    selectedQuantId === q.id
                      ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400 font-bold'
                      : 'border-brand-border bg-brand-bg/30 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  id={`calc-quant-btn-${q.id}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-sans">{q.name}</span>
                    {selectedQuantId === q.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed line-clamp-2">
                    {q.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest font-mono">
                  3. Target Context Length
                </span>
                <span className="text-xs text-indigo-400 font-mono font-bold">
                  {contextLength.toLocaleString()} / {model.contextWindow.toLocaleString()} TOKENS
                </span>
              </div>
              <input
                type="range"
                min={1024}
                max={model.contextWindow}
                step={1024}
                value={contextLength}
                onChange={(e) => {
                  setContextLength(parseInt(e.target.value));
                  setIsUnlockOpen(true);
                }}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                id="calc-context-slider"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 font-semibold uppercase tracking-wider">
                <span>1K tokens</span>
                <span>Max ({model.contextWindow >= 100000 ? `${model.contextWindow / 1000}k` : model.contextWindow})</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest font-mono">
                  4. Concurrent Requests (Batch Size)
                </span>
                <span className="text-xs text-indigo-400 font-mono font-bold">{batchSize} ACTIVE USERS</span>
              </div>
              <input
                type="range"
                min={1}
                max={16}
                step={1}
                value={batchSize}
                onChange={(e) => {
                  setBatchSize(parseInt(e.target.value));
                  setIsUnlockOpen(true);
                }}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                id="calc-batch-slider"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 font-semibold uppercase tracking-wider">
                <span>1 (Single Dev)</span>
                <span>16 (Micro-Server)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Output Estimation Visualization Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-brand-bg/40 border border-brand-border rounded-md p-5 space-y-4">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold block uppercase mb-1">
              Estimated Local Overhead
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight font-mono">
                {totalMemoryGb}
              </span>
              <span className="text-lg font-bold text-indigo-400 font-mono font-semibold uppercase">GB</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Estimated Total System RAM or GPU VRAM required.
            </p>

            {/* Breakdown */}
            <div className="mt-4 space-y-2 border-t border-brand-border pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-sans">Model Weights ({quant.name}):</span>
                <span className="text-slate-300 font-mono font-bold">{weightsMemoryGb.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-sans">KV Cache ({contextLength.toLocaleString()} tokens):</span>
                <span className="text-slate-300 font-mono font-bold">{kvCacheMemoryGb.toFixed(2)} GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-sans">Inference Engine Overhead:</span>
                <span className="text-slate-300 font-mono font-bold">{systemOverheadGb.toFixed(1)} GB</span>
              </div>
            </div>
          </div>

          {/* Hardware Recommendation tier block */}
          <div className={`border rounded-md p-4 flex flex-col ${hardwareTier.color}`}>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-mono mb-2">
              {hardwareTier.icon}
              <span>Class: {hardwareTier.title}</span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed font-sans font-medium">
              {hardwareTier.details}
            </p>
            <div className="border-t border-white/10 pt-2.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                Recommended Specs:
              </span>
              <ul className="space-y-1">
                {hardwareTier.devices.map((device, idx) => (
                  <li key={idx} className="text-[11px] flex items-start gap-1.5 text-slate-350">
                    <span className="text-indigo-400 shrink-0 select-none">•</span>
                    <span className="font-sans">{device}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Warning info */}
          <div className="flex items-start gap-2 bg-brand-card border border-brand-border p-3 rounded-md text-[11px] text-slate-400 leading-relaxed font-sans">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Pro-tip:</span> If VRAM is too small to host weights fully, you can run GGUF layers split across CPU and GPU RAM using Ollama, which slows down generation speeds but avoids out-of-memory crashes.
            </div>
          </div>
        </div>
      </div>

      <ProUnlockModal 
        isOpen={isUnlockOpen} 
        onClose={() => setIsUnlockOpen(false)} 
        featureName="VRAM Predictor" 
      />
    </div>
  );
}
