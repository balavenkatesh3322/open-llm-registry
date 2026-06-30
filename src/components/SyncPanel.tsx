import React, { useState } from 'react';
import { ModelMetadata } from '../data/models';
import { 
  RefreshCw, 
  Database, 
  Plus, 
  Check, 
  Copy, 
  ArrowRight, 
  ThumbsUp, 
  Download, 
  Sparkles, 
  Trash2, 
  Calendar, 
  Terminal, 
  AlertCircle,
  FileCode,
  ExternalLink,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';

interface SyncPanelProps {
  models: ModelMetadata[];
  onUpdateModels: (updatedModels: ModelMetadata[]) => void;
}

export default function SyncPanel({ models, onUpdateModels }: SyncPanelProps) {
  // Live fetch state
  const [hfRepoId, setHfRepoId] = useState('deepseek-ai/DeepSeek-R1-Distill-Qwen-14B');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<any | null>(null);

  // Form states for adding custom models
  const [modelId, setModelId] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelProvider, setModelProvider] = useState<'Meta' | 'Google' | 'Microsoft' | 'DeepSeek' | 'Mistral AI' | 'Alibaba Qwen' | 'Cohere' | 'Zhipu AI'>('DeepSeek');
  const [releaseDate, setReleaseDate] = useState('2025-01');
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState('14B');
  const [activeParameters, setActiveParameters] = useState('');
  const [contextWindow, setContextWindow] = useState(128000);
  const [license, setLicense] = useState('MIT');
  const [commercialAllowed, setCommercialAllowed] = useState(true);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(['Coding', 'General Assistant']);
  const [mmlu, setMmlu] = useState(80.5);
  const [humanEval, setHumanEval] = useState(82.6);
  const [gsm8k, setGsm8k] = useState(85.4);
  const [ollamaId, setOllamaId] = useState('');
  const [vllmId, setVllmId] = useState('');
  const [prosText, setProsText] = useState('High inference speed\n Permissive licensing');
  const [consText, setConsText] = useState('Slight performance drop on complex math\n Prone to repetitive text on high temperature');
  const [sizeInGb, setSizeInGb] = useState(28);

  // HF stats fetched from form
  const [formDownloads, setFormDownloads] = useState<number | undefined>(undefined);
  const [formLikes, setFormLikes] = useState<number | undefined>(undefined);
  const [formLastUpdated, setFormLastUpdated] = useState<string | undefined>(undefined);

  // UI state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const availableUseCases = ['Coding', 'General Assistant', 'Reasoning & Math', 'Multimodal / Vision', 'Local / On-device', 'Low-Latency'];

  // Handle live Hugging Face metadata retrieval
  const handleFetchHF = async () => {
    if (!hfRepoId.trim()) return;
    setIsFetching(true);
    setFetchError(null);
    setFetchedData(null);

    try {
      const response = await fetch(`https://huggingface.co/api/models/${hfRepoId.trim()}`);
      if (!response.ok) {
        throw new Error(`Model not found on Hugging Face (Status ${response.status})`);
      }
      const data = await response.json();
      setFetchedData(data);

      // Attempt to auto-fill the editor fields based on HF response
      const parts = hfRepoId.split('/');
      const rawName = parts[parts.length - 1];
      const parsedName = rawName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setModelId(rawName.toLowerCase());
      setModelName(parsedName);
      
      // Auto provider guess
      const author = parts[0].toLowerCase();
      if (author.includes('meta') || author.includes('llama')) setModelProvider('Meta');
      else if (author.includes('google') || author.includes('gemma')) setModelProvider('Google');
      else if (author.includes('microsoft') || author.includes('phi')) setModelProvider('Microsoft');
      else if (author.includes('deepseek')) setModelProvider('DeepSeek');
      else if (author.includes('mistral') || author.includes('mixtral')) setModelProvider('Mistral AI');
      else if (author.includes('qwen') || author.includes('alibaba')) setModelProvider('Alibaba Qwen');
      else if (author.includes('cohere')) setModelProvider('Cohere');
      else if (author.includes('thudm') || author.includes('zhipu')) setModelProvider('Zhipu AI');

      setDescription(`An advanced, high-performance model fetched from Hugging Face repository ${hfRepoId}. Optimized for local deployments.`);
      
      // Estimate parameters from model ID (e.g. 14b, 8b, 72b)
      const paramMatch = rawName.match(/(\d+)[bB]/);
      if (paramMatch) {
        setParameters(`${paramMatch[1]}B`);
        setSizeInGb(parseInt(paramMatch[1], 10) * 2);
      } else {
        setParameters('14B');
        setSizeInGb(28);
      }

      setLicense(data.cardData?.license || 'Apache-2.0');
      setCommercialAllowed(!(data.cardData?.license || '').toLowerCase().includes('research') && !(data.cardData?.license || '').toLowerCase().includes('non-commercial'));
      setOllamaId(rawName.toLowerCase());
      setVllmId(hfRepoId);
      
      // Keep track of metadata
      setFormDownloads(data.downloads);
      setFormLikes(data.likes);
      if (data.lastModified) {
        setFormLastUpdated(data.lastModified.substring(0, 10));
      }

      setSuccessMsg('Successfully retrieved and pre-populated form with Hugging Face data!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to query Hugging Face API');
    } finally {
      setIsFetching(false);
    }
  };

  const handleToggleUseCase = (useCase: string) => {
    setSelectedUseCases(prev => 
      prev.includes(useCase) ? prev.filter(u => u !== useCase) : [...prev, useCase]
    );
  };

  // Submit model into local React state
  const handleSubmitModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelId.trim() || !modelName.trim()) {
      alert('Model ID and Model Name are strictly required.');
      return;
    }

    // Check if duplicate ID exists
    const duplicate = models.find(m => m.id === modelId.trim());
    
    const newModel: ModelMetadata = {
      id: modelId.trim(),
      name: modelName.trim(),
      provider: modelProvider,
      releaseDate,
      description,
      parameters,
      activeParameters: activeParameters.trim() || undefined,
      contextWindow,
      license,
      commercialAllowed,
      primaryUseCases: selectedUseCases as any[],
      benchmarks: {
        mmlu,
        humanEval,
        gsm8k
      },
      deployment: {
        ollamaId: ollamaId.trim() || modelId.trim(),
        hfRepo: vllmId.trim() || hfRepoId.trim(),
        vllmId: vllmId.trim() || hfRepoId.trim(),
        runCommand: `ollama run ${ollamaId.trim() || modelId.trim()}`
      },
      pros: prosText.split('\n').map(line => line.trim()).filter(line => line.length > 0),
      cons: consText.split('\n').map(line => line.trim()).filter(line => line.length > 0),
      sizeInGb,
      downloads: formDownloads,
      likes: formLikes,
      lastUpdated: formLastUpdated
    };

    let updatedModelsList: ModelMetadata[] = [];
    if (duplicate) {
      // Overwrite existing
      updatedModelsList = models.map(m => m.id === modelId.trim() ? newModel : m);
      setSuccessMsg(`Successfully overwritten model "${modelName}" in the active catalog!`);
    } else {
      // Insert new model at the top
      updatedModelsList = [newModel, ...models];
      setSuccessMsg(`Successfully appended "${modelName}" to the active catalog!`);
    }

    onUpdateModels(updatedModelsList);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteModel = (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to remove "${name}" from the active catalog session?`)) {
      const filtered = models.filter(m => m.id !== id);
      onUpdateModels(filtered);
      setSuccessMsg(`Successfully deleted "${name}" from active catalog.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const copyReadmeBlock = () => {
    const readmeBlock = `<!-- REGISTRY_JSON_START -->\n\`\`\`json\n${JSON.stringify(models, null, 2)}\n\`\`\`\n<!-- REGISTRY_JSON_END -->`;
    navigator.clipboard.writeText(readmeBlock);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Aggregated analytics metrics
  const totalDownloads = models.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
  const totalLikes = models.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className="space-y-6" id="sync-panel-container">
      {/* Alert Messaging System */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-md flex items-center gap-3 animate-fade-in" id="sync-success-alert">
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Analytics Insight Ledger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="sync-ledger-grid">
        <div className="glass-panel p-5 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Catalog Volume</span>
            <strong className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tracking-tight mt-1 block">{models.length} Models</strong>
            <span className="text-[11px] text-slate-400 font-sans mt-1 block">Vetted open weight checkpoints</span>
          </div>
          <span className="p-3 bg-indigo-500/5 border border-indigo-500/25 rounded-md text-indigo-400">
            <Database className="w-5 h-5" />
          </span>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-rose-500/5 to-transparent pointer-events-none" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Hugging Face DLs</span>
            <strong className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono tracking-tight mt-1 block">{(totalDownloads / 1000000).toFixed(2)}M</strong>
            <span className="text-[11px] text-slate-400 font-sans mt-1 block">Combined live community queries</span>
          </div>
          <span className="p-3 bg-rose-500/5 border border-rose-500/25 rounded-md text-rose-400">
            <Download className="w-5 h-5" />
          </span>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Total Heart / Likes</span>
            <strong className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tracking-tight mt-1 block">{totalLikes.toLocaleString()} Likes</strong>
            <span className="text-[11px] text-slate-400 font-sans mt-1 block">Vetted star metrics on HF Hub</span>
          </div>
          <span className="p-3 bg-emerald-500/5 border border-emerald-500/25 rounded-md text-emerald-400">
            <ThumbsUp className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scraping & Form Controls */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Live Hugging Face Scraper Card */}
          <div className="glass-panel p-5 space-y-4" id="hf-api-scraper-card">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <span className="p-1 bg-indigo-500/5 border border-indigo-500/25 rounded text-indigo-400">
                <RefreshCw className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-display">Live Hugging Face Data Scraper</h3>
                <p className="text-xs text-slate-400 font-sans">Fetch real-time parameter sizes, download counts, and license details from HF Hub</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={hfRepoId}
                  onChange={(e) => setHfRepoId(e.target.value)}
                  placeholder="e.g., deepseek-ai/DeepSeek-R1-Distill-Qwen-14B"
                  className="w-full pl-3 pr-4 py-2.5 glass-input text-xs text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  id="hf-repo-input"
                />
              </div>
              <button
                type="button"
                onClick={handleFetchHF}
                disabled={isFetching}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 disabled:opacity-55"
              >
                {isFetching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isFetching ? 'Fetching Hub...' : 'Fetch & Pre-fill Form'}</span>
              </button>
            </div>

            {fetchError && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-sm flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{fetchError}</span>
              </div>
            )}

            {fetchedData && (
              <div className="bg-slate-950/40 border border-brand-border rounded p-4 space-y-3 animate-fade-in text-xs font-sans">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-brand-border/30">
                  <span className="font-mono font-bold text-indigo-400 text-[11px] truncate select-all">{fetchedData.modelId}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-brand-border">HF AUTHORIZED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-950/40 p-2 rounded border border-brand-border/40">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">DLs (This Month)</span>
                    <strong className="text-slate-100 font-mono font-bold block mt-0.5">{fetchedData.downloads?.toLocaleString() || 'N/A'}</strong>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded border border-brand-border/40">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Likes</span>
                    <strong className="text-slate-100 font-mono font-bold block mt-0.5">{fetchedData.likes?.toLocaleString() || 'N/A'}</strong>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded border border-brand-border/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Pipeline Tag</span>
                    <strong className="text-emerald-400 font-mono font-bold block mt-0.5">{fetchedData.pipeline_tag || 'text-generation'}</strong>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded border border-brand-border/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Last Modified</span>
                    <strong className="text-slate-100 font-mono font-bold block mt-0.5">{fetchedData.lastModified?.substring(0, 10) || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model Editor Form */}
          <form onSubmit={handleSubmitModel} className="glass-panel p-5 space-y-5" id="custom-model-editor-form">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <span className="p-1 bg-indigo-500/5 border border-indigo-500/25 rounded text-indigo-400">
                <Plus className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-display">Model Registry Editor</h3>
                <p className="text-xs text-slate-400 font-sans">Craft, edit, and append custom open weights directly into the index schema</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Unique Model ID *</label>
                <input
                  type="text"
                  required
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  placeholder="e.g. qwen-2.5-14b-instruct"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-model-id"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Model Display Name *</label>
                <input
                  type="text"
                  required
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Qwen 2.5 14B Instruct"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                  id="form-model-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Creator Provider</label>
                <select
                  value={modelProvider}
                  onChange={(e) => setModelProvider(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  id="form-model-provider"
                >
                  <option value="Meta">Meta</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="DeepSeek">DeepSeek</option>
                  <option value="Mistral AI">Mistral AI</option>
                  <option value="Alibaba Qwen">Alibaba Qwen</option>
                  <option value="Cohere">Cohere</option>
                  <option value="Zhipu AI">Zhipu AI</option>
                  <option value="Moonshot AI">Moonshot AI</option>
                  <option value="MiniMax">MiniMax</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Release Date</label>
                <input
                  type="text"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  placeholder="e.g. 2024-11"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-release-date"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Brief Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the model parameters, alignment focus, or distinct capabilities..."
                className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                id="form-description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Parameters</label>
                <input
                  type="text"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder="e.g. 14B or 671B"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-parameters"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Active Params (MoE)</label>
                <input
                  type="text"
                  value={activeParameters}
                  onChange={(e) => setActiveParameters(e.target.value)}
                  placeholder="e.g. 37B (optional)"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-active-params"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Context Limit</label>
                <input
                  type="number"
                  value={contextWindow}
                  onChange={(e) => setContextWindow(parseInt(e.target.value, 10))}
                  placeholder="e.g. 128000"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-context"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Disk Footprint (GB)</label>
                <input
                  type="number"
                  value={sizeInGb}
                  onChange={(e) => setSizeInGb(parseInt(e.target.value, 10))}
                  placeholder="e.g. 28"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-size"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">License Type</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="e.g. Apache-2.0 or MIT"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-license"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">License Constraint</label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setCommercialAllowed(true)}
                    className={`flex-1 text-center py-2 text-xs rounded border transition-all cursor-pointer font-sans font-bold ${
                      commercialAllowed 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' 
                        : 'bg-slate-950 text-slate-400 border-brand-border hover:bg-slate-900'
                    }`}
                    id="form-license-commerical"
                  >
                    Permits Commercial Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommercialAllowed(false)}
                    className={`flex-1 text-center py-2 text-xs rounded border transition-all cursor-pointer font-sans font-bold ${
                      !commercialAllowed 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40' 
                        : 'bg-slate-950 text-slate-400 border-brand-border hover:bg-slate-900'
                    }`}
                    id="form-license-restricted"
                  >
                    Restricted / Research
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Evaluation Benchmarks (%)</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-2.5 rounded border border-brand-border space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block text-center">MMLU Score</span>
                  <input
                    type="number"
                    step="0.1"
                    value={mmlu}
                    onChange={(e) => setMmlu(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 text-center font-mono font-bold text-slate-100 border-b border-brand-border focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-brand-border space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block text-center">HumanEval</span>
                  <input
                    type="number"
                    step="0.1"
                    value={humanEval}
                    onChange={(e) => setHumanEval(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 text-center font-mono font-bold text-slate-100 border-b border-brand-border focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-brand-border space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block text-center">GSM8K Score</span>
                  <input
                    type="number"
                    step="0.1"
                    value={gsm8k}
                    onChange={(e) => setGsm8k(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 text-center font-mono font-bold text-slate-100 border-b border-brand-border focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Target Specialties / Specialties</label>
              <div className="flex flex-wrap gap-1.5">
                {availableUseCases.map((useCase) => {
                  const isChecked = selectedUseCases.includes(useCase);
                  return (
                    <button
                      key={useCase}
                      type="button"
                      onClick={() => handleToggleUseCase(useCase)}
                      className={`px-3 py-1.5 text-xs rounded border transition-all cursor-pointer font-sans ${
                        isChecked 
                          ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-400 font-semibold' 
                          : 'bg-slate-950 border-brand-border text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {useCase}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Ollama ID</label>
                <input
                  type="text"
                  value={ollamaId}
                  onChange={(e) => setOllamaId(e.target.value)}
                  placeholder="e.g. qwen2.5:14b"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-ollama-id"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">VLLM ID / HF Repo</label>
                <input
                  type="text"
                  value={vllmId}
                  onChange={(e) => setVllmId(e.target.value)}
                  placeholder="e.g. Qwen/Qwen2.5-14B-Instruct"
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  id="form-vllm-id"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Key Strengths (One bullet per line)</label>
                <textarea
                  rows={3}
                  value={prosText}
                  onChange={(e) => setProsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                  id="form-strengths"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Deployment Challenges (One bullet per line)</label>
                <textarea
                  rows={3}
                  value={consText}
                  onChange={(e) => setConsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-brand-border rounded text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                  id="form-challenges"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              id="form-submit-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Save Model in Local State</span>
            </button>
          </form>
        </div>

        {/* Right Column: Active catalog, instructions and manual update exporter */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Exporter Card */}
          <div className="glass-panel p-5 space-y-3.5" id="readme-json-exporter-card">
            <div className="flex items-center justify-between border-b border-brand-border/40 pb-2.5">
              <div className="flex items-center gap-1.5">
                <FileCode className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100 font-display">Readme Sync block</h3>
              </div>
              <button
                type="button"
                onClick={copyReadmeBlock}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedText ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Export your modified local catalog back into `README.md` to keep the persistent server list updated. Click Copy, then overwrite everything between the markers in `README.md`.
            </p>

            <div className="bg-slate-950 p-2.5 rounded border border-brand-border/60 max-h-[160px] overflow-y-auto">
              <pre className="text-[9px] font-mono text-slate-400 leading-normal select-all">
{`<!-- REGISTRY_JSON_START -->
\`\`\`json
${JSON.stringify(models, null, 2)}
\`\`\`
<!-- REGISTRY_JSON_END -->`}
              </pre>
            </div>

            <div className="bg-slate-950/40 p-3 rounded border border-brand-border/40 space-y-1 text-[11px] font-sans">
              <span className="font-mono font-bold text-indigo-300 uppercase block tracking-wider text-[10px]">How to automate?</span>
              <p className="text-slate-400 leading-relaxed mt-1">
                You can run the automatic retrieval script from your server terminal:
              </p>
              <div className="font-mono bg-slate-950 px-2 py-1 border border-brand-border rounded text-[10px] text-slate-300 select-all my-1.5">
                npx tsx scripts/sync-models.js
              </div>
              <p className="text-slate-400">
                It will query the Hugging Face API, update your weights parameters, and write back into your active index database.
              </p>
            </div>
          </div>

          {/* Active catalog listing inside the sync view for rapid removals or edits */}
          <div className="glass-panel p-5 space-y-3.5" id="active-session-catalog-card">
            <h3 className="text-sm font-bold text-slate-100 font-display border-b border-brand-border/40 pb-2.5">Active Session Registry</h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {models.map((model) => (
                <div 
                  key={`session-${model.id}`}
                  className="bg-slate-950/40 border border-brand-border/40 hover:border-brand-border rounded p-3 flex items-center justify-between gap-3.5 transition-all text-xs"
                >
                  <div className="truncate space-y-0.5">
                    <strong className="text-slate-200 block truncate leading-tight">{model.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">{model.provider} · {model.parameters}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        // Populate editor fields from clicked model
                        setModelId(model.id);
                        setModelName(model.name);
                        setModelProvider(model.provider);
                        setReleaseDate(model.releaseDate);
                        setDescription(model.description);
                        setParameters(model.parameters);
                        setActiveParameters(model.activeParameters || '');
                        setContextWindow(model.contextWindow);
                        setLicense(model.license);
                        setCommercialAllowed(model.commercialAllowed);
                        setSelectedUseCases(model.primaryUseCases);
                        setMmlu(model.benchmarks.mmlu);
                        setHumanEval(model.benchmarks.humanEval);
                        setGsm8k(model.benchmarks.gsm8k);
                        setOllamaId(model.deployment.ollamaId);
                        setVllmId(model.deployment.vllmId);
                        setProsText(model.pros.join('\n'));
                        setConsText(model.cons.join('\n'));
                        setSizeInGb(model.sizeInGb);
                        setFormDownloads(model.downloads);
                        setFormLikes(model.likes);
                        setFormLastUpdated(model.lastUpdated);
                        setSuccessMsg(`Loaded "${model.name}" properties into editor fields!`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="text-[10px] font-bold px-2.5 py-1 text-indigo-400 hover:text-indigo-300 border border-brand-border/60 hover:border-indigo-500/30 rounded cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteModel(model.id, model.name)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/5 cursor-pointer transition-all"
                      title="Delete model from session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
