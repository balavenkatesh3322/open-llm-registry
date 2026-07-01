import React, { useState } from 'react';
import { ModelMetadata } from '../data/models';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Copy, 
  Check, 
  BookOpen, 
  Activity, 
  Sparkles, 
  Lock, 
  Unlock, 
  Hash, 
  ChevronRight, 
  MessageSquare,
  Zap,
  Layers,
  FileCode,
  CornerDownRight
} from 'lucide-react';

interface ModelDeveloperSandboxProps {
  model: ModelMetadata;
  onSelectVramModel: (id: string) => void;
}

type SandboxTab = 'specs' | 'cli' | 'sdk' | 'prompt';

export default function ModelDeveloperSandbox({ model, onSelectVramModel }: ModelDeveloperSandboxProps) {
  const [activeTab, setActiveTab] = useState<SandboxTab>('specs');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCli, setSelectedCli] = useState<'ollama' | 'vllm' | 'llamacpp' | 'hf'>('ollama');
  const [selectedSdk, setSelectedSdk] = useState<'python' | 'node' | 'curl'>('python');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine the model prompt template structure based on the provider
  const promptTemplate = React.useMemo(() => {
    const prov = model.provider.toLowerCase();
    const name = model.name.toLowerCase();

    if (prov.includes('meta') || name.includes('llama')) {
      return {
        name: 'Llama 3 Instruct Format',
        desc: 'Uses specialized `<|start_header_id|>` and `<|end_header_id|>` boundaries with `<|eot_id|>` markers.',
        code: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful and precise assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

Write a secure React custom hook for state persistence in localStorage.<|eot_id|><|start_header_id|>assistant<|end_header_id|>
`
      };
    } else if (prov.includes('google') || name.includes('gemma')) {
      return {
        name: 'Gemma 2 Chat Blueprint',
        desc: 'Google’s native `<start_of_turn>` and `<end_of_turn>` block syntax.',
        code: `<start_of_turn>user
Write a secure React custom hook for state persistence in localStorage.<end_of_turn>
<start_of_turn>model
`
      };
    } else if (prov.includes('deepseek') || prov.includes('qwen') || name.includes('qwen') || name.includes('deepseek')) {
      return {
        name: 'ChatML (Markup Language) Standard',
        desc: 'Standardized `<|im_start|>` and `<|im_end|>` tags. Highly robust against system prompts leakage.',
        code: `<|im_start|>system
You are a helpful and precise assistant.<|im_end|>
<|im_start|>user
Write a secure React custom hook for state persistence in localStorage.<|im_end|>
<|im_start|>assistant
`
      };
    } else {
      return {
        name: 'Alpaca / Instruction-Response',
        desc: 'Plain text instruction framing for traditional completion models.',
        code: `### Instruction:
Write a secure React custom hook for state persistence in localStorage.

### Response:
`
      };
    }
  }, [model]);

  // CLI Command generation
  const cliCommands = {
    ollama: {
      label: 'Ollama CLI',
      desc: 'Simplest offline runner for local laptops and consumer systems.',
      cmd: `ollama run ${model.deployment.ollamaId || model.id}`
    },
    vllm: {
      label: 'vLLM Engine (Cloud)',
      desc: 'Highly efficient, continuous batching OpenAI-compatible server engine for production multi-GPU environments.',
      cmd: `python -m vllm.entrypoints.openai.api_server \\
  --model ${model.deployment.vllmId || model.deployment.hfRepo} \\
  --port 8000 \\
  --gpu-memory-utilization 0.90 \\
  --max-model-len ${Math.min(model.contextWindow, 8192)}`
    },
    llamacpp: {
      label: 'Llama.cpp (GGUF)',
      desc: 'Zero-dependency C++ engine compiled for high-speed CPU/GPU hybrid inference.',
      cmd: `./llama-cli -m ./${model.id}.Q4_K_M.gguf \\
  -p "<|system|>You are a helpful assistant.<|user|>Hello!<|assistant|>" \\
  -cnv --threads 8`
    },
    hf: {
      label: 'HuggingFace Hub CLI',
      desc: 'Direct CLI utility to download full weight checkpoints into local cache.',
      cmd: `huggingface-cli download ${model.deployment.hfRepo} \\
  --local-dir ./models/${model.id} \\
  --exclude "*.bin" "*.safetensors" # Exclude duplicates if selecting custom formats`
    }
  };

  // Code integration snippets
  const sdkSnippets = {
    python: {
      label: 'Python Client SDK',
      desc: 'Standard OpenAI-compatible python integration targeting local server.',
      code: `import openai

# Connect to Ollama (11434) or vLLM / LM Studio (8000)
client = openai.OpenAI(
    base_url="http://localhost:11434/v1", # Replace with http://localhost:8000/v1 for vLLM
    api_key="none_required"
)

response = client.chat.completions.create(
    model="${model.deployment.ollamaId || model.id}",
    messages=[
        {"role": "system", "content": "You are a professional software engineer."},
        {"role": "user", "content": "Optimise this database query for PostgreSQL: SELECT * FROM users;"}
    ],
    temperature=0.2,
    max_tokens=1024
)

print(response.choices[0].message.content)`
    },
    node: {
      label: 'Node.js / JS Client',
      desc: 'TypeScript/JavaScript integration using official OpenAI library.',
      code: `import OpenAI from 'openai';

// Connects directly to local Ollama, LM Studio, or vLLM local ports
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1', // Target 11434 for Ollama, 8000 for vLLM
  apiKey: 'none_required',
});

async function runLocalAssistant() {
  const completion = await openai.chat.completions.create({
    model: '${model.deployment.ollamaId || model.id}',
    messages: [
      { role: 'system', content: 'You are an elite developer.' },
      { role: 'user', content: 'Write a typescript wrapper for fetch API.' },
    ],
    temperature: 0.1,
  });

  console.log(completion.choices[0].message.content);
}

runLocalAssistant();`
    },
    curl: {
      label: 'cURL API Request',
      desc: 'Low-level HTTP POST request to local localhost ports.',
      code: `curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.deployment.ollamaId || model.id}",
    "messages": [
      {"role": "user", "content": "How do I resolve a split-brain issue in Elasticsearch?"}
    ],
    "temperature": 0.3
  }'`
    }
  };

  return (
    <div className="bg-slate-900/30 rounded-lg border border-brand-border/60 overflow-hidden font-sans shadow-md" id={`dev-sandbox-${model.id}`}>
      {/* Sandbox Header / Tab Selector */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-500/15 rounded border border-indigo-500/30 text-indigo-400">
            <Terminal className="w-3.5 h-3.5" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-150 uppercase tracking-wider font-display flex items-center gap-1.5">
              <span>Developer Integration Playground</span>
              <span className="text-[8px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded">V2.5 API</span>
            </h4>
            <p className="text-[9px] text-slate-500 font-mono">Instant local setup & pipeline configurations</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/80 p-0.5 rounded border border-brand-border/40 text-[10px] font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ CLI Run
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'sdk'
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💻 SDK Client
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Prompt Token
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-4 bg-slate-950/40 min-h-[220px]">
        {/* TAB 1: OVERVIEW & SPECS */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-slate-300 animate-fade-in" id="panel-overview">
            <div className="md:col-span-4 space-y-3.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Candid Summary</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{model.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/60 p-2.5 rounded border border-brand-border/40">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Base Size</span>
                  <span className="text-xs font-bold font-mono text-indigo-400">{model.parameters} Parameters</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-brand-border/40">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Context Scale</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">{(model.contextWindow / 1000).toLocaleString()}k Tokens</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1.5">Curated Architect Strengths</span>
                <ul className="space-y-1.5 text-xs">
                  {model.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-350">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-1">
                <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-widest block mb-1.5">Runtime Bottlenecks / Challenges</span>
                <ul className="space-y-1.5 text-xs">
                  {model.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-450 text-slate-400">
                      <Layers className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Licensing safety</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                    model.commercialAllowed 
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                  }`}>
                    {model.commercialAllowed ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{model.commercialAllowed ? 'COMMERCIAL SAFE' : 'ACADEMIC / RESEARCH ONLY'}</span>
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded border border-brand-border/40 space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Hugging Face Repository</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-300 truncate select-all">{model.deployment.hfRepo}</span>
                    <button
                      onClick={() => copyToClipboard(model.deployment.hfRepo, 'hf-repo')}
                      className="p-1 hover:bg-slate-900 rounded text-indigo-400 hover:text-indigo-300 cursor-pointer shrink-0"
                      title="Copy Repository Path"
                    >
                      {copiedId === 'hf-repo' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectVramModel(model.id)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_2px_10px_rgba(99,102,241,0.2)] text-white rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-500/30"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Estimate VRAM Budget</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CLI LAUNCHERS */}
        {activeTab === 'cli' && (
          <div className="space-y-4 animate-fade-in" id="panel-cli">
            <div className="flex flex-wrap gap-2 border-b border-brand-border/20 pb-2">
              {(Object.keys(cliCommands) as Array<keyof typeof cliCommands>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCli(key)}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                    selectedCli === key
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/80 border-brand-border/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cliCommands[key].label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-sans">
                💡 <span className="font-semibold text-slate-300">{cliCommands[selectedCli].label}</span>: {cliCommands[selectedCli].desc}
              </p>

              <div className="relative rounded-md bg-slate-950 border border-brand-border/80 overflow-hidden">
                {/* Visual Window Header */}
                <div className="bg-slate-900/80 px-4 py-1.5 border-b border-brand-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold ml-1.5">bash — local terminal</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cliCommands[selectedCli].cmd, `cli-${selectedCli}`)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy to Clipboard"
                  >
                    {copiedId === `cli-${selectedCli}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] font-mono font-bold text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono font-bold">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 overflow-x-auto text-[11px] sm:text-xs font-mono text-indigo-300 leading-relaxed max-h-[160px] scrollbar-thin select-all">
                  <code>{cliCommands[selectedCli].cmd}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SDK INTEGRATIONS */}
        {activeTab === 'sdk' && (
          <div className="space-y-4 animate-fade-in" id="panel-sdk">
            <div className="flex flex-wrap gap-2 border-b border-brand-border/20 pb-2">
              {(Object.keys(sdkSnippets) as Array<keyof typeof sdkSnippets>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedSdk(key)}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                    selectedSdk === key
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/80 border-brand-border/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sdkSnippets[key].label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-sans">
                🔗 <span className="font-semibold text-slate-300">{sdkSnippets[selectedSdk].label}</span>: {sdkSnippets[selectedSdk].desc}
              </p>

              <div className="relative rounded-md bg-slate-950 border border-brand-border/80 overflow-hidden">
                {/* Visual Window Header */}
                <div className="bg-slate-900/80 px-4 py-1.5 border-b border-brand-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold ml-1.5">
                      {selectedSdk === 'python' ? 'assistant.py' : selectedSdk === 'node' ? 'assistant.ts' : 'request.sh'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(sdkSnippets[selectedSdk].code, `sdk-${selectedSdk}`)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy to Clipboard"
                  >
                    {copiedId === `sdk-${selectedSdk}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] font-mono font-bold text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono font-bold">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 overflow-x-auto text-[11px] sm:text-xs font-mono text-indigo-300 leading-relaxed max-h-[180px] scrollbar-thin select-all">
                  <code>{sdkSnippets[selectedSdk].code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROMPT BLUEPRINT */}
        {activeTab === 'prompt' && (
          <div className="space-y-3.5 animate-fade-in" id="panel-prompt">
            <div className="bg-slate-950/60 p-3 rounded border border-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Model Prompt Schema</span>
                <h4 className="text-sm font-extrabold text-slate-200 mt-0.5">{promptTemplate.name}</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/20 text-indigo-300">
                Validated format
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              ⚠️ <span className="font-semibold text-slate-300">Important Instruction:</span> {promptTemplate.desc} Missing these special system tokens will cause local LLMs to hallucinate, repeat outputs, or break context retention.
            </p>

            <div className="relative rounded-md bg-slate-950 border border-brand-border/80 overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-1.5 border-b border-brand-border/40 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">exact prompt structure</span>
                <button
                  onClick={() => copyToClipboard(promptTemplate.code, 'prompt-template')}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedId === 'prompt-template' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[9px] font-mono font-bold text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono font-bold">Copy Format</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 overflow-x-auto text-[11px] sm:text-xs font-mono text-indigo-300 leading-relaxed max-h-[160px] scrollbar-thin select-all whitespace-pre-wrap">
                <code>{promptTemplate.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
