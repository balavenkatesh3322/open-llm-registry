import React, { useState } from 'react';
import { 
  Search, 
  Cpu, 
  Terminal, 
  Layers, 
  Check, 
  Copy, 
  ExternalLink, 
  Chrome, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  X,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ModelMetadata } from '../data/models';

export interface InferenceEngine {
  id: string;
  name: string;
  category: 'CLI' | 'Server' | 'Desktop App' | 'Developer Framework';
  developer: string;
  description: string;
  formats: string[];
  os: ('Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS')[];
  license: string;
  githubUrl: string;
  websiteUrl?: string;
  pros: string[];
  cons: string[];
  setupCommand: string;
  guideSteps: string[];
  bestModelTypes: string[];
}

const INFERENCE_ENGINES: InferenceEngine[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    category: 'CLI',
    developer: 'Ollama Team',
    description: 'A lightweight, extensible framework for building and running large language models locally. Ollama manages everything—model fetching, GPU offloading, and running a local OpenAI-compatible API server—with simple, single-word commands.',
    formats: ['GGUF'],
    os: ['macOS', 'Linux', 'Windows'],
    license: 'MIT',
    githubUrl: 'https://github.com/ollama/ollama',
    websiteUrl: 'https://ollama.com',
    pros: [
      'The absolute easiest way to run local models; zero compilation needed',
      'Extremely rich built-in model library (automatically downloads and caches)',
      'Provides an instant local API server compatible with OpenAI library schemas',
      'Stellar cross-platform GPU support (CUDA, Metal, ROCm) out of the box'
    ],
    cons: [
      'Strictly opinionated folder structure for storing models',
      'Harder to fine-tune specific parameters (like temperature, raw prompt formatting) via command line prompts without creating a Modelfile'
    ],
    setupCommand: 'curl -fsSL https://ollama.com/install.sh | sh',
    guideSteps: [
      'Download and install Ollama for your operating system (Mac, Windows, or Linux script).',
      'Open your terminal and check the version: ollama --version',
      'Download and run any model instantly. For example: ollama run llama3.2:3b',
      'Ollama hosts a local API on http://localhost:11434, which you can connect to any visual chat UI.'
    ],
    bestModelTypes: ['Llama 3.2', 'DeepSeek-R1', 'Qwen 2.5 Coder', 'Phi-4', 'Gemma 2']
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    category: 'Developer Framework',
    developer: 'Georgi Gerganov & Contributors',
    description: 'The foundation of the local LLM revolution. Written in pure, highly optimized C/C++, llama.cpp provides bare-metal, dependency-free inference for GGUF formats. It achieves incredible CPU/GPU acceleration across a wide variety of hardware architectures.',
    formats: ['GGUF'],
    os: ['macOS', 'Linux', 'Windows', 'Android', 'iOS'],
    license: 'MIT',
    githubUrl: 'https://github.com/ggerganov/llama.cpp',
    pros: [
      'Peak execution performance and maximum memory efficiency with GGUF',
      'Zero dependencies; compiles on virtually any machine with a modern compiler',
      'Supports extreme custom quantization levels (from 2-bit to 8-bit)',
      'Highly portable, powering downstream desktop tools and libraries'
    ],
    cons: [
      'Steep learning curve; requires compiling from source or using complex CLI flags',
      'No built-in graphical interface; strictly CLI or API server'
    ],
    setupCommand: 'git clone https://github.com/ggerganov/llama.cpp.git && cd llama.cpp && make',
    guideSteps: [
      'Clone the repository and compile it locally using make (or cmake for Windows).',
      'Download your desired GGUF file from Hugging Face (e.g., Qwen-2.5-Coder-32B-GGUF).',
      'Run a CLI session using: ./llama-cli -m models/qwen-32b.gguf -p "Why is the sky blue?" -n 128',
      'Alternatively, spin up a lightweight, OpenAI-compatible web server: ./llama-server -m models/qwen-32b.gguf -c 4096 --port 8080'
    ],
    bestModelTypes: ['Qwen 2.5', 'Llama 3.3', 'Phi-4', 'Gemma 2', 'Mistral Large 2']
  },
  {
    id: 'vllm',
    name: 'vLLM',
    category: 'Server',
    developer: 'vLLM Project Team',
    description: 'A high-throughput, memory-efficient serving engine designed specifically for deployment in cloud, server, or cluster environments. Powered by PagedAttention, vLLM achieves up to 10x higher concurrency and request throughput than traditional libraries.',
    formats: ['GPTQ', 'AWQ', 'SafeTensors', 'FP16', 'GGUF'],
    os: ['Linux'],
    license: 'Apache-2.0',
    githubUrl: 'https://github.com/vllm-project/vllm',
    websiteUrl: 'https://vllm.ai',
    pros: [
      'State-of-the-art serving throughput powered by PagedAttention',
      'Advanced dynamic request batching minimizes token waiting times',
      'Fully OpenAI-compliant HTTP API out of the box',
      'Supports Distributed (multi-GPU) tensor parallel execution for massive models'
    ],
    cons: [
      'Not designed for consumer laptops or CPUs; strictly requires high-end Linux servers',
      'Extremely high GPU memory pre-allocation'
    ],
    setupCommand: 'pip install vllm',
    guideSteps: [
      'Ensure you have a Linux machine with an NVIDIA GPU (CUDA 12.1+) or AMD GPU.',
      'Install vLLM via pip: pip install vllm',
      'Spin up an API server loading your model: npx / python3 -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-Coder-32B-Instruct',
      'Query the server at http://localhost:8000 using standard OpenAI API client libraries.'
    ],
    bestModelTypes: ['DeepSeek-R1', 'Llama 3.3 70B', 'Qwen 2.5 72B', 'DeepSeek-V3', 'Mistral Large 2']
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    category: 'Desktop App',
    developer: 'LM Studio Team',
    description: 'The premier desktop app for exploring and running GGUF models locally. It packs an elegant visual chat UI, an integrated Hugging Face explorer to discover quantized variants, and a highly configurable local API server.',
    formats: ['GGUF'],
    os: ['Windows', 'macOS', 'Linux'],
    license: 'Proprietary (Free for Personal Use)',
    githubUrl: 'https://github.com/lmstudio-ai',
    websiteUrl: 'https://lmstudio.ai',
    pros: [
      'Stunning, polished graphical interface ideal for non-technical users',
      'Integrated Hugging Face search allows one-click GGUF discovery and downloads',
      'Extremely granular system prompts, parameters, and system hardware configuration slider controls',
      'Allows easy monitoring of hardware stats (tokens per second, RAM allocation)'
    ],
    cons: [
      'Closed-source core; raises licensing limits for corporate environments',
      'App is moderately heavy, adding overhead compared to bare metal CLI engines'
    ],
    setupCommand: '# Download installer from https://lmstudio.ai',
    guideSteps: [
      'Go to lmstudio.ai, download the installer for Windows, macOS (M-series / Intel), or Linux.',
      'Launch the application and use the search bar to find any open-weights model.',
      'Choose a specific quantization size (e.g., Q4_K_M) matching your VRAM budget and hit Download.',
      'Go to the Chat view to test the model offline, or start the Local Server in the API tab.'
    ],
    bestModelTypes: ['Llama 3.2', 'Phi-4', 'Gemma 2', 'Qwen 2.5 Coder', 'Llama 3.3']
  },
  {
    id: 'jan',
    name: 'Jan',
    category: 'Desktop App',
    developer: 'JanHQ',
    description: 'A 100% open-source, offline-first developer assistant that operates as a modular, local alternative to ChatGPT. Jan integrates llama.cpp and TensorRT-LLM engines to run models directly on your desktop.',
    formats: ['GGUF', 'TensorRT'],
    os: ['Windows', 'macOS', 'Linux'],
    license: 'AGPL-3.0',
    githubUrl: 'https://github.com/janhq/jan',
    websiteUrl: 'https://jan.ai',
    pros: [
      'Fully open-source under AGPL-3.0; privacy-first architecture',
      'Highly extensible via local plugins and customizable UI styles',
      'Nvidia TensorRT engine support provides extreme speeds on Windows workstations',
      'Very clean, keyboard-friendly IDE-style chat experience'
    ],
    cons: [
      'Model discovery search is slightly less extensive than LM Studio',
      'Plugin ecosystem is powerful but requires some developer knowledge to extend'
    ],
    setupCommand: '# Download the installer from https://jan.ai',
    guideSteps: [
      'Download Jan from the official website jan.ai or clone their release releases.',
      'Install the application and launch it on your desktop.',
      'Use the Model Hub to click and install recommended model configurations.',
      'Adjust system threads and GPU usage in the sidebar settings for optimized speeds.'
    ],
    bestModelTypes: ['Llama 3.2', 'Phi-4', 'Qwen 2.5 Coder', 'Gemma 2']
  },
  {
    id: 'koboldcpp',
    name: 'KoboldCPP',
    category: 'Server',
    developer: 'LostRuins',
    description: 'A highly functional, single-file alternative to run local models. KoboldCPP packages llama.cpp with an incredible web interface loaded with tools for writers, gamers, and advanced prompt customization (context shifting, smart story memory).',
    formats: ['GGUF'],
    os: ['Windows', 'Linux'],
    license: 'AGPL-3.0',
    githubUrl: 'https://github.com/LostRuins/koboldcpp',
    pros: [
      'Completely self-contained single-file executable; extremely portable',
      'Unmatched context shifting (bypasses processing prompts when context has only minor changes)',
      'Highly flexible memory-offloading slider configurations',
      'Vibrant community focusing on local narrative generation and RPG connectors'
    ],
    cons: [
      'Retro, slightly complex user interface that might look dated to modern developers',
      'Mainly focused on narrative and roleplay; less optimized for general software team tasks'
    ],
    setupCommand: '# Download single-file binary from koboldcpp github releases',
    guideSteps: [
      'Go to the KoboldCPP GitHub Releases page and download the single exe (Windows) or link (Linux).',
      'Run the executable and select your model file (.gguf).',
      'Configure the GPU layer offload count matching your VRAM.',
      'Click Launch! This opens a browser window (usually localhost:5001) to interact with your model.'
    ],
    bestModelTypes: ['Gemma 2 9B', 'Llama 3.3 70B', 'Mistral Large 2', 'Qwen 2.5 72B']
  },
  {
    id: 'mlx',
    name: 'MLX (Apple ML)',
    category: 'Developer Framework',
    developer: 'Apple Silicon ML Research',
    description: 'An Apple-native machine learning framework designed specifically for Apple Silicon (M1/M2/M3/M4) chips. MLX allows models to fully utilize Mac unified memory architecture, achieving mind-blowing processing speeds for on-device AI.',
    formats: ['MLX Weight Format', 'SafeTensors'],
    os: ['macOS'],
    license: 'MIT',
    githubUrl: 'https://github.com/ml-explore/mlx',
    pros: [
      'Stellar native optimization for Apple M-Series GPU and Neural Engine cores',
      'Unified memory lets Macs load gigantic models (like 70B models on a 128GB Mac) in full FP16 speed',
      'Extremely clean Python and C++ APIs designed specifically for Apple ecosystem'
    ],
    cons: [
      'Strictly restricted to macOS running Apple Silicon processors',
      'Requires pre-converting standard SafeTensors/PyTorch weights to MLX-native format'
    ],
    setupCommand: 'pip install mlx-lm',
    guideSteps: [
      'Ensure you are on an Apple Silicon Mac running macOS Sonoma or newer.',
      'Install the mlx-lm CLI utility: pip install mlx-lm',
      'Generate output using a Hugging Face MLX weight repo: mlx-lm.generate --model mlx-community/Llama-3.2-3B-Instruct-4bit --prompt "Write a short poem"',
      'Spin up an API server: mlx-lm.server --model mlx-community/Llama-3.2-3B-Instruct-4bit --port 8080'
    ],
    bestModelTypes: ['Llama 3.2', 'Llama 3.3 70B', 'Qwen 2.5 Coder', 'Gemma 2 27B', 'Phi-4']
  },
  {
    id: 'local-ai',
    name: 'LocalAI',
    category: 'Server',
    developer: 'Ettore Di Giacinto',
    description: 'The ultimate, self-hosted developer API gateway. LocalAI acts as a completely offline drop-in replacement for OpenAI’s standard HTTP specifications, allowing you to run text generation, speech-to-text (Whisper), image generation (Stable Diffusion), and vector embeddings in a single container.',
    formats: ['GGUF', 'GPTQ', 'AWQ', 'SafeTensors', 'ONNX'],
    os: ['Linux', 'macOS', 'Windows'],
    license: 'MIT',
    githubUrl: 'https://github.com/mudler/LocalAI',
    websiteUrl: 'https://localai.io',
    pros: [
      'Multi-modal pipeline running offline: Handles LLMs, Image generation, and TTS/STT',
      'Full API drop-in compatibility with OpenAI client libraries',
      'Easily deployable inside Docker or Kubernetes clusters',
      'Allows loading multiple models simultaneously and load-balancing requests'
    ],
    cons: [
      'Significantly higher setup complexity; configured using YAML structures',
      'Requires larger system resources to host multi-modal services concurrently'
    ],
    setupCommand: 'docker run -p 8080:8080 --name local-ai -ti localai/localai:latest-aio',
    guideSteps: [
      'Install Docker on your system (Linux, Windows WSL, or Mac).',
      'Run the LocalAI All-In-One (aio) Docker image to launch standard LLM and Whisper nodes.',
      'Or create a custom YAML configuration detailing your local GGUF models path directory.',
      'Access the endpoint at http://localhost:8080/v1 to route requests.'
    ],
    bestModelTypes: ['Phi-4', 'Llama 3.2', 'Gemma 2 9B', 'Qwen 2.5 Coder']
  }
];

interface InferenceEnginesPanelProps {
  models: ModelMetadata[];
}

export default function InferenceEnginesPanel({ models }: InferenceEnginesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedOs, setSelectedOs] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<InferenceEngine | null>(null);

  const handleCopyCommand = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Categories
  const categories = ['All', 'CLI', 'Server', 'Desktop App', 'Developer Framework'];
  const formats = ['All', 'GGUF', 'EXL2', 'AWQ', 'SafeTensors', 'MLX Weight Format'];
  const osList = ['All', 'Windows', 'macOS', 'Linux', 'Android', 'iOS'];

  const filteredEngines = INFERENCE_ENGINES.filter((engine) => {
    const matchesSearch = 
      engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.developer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || engine.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || engine.formats.includes(selectedFormat);
    const matchesOs = selectedOs === 'All' || engine.os.includes(selectedOs as any);

    return matchesSearch && matchesCategory && matchesFormat && matchesOs;
  });

  return (
    <div className="space-y-6" id="engines-panel-root">
      
      {/* Intro Header */}
      <div className="bg-brand-card border border-brand-border rounded-md p-6 relative overflow-hidden" id="engines-hero">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/35 px-2 py-0.5 rounded text-[10px] text-indigo-400 font-mono uppercase tracking-widest font-bold">
            Local Run Companion
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-display">
            Local LLM Inference Engines & Platforms
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Once you calculate VRAM and select an open-weight model, you need a local runner to serve it on your local machine. This directory presents the gold-standard, community-vetted local inference software pipelines from the <a href="https://github.com/0xSojalSec/LLMs-local" target="_blank" referrerPolicy="no-referrer" className="text-indigo-400 underline hover:text-indigo-300">LLMs-local index</a>.
          </p>
        </div>
      </div>

      {/* Control Panel: Filters & Search */}
      <div className="bg-brand-card border border-brand-border p-4 rounded-md shadow-md space-y-4" id="engines-filter-bar">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search engines (e.g., Ollama, llama.cpp, vLLM)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-brand-bg border border-brand-border rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              id="engines-search-input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-brand-bg border border-brand-border text-slate-300 text-[11px] rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-brand-bg border border-brand-border text-slate-300 text-[11px] rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                {formats.map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">OS Support:</span>
              <select
                value={selectedOs}
                onChange={(e) => setSelectedOs(e.target.value)}
                className="bg-brand-bg border border-brand-border text-slate-300 text-[11px] rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                {osList.map((os) => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="engines-list-grid">
        {filteredEngines.length === 0 ? (
          <div className="col-span-full bg-brand-card border border-brand-border p-12 text-center rounded-md space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Inference Engines Found</h3>
            <p className="text-xs text-slate-500">Try loosening your search query or dropdown filter selections.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedFormat('All');
                setSelectedOs('All');
              }}
              className="text-xs text-indigo-400 font-semibold underline hover:text-indigo-300 mt-2 block mx-auto cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEngines.map((engine) => {
            // Find compatible model weights in index
            const compatibleModelsInIndex = models.filter((m) => {
              // Quick heuristical mapping
              return engine.bestModelTypes.some(type => 
                m.name.toLowerCase().includes(type.toLowerCase()) || 
                m.id.toLowerCase().includes(type.toLowerCase().replace(' ', '-'))
              );
            });

            return (
              <div 
                key={engine.id}
                className="bg-brand-card border border-brand-border hover:border-indigo-500/40 rounded-md p-5 flex flex-col justify-between transition-all duration-200 hover:translate-y-[-2px] shadow-sm relative group"
                id={`engine-card-${engine.id}`}
              >
                {/* Visual Accent bar depending on Category */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-md ${
                  engine.category === 'CLI' ? 'bg-amber-500/40' :
                  engine.category === 'Server' ? 'bg-rose-500/40' :
                  engine.category === 'Desktop App' ? 'bg-emerald-500/40' : 'bg-indigo-500/40'
                }`} />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{engine.developer}</span>
                      <h3 className="text-sm font-bold text-slate-200 font-display tracking-tight group-hover:text-indigo-400 transition-colors">
                        {engine.name}
                      </h3>
                    </div>
                    
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      engine.category === 'CLI' ? 'bg-amber-500/5 border-amber-500/15 text-amber-300' :
                      engine.category === 'Server' ? 'bg-rose-500/5 border-rose-500/15 text-rose-300' :
                      engine.category === 'Desktop App' ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300' :
                      'bg-indigo-500/5 border-indigo-500/15 text-indigo-300'
                    }`}>
                      {engine.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-3 mb-4">
                    {engine.description}
                  </p>

                  {/* Compatibility Tags */}
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] font-mono text-slate-500 font-bold mr-1">Formats:</span>
                      {engine.formats.map(fmt => (
                        <span key={fmt} className="text-[9px] font-mono font-bold bg-slate-900 border border-brand-border text-slate-300 px-1 py-0.5 rounded">
                          {fmt}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] font-mono text-slate-500 font-bold mr-1">OS:</span>
                      {engine.os.map(osName => (
                        <span key={osName} className="text-[9px] font-sans text-slate-400 bg-slate-900/40 px-1.5 py-0.5 rounded">
                          {osName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="border-t border-brand-border/40 pt-4 mt-auto space-y-3">
                  
                  {/* Setup code pill for quick CLI runners */}
                  {engine.setupCommand.startsWith('#') ? (
                    <div className="text-[10px] font-mono text-slate-500 italic bg-brand-bg/50 px-2.5 py-1.5 rounded border border-brand-border/40">
                      Installer-based execution setup
                    </div>
                  ) : (
                    <div className="bg-brand-bg rounded border border-brand-border p-2 flex items-center justify-between gap-2 relative">
                      <code className="text-[9.5px] font-mono text-slate-300 truncate tracking-tight">
                        {engine.setupCommand}
                      </code>
                      <button
                        onClick={() => handleCopyCommand(engine.id, engine.setupCommand)}
                        className="p-1 bg-slate-900 hover:bg-slate-800 rounded border border-brand-border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy setup command"
                      >
                        {copiedId === engine.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedEngine(engine)}
                      className="flex-1 text-[10px] font-bold py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-center transition-all cursor-pointer shadow-sm"
                    >
                      View Installation Guide
                    </button>
                    <a
                      href={engine.githubUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-brand-border hover:border-slate-700 rounded transition-colors"
                      title="GitHub Repository"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail / Guide Modal */}
      {selectedEngine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="engine-modal">
          <div className="bg-brand-card border border-brand-border max-w-2xl w-full rounded-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Top header decoration line */}
            <div className="h-1 bg-indigo-600" />

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">{selectedEngine.developer}</span>
                  <h3 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
                    {selectedEngine.name} Setup Guide
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEngine(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-md border border-brand-border text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {selectedEngine.description}
              </p>

              {/* Quick Config Specs */}
              <div className="grid grid-cols-2 gap-4 bg-brand-bg border border-brand-border/60 p-4 rounded-md">
                <div>
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase font-bold">Platform Category</span>
                  <p className="text-xs font-bold text-slate-300 mt-0.5">{selectedEngine.category}</p>
                </div>
                <div>
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase font-bold">Release License</span>
                  <p className="text-xs font-bold text-slate-300 mt-0.5">{selectedEngine.license}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-brand-border/40">
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase font-bold">Supported Weights Formats</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEngine.formats.map(fmt => (
                      <span key={fmt} className="text-[9px] font-mono font-bold bg-slate-900 border border-brand-border/60 text-slate-300 px-1.5 py-0.5 rounded">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Deployment Walkthrough */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 font-display">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Step-by-Step Setup Pipeline</span>
                </h4>
                
                <div className="space-y-3">
                  {selectedEngine.guideSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed flex-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros vs Cons Double-Column list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border/40">
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono tracking-wider font-bold uppercase text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pros / Strengths</span>
                  </h5>
                  <ul className="space-y-1.5 list-none">
                    {selectedEngine.pros.map((pro, idx) => (
                      <li key={idx} className="text-[10.5px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono tracking-wider font-bold uppercase text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Cons / Trade-offs</span>
                  </h5>
                  <ul className="space-y-1.5 list-none">
                    {selectedEngine.cons.map((con, idx) => (
                      <li key={idx} className="text-[10.5px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best Recommended model architectures */}
              <div className="pt-3 border-t border-brand-border/40">
                <h4 className="text-[10px] font-mono tracking-wider font-bold uppercase text-slate-400 mb-2">
                  Excellent For Serving These Model Architectures:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEngine.bestModelTypes.map(type => (
                    <span key={type} className="text-[10px] bg-slate-900 border border-brand-border text-slate-300 px-2.5 py-1 rounded-sm font-sans">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="bg-brand-nav/65 border-t border-brand-border p-4 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedEngine(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-brand-border hover:border-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedEngine.githubUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Visit GitHub Repository</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
