import React, { useState, useMemo } from 'react';
import { ModelMetadata } from '../data/models';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  BookOpen, 
  Copy, 
  Check, 
  BarChart3, 
  Star, 
  Layers, 
  Cpu, 
  Compass, 
  Info, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Lock, 
  Unlock, 
  ExternalLink 
} from 'lucide-react';

interface RegistryPanelProps {
  models: ModelMetadata[];
  selectedCompareIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectVramModel: (id: string) => void;
  search?: string;
  onSearchChange?: (val: string) => void;
}

export default function RegistryPanel({
  models,
  selectedCompareIds,
  onToggleCompare,
  onSelectVramModel,
  search: propsSearch,
  onSearchChange: propsOnSearchChange
}: RegistryPanelProps) {
  const [internalSearch, setInternalSearch] = useState<string>('');
  const search = propsSearch !== undefined ? propsSearch : internalSearch;
  const setSearch = propsOnSearchChange !== undefined ? propsOnSearchChange : setInternalSearch;
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [sizeBrackets, setSizeBrackets] = useState<string[]>([]);
  const [commercialOnly, setCommercialOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('mmlu'); // mmlu, humanEval, gsm8k, size_asc, size_desc

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedRepoId, setCopiedRepoId] = useState<string | null>(null);
  const [expandedModelIds, setExpandedModelIds] = useState<string[]>([]);

  const toggleModelExpanded = (id: string) => {
    setExpandedModelIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const copyRepoId = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRepoId(id);
    setTimeout(() => setCopiedRepoId(null), 2000);
  };

  // Constants
  const providersList = ['Meta', 'Google', 'Microsoft', 'DeepSeek', 'Mistral AI', 'Alibaba Qwen', 'Cohere', 'Zhipu AI', 'Moonshot AI', 'MiniMax'];
  const useCasesList = ['Coding', 'General Assistant', 'Reasoning & Math', 'Multimodal / Vision', 'Local / On-device', 'Low-Latency'];

  // Toggle filter lists
  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    );
  };

  const toggleUseCase = (useCase: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(useCase) ? prev.filter((u) => u !== useCase) : [...prev, useCase]
    );
  };

  const toggleSizeBracket = (bracket: string) => {
    setSizeBrackets((prev) =>
      prev.includes(bracket) ? prev.filter((b) => b !== bracket) : [...prev, bracket]
    );
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedProviders([]);
    setSelectedUseCases([]);
    setSizeBrackets([]);
    setCommercialOnly(false);
    setSortBy('mmlu');
  };

  // Perform search and filtering
  const filteredModels = useMemo(() => {
    return models
      .filter((m) => {
        // 1. Text Search
        const query = search.toLowerCase();
        const matchesText =
          m.name.toLowerCase().includes(query) ||
          m.provider.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.primaryUseCases.some((u) => u.toLowerCase().includes(query)) ||
          m.license.toLowerCase().includes(query);

        // 2. Providers
        const matchesProvider =
          selectedProviders.length === 0 || selectedProviders.includes(m.provider);

        // 3. Use Cases
        const matchesUseCase =
          selectedUseCases.length === 0 ||
          m.primaryUseCases.some((u) => selectedUseCases.includes(u));

        // 4. Licensing
        const matchesLicense = !commercialOnly || m.commercialAllowed;

        // 5. Size brackets
        let matchesSize = true;
        if (sizeBrackets.length > 0) {
          const paramCount = parseFloat(m.parameters.replace(/[^\d.]/g, ''));
          matchesSize = sizeBrackets.some((b) => {
            if (b === 'compact') return paramCount < 10;
            if (b === 'mid') return paramCount >= 10 && paramCount <= 39;
            if (b === 'high') return paramCount >= 40 && paramCount <= 99;
            if (b === 'extreme') return paramCount >= 100;
            return true;
          });
        }

        return matchesText && matchesProvider && matchesUseCase && matchesLicense && matchesSize;
      })
      .sort((a, b) => {
        // Sort mechanics
        if (sortBy === 'mmlu') return b.benchmarks.mmlu - a.benchmarks.mmlu;
        if (sortBy === 'humanEval') return b.benchmarks.humanEval - a.benchmarks.humanEval;
        if (sortBy === 'gsm8k') return b.benchmarks.gsm8k - a.benchmarks.gsm8k;
        if (sortBy === 'size_asc') return a.sizeInGb - b.sizeInGb;
        if (sortBy === 'size_desc') return b.sizeInGb - a.sizeInGb;
        return 0;
      });
  }, [models, search, selectedProviders, selectedUseCases, commercialOnly, sizeBrackets, sortBy]);

  const copyCommand = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="registry-panel-container">
      {/* Sidebar Filter Panel - Glassmorphic styled */}
      <div className="lg:col-span-3 space-y-5 glass-panel p-5 rounded-md h-fit" id="sidebar-filters">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-100 uppercase tracking-wider font-mono">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Filters</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-mono font-bold text-slate-400 hover:text-slate-200 cursor-pointer uppercase tracking-wider hover:underline"
            id="filters-reset-btn"
          >
            Clear All
          </button>
        </div>

        {/* Commercial Filter Toggle */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold block">License Constraint</label>
          <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/40 border border-brand-border rounded-md cursor-pointer hover:border-indigo-500/30 transition-all">
            <input
              type="checkbox"
              checked={commercialOnly}
              onChange={() => setCommercialOnly(!commercialOnly)}
              className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-brand-border bg-slate-950 accent-indigo-500 cursor-pointer"
              id="commercial-only-checkbox"
            />
            <span className="text-xs text-slate-300 font-sans font-medium">Commercial Use Safe Only</span>
          </label>
        </div>

        {/* Providers */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Model Providers</label>
          <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
            {providersList.map((prov) => {
              const isChecked = selectedProviders.includes(prov);
              return (
                <button
                  key={prov}
                  onClick={() => toggleProvider(prov)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-all flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-550/10 text-indigo-400 border-indigo-500/40 font-semibold'
                      : 'bg-slate-950/30 text-slate-400 border-brand-border hover:bg-slate-900/40'
                  }`}
                  id={`filter-prov-${prov.replace(/\s+/g, '-')}`}
                >
                  <span>{prov}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Target Specialties</label>
          <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
            {useCasesList.map((useCase) => {
              const isChecked = selectedUseCases.includes(useCase);
              return (
                <button
                  key={useCase}
                  onClick={() => toggleUseCase(useCase)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-all flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-550/10 text-indigo-400 border-indigo-500/40 font-semibold'
                      : 'bg-slate-950/30 text-slate-400 border-brand-border hover:bg-slate-900/40'
                  }`}
                  id={`filter-usecase-${useCase.replace(/\s+/g, '-')}`}
                >
                  <span className="truncate">{useCase}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameter Size Bracket */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Model Parameter Size</label>
          <div className="space-y-1.5">
            {[
              { id: 'compact', name: 'Compact (<10B)', desc: 'Mobile & laptop ready' },
              { id: 'mid', name: 'Medium (10B - 39B)', desc: 'Professional consumer GPUs' },
              { id: 'high', name: 'High-Tier (40B - 99B)', desc: 'Enterprise / Dual GPU setups' },
              { id: 'extreme', name: 'Extreme (>=100B / MoE)', desc: 'Multi-GPU nodes or cloud' }
            ].map((b) => {
              const isChecked = sizeBrackets.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleSizeBracket(b.id)}
                  className={`w-full text-left p-2.5 rounded-md border transition-all flex flex-col cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-550/10 text-indigo-400 border-indigo-500/40 font-medium'
                      : 'bg-slate-950/30 text-slate-400 border-brand-border hover:bg-slate-900/40'
                  }`}
                  id={`filter-size-${b.id}`}
                >
                  <span className="text-xs font-bold font-sans">{b.name}</span>
                  <span className="text-[10px] text-slate-400 leading-none mt-1">{b.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content Area */}
      <div className="lg:col-span-9 space-y-4">
        {/* Trending & Latest Models Deck - Styled with Glassmorphism */}
        <div className="glass-panel p-5 relative overflow-hidden" id="trending-deck-container">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/5 rounded-md border border-rose-500/20 text-rose-400">
                <Star className="w-4 h-4 fill-rose-400/20" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-100 tracking-tight font-display">Onyx Open LLM Leaderboard</h3>
                <p className="text-xs text-slate-400 font-sans">Trending open weights, updated from onyx.app/open-llm-leaderboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://onyx.app/open-llm-leaderboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-[10px] font-mono font-bold text-indigo-300 hover:text-indigo-250 transition-all rounded"
                title="View on Onyx Leaderboard"
              >
                <Globe className="w-3 h-3" />
                Onyx Leaderboard ↗
              </a>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/25 text-rose-300 uppercase tracking-wider animate-pulse">Live Curations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="trending-deck-grid">
            {models.slice(0, 3).map((model) => (
              <div 
                key={`trending-${model.id}`}
                className="bg-slate-950/40 border border-brand-border/60 hover:border-indigo-500/40 rounded-md p-4 flex flex-col justify-between transition-all hover:translate-y-[-2px] duration-250 relative overflow-hidden group"
              >
                {/* Subtle top edge status line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/30 to-emerald-500/30" />
                
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-wider">{model.provider}</span>
                    <div className="flex items-center gap-1.5">
                      {model.onyxLeaderboardRank && (
                        <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/25 uppercase tracking-wide">
                          🏆 RANK #{model.onyxLeaderboardRank}
                        </span>
                      )}
                      <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wide">🔥 TRENDING</span>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-bold font-display text-slate-200 tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">
                    {model.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-3">
                    {model.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-brand-border/30">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-medium">
                    <span>MMLU SCORE</span>
                    <span className="text-slate-100 font-extrabold">{model.benchmarks.mmlu}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectVramModel(model.id)}
                      className="flex-1 text-[11px] font-bold text-center py-2 bg-slate-900/60 hover:bg-slate-800 text-slate-300 rounded border border-brand-border hover:text-white transition-all cursor-pointer"
                    >
                      Calc VRAM
                    </button>
                    <button
                      onClick={() => onToggleCompare(model.id)}
                      className="flex-1 text-[11px] font-bold text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-all cursor-pointer shadow-sm"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar and sorting controls - Styled with Glassmorphism */}
        <div className="glass-panel p-4 rounded-md flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by model name, license, provider, or capability..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-input text-sm text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              id="registry-search-input"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-400 font-sans">Sort metrics:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950/60 border border-brand-border rounded-md px-3 py-2 text-xs text-slate-250 focus:outline-none hover:border-indigo-500/30 cursor-pointer font-sans"
              id="registry-sort-select"
            >
              <option value="mmlu">General MMLU Benchmarks</option>
              <option value="humanEval">Coding Benchmarks (HumanEval)</option>
              <option value="gsm8k">Math Benchmarks (GSM8K)</option>
              <option value="size_asc">Weight Size (Small to Large)</option>
              <option value="size_desc">Weight Size (Large to Small)</option>
            </select>
          </div>
        </div>

        {/* Counter Info Banner */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1 uppercase tracking-wider font-bold">
          <span>SHOWING {filteredModels.length} OF {models.length} CURATED OPEN-SOURCE LLMs</span>
          {selectedCompareIds.length > 0 && (
            <span className="text-indigo-400 font-bold">
              {selectedCompareIds.length} model{selectedCompareIds.length > 1 ? 's' : ''} in comparison stack
            </span>
          )}
        </div>

        {/* Model Cards Grid - Premium Glassmorphism & Expandable Logic */}
        {filteredModels.length === 0 ? (
          <div className="text-center glass-panel py-12 px-6 animate-fade-in" id="empty-search-slate">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">No matching models found</h3>
            <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              No models matched your exact filter combination. Try clearing some tags or resetting search filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 text-xs font-semibold px-4 py-2 bg-slate-900 border border-brand-border text-indigo-400 rounded-md hover:bg-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              id="empty-reset-cta"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="models-list-grid">
            {filteredModels.map((model) => {
              const isInCompare = selectedCompareIds.includes(model.id);
              const isExpanded = expandedModelIds.includes(model.id);
              return (
                <div
                  key={model.id}
                  className="glass-panel glass-panel-hover p-5 rounded-md flex flex-col justify-between transition-all group duration-300 relative overflow-hidden"
                  id={`model-card-${model.id}`}
                >
                  <div>
                    {/* Provider Header Block */}
                    <div className="flex items-center justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-sm uppercase">
                          {model.provider}
                        </span>
                        {model.onyxLeaderboardRank && (
                          <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-sm uppercase">
                            🏆 Rank #{model.onyxLeaderboardRank}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono font-semibold">{model.releaseDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-350 text-xs font-mono font-bold">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{model.parameters}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">
                      {model.name}
                    </h3>

                    {/* Live Hugging Face Stats if available */}
                    {(model.downloads !== undefined || model.likes !== undefined) && (
                      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mb-3 text-[11px] font-mono text-slate-400">
                        {model.downloads !== undefined && (
                          <span className="flex items-center gap-1">
                            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">HF DLs:</span>
                            <span className="text-indigo-300 font-extrabold font-mono">
                              {model.downloads >= 1000000 
                                ? `${(model.downloads / 1000000).toFixed(1)}M` 
                                : model.downloads >= 1000 
                                  ? `${(model.downloads / 1000).toFixed(0)}k` 
                                  : model.downloads.toLocaleString()}
                            </span>
                          </span>
                        )}
                        {model.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Likes:</span>
                            <span className="text-rose-400 font-extrabold font-mono">{model.likes.toLocaleString()}</span>
                          </span>
                        )}
                        {model.lastUpdated && (
                          <span className="text-slate-500 text-[9px] uppercase tracking-wider hidden sm:inline">
                            Synced: {model.lastUpdated}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description - Expandable or toggled */}
                    <p className={`text-xs sm:text-sm text-slate-400 font-sans leading-relaxed mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {model.description}
                    </p>

                    {/* Benchmark metrics overlay */}
                    <div className="bg-slate-950/40 border border-brand-border rounded-md p-3 mb-4 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider block uppercase">Evaluation Benchmarks</span>
                      <div className="grid grid-cols-3 gap-2">
                        {/* MMLU */}
                        <div className="text-center bg-slate-950/40 p-2 rounded-sm border border-brand-border">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block font-semibold">MMLU</span>
                          <strong className="text-xs sm:text-sm font-bold text-slate-100 font-mono block mt-0.5">{model.benchmarks.mmlu}%</strong>
                        </div>
                        {/* Coding */}
                        <div className="text-center bg-slate-950/40 p-2 rounded-sm border border-brand-border">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block font-semibold">CODE</span>
                          <strong className="text-xs sm:text-sm font-bold text-emerald-400 font-mono block mt-0.5">{model.benchmarks.humanEval}%</strong>
                        </div>
                        {/* Math */}
                        <div className="text-center bg-slate-950/40 p-2 rounded-sm border border-brand-border">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block font-semibold">MATH</span>
                          <strong className="text-xs sm:text-sm font-bold text-amber-400 font-mono block mt-0.5">{model.benchmarks.gsm8k}%</strong>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {model.primaryUseCases.map((useCase) => (
                        <span
                          key={useCase}
                          className="text-[10px] sm:text-xs font-medium font-mono bg-slate-950/70 text-slate-300 border border-brand-border px-2.5 py-1 rounded-sm"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>

                    {/* Expanded Technical Details Drawer - Built directly inside card for perfect readability */}
                    {isExpanded && (
                      <div className="border-t border-brand-border/40 pt-4 mt-4 space-y-4 animate-fade-in text-xs sm:text-sm font-sans text-slate-300">
                        {/* Hardware Footprint Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-950/40 p-2.5 rounded border border-brand-border/65 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase tracking-wider">Context Limit</span>
                            <span className="text-xs sm:text-sm font-bold font-mono text-slate-200">{(model.contextWindow / 1000).toLocaleString()}k tokens</span>
                          </div>
                          <div className="bg-slate-950/40 p-2.5 rounded border border-brand-border/65 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase tracking-wider">Storage Footprint</span>
                            <span className="text-xs sm:text-sm font-bold font-mono text-slate-200">~{model.sizeInGb} GB FP16 equivalent</span>
                          </div>
                        </div>

                        {/* Licensing */}
                        <div className="bg-slate-950/40 p-2.5 rounded border border-brand-border/65 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase tracking-wider">License Type</span>
                            <span className="text-xs sm:text-sm font-mono font-bold text-slate-300">{model.license}</span>
                          </div>
                          {model.commercialAllowed ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs font-mono font-bold text-emerald-400">
                              <Unlock className="w-3.5 h-3.5" />
                              <span>COMMERCIAL USE OK</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] sm:text-xs font-mono font-bold text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                              <span>RESTRICTED USE</span>
                            </span>
                          )}
                        </div>

                        {/* Pros & Cons list */}
                        <div className="space-y-2.5">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">Key Strengths</span>
                            <ul className="space-y-1">
                              {model.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-300 leading-normal">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">Deployment Challenges</span>
                            <ul className="space-y-1">
                              {model.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-400 leading-normal">
                                  <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Model repository anchors */}
                        <div className="bg-slate-950/60 p-3 rounded border border-brand-border space-y-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Hugging Face weights repo</span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs text-slate-300 select-all truncate bg-slate-950 px-2 py-1 rounded border border-brand-border/60">{model.deployment.hfRepo}</span>
                              <button
                                onClick={() => copyRepoId(model.id, model.deployment.hfRepo)}
                                className="text-xs text-indigo-400 font-bold hover:text-indigo-300 shrink-0 flex items-center gap-1 cursor-pointer"
                              >
                                {copiedRepoId === model.id ? 'Copied!' : 'Copy Repo ID'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions footer block */}
                  <div className="border-t border-brand-border pt-4 space-y-3 mt-4">
                    {/* Expand/Collapse details and estimate/compare buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Show / Hide Details Toggle */}
                      <button
                        onClick={() => toggleModelExpanded(model.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 text-xs font-semibold px-2 py-1 hover:bg-slate-900/40 rounded transition-all cursor-pointer font-sans"
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Details</span>
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          </>
                        ) : (
                          <>
                            <span>Show Details ({model.pros.length + model.cons.length + 3} more)</span>
                            <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectVramModel(model.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 text-xs font-semibold px-2.5 py-1.5 hover:bg-slate-900/40 rounded-md transition-all cursor-pointer font-sans"
                          title="Estimate hardware VRAM requirements"
                          id={`card-vram-btn-${model.id}`}
                        >
                          <Cpu className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleCompare(model.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all border cursor-pointer font-sans ${
                            isInCompare
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/10'
                              : 'bg-slate-950 border-brand-border text-slate-300 hover:text-white hover:border-slate-700'
                          }`}
                          id={`card-compare-btn-${model.id}`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>{isInCompare ? 'In Stack' : 'Compare'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
