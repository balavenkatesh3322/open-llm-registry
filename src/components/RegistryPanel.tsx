import React, { useState, useMemo } from 'react';
import { ModelMetadata } from '../data/models';
import ModelDeveloperSandbox from './ModelDeveloperSandbox';
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
  ChevronLeft,
  ChevronRight,
  FolderGit,
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Lock, 
  Unlock, 
  ExternalLink,
  LayoutGrid,
  Table
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
  const [sortBy, setSortBy] = useState<string>('mmlu'); // mmlu, humanEval, gsm8k, size_asc, size_desc, name, name_desc, provider, contextWindow, contextWindow_asc, parameters, parameters_asc
  const [viewMode, setViewMode] = useState<'mixed' | 'table' | 'provider'>('mixed');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedRepoId, setCopiedRepoId] = useState<string | null>(null);
  const [expandedModelIds, setExpandedModelIds] = useState<string[]>([]);

  // Automatically reset to page 1 when any filter or sorting criteria changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedProviders, selectedUseCases, commercialOnly, sortBy]);

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

  // precomputed counts for visual badges in sidebar
  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    models.forEach((m) => {
      counts[m.provider] = (counts[m.provider] || 0) + 1;
    });
    return counts;
  }, [models]);

  const useCaseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    models.forEach((m) => {
      m.primaryUseCases.forEach((uc) => {
        counts[uc] = (counts[uc] || 0) + 1;
      });
    });
    return counts;
  }, [models]);

  const sizeBracketCounts = useMemo(() => {
    const counts = { compact: 0, mid: 0, high: 0, extreme: 0 };
    models.forEach((m) => {
      const paramCount = parseFloat(m.parameters.replace(/[^\d.]/g, ''));
      if (paramCount < 10) counts.compact++;
      else if (paramCount >= 10 && paramCount <= 39) counts.mid++;
      else if (paramCount >= 40 && paramCount <= 99) counts.high++;
      else if (paramCount >= 100) counts.extreme++;
    });
    return counts;
  }, [models]);

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
    setCurrentPage(1);
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
        
        // Expanded Column Sorting
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'provider') return a.provider.localeCompare(b.provider);
        if (sortBy === 'contextWindow') return b.contextWindow - a.contextWindow;
        if (sortBy === 'contextWindow_asc') return a.contextWindow - b.contextWindow;
        
        if (sortBy === 'parameters') {
          const aVal = parseFloat(a.parameters.replace(/[^\d.]/g, '')) || 0;
          const bVal = parseFloat(b.parameters.replace(/[^\d.]/g, '')) || 0;
          return bVal - aVal;
        }
        if (sortBy === 'parameters_asc') {
          const aVal = parseFloat(a.parameters.replace(/[^\d.]/g, '')) || 0;
          const bVal = parseFloat(b.parameters.replace(/[^\d.]/g, '')) || 0;
          return aVal - bVal;
        }
        
        return 0;
      });
  }, [models, search, selectedProviders, selectedUseCases, commercialOnly, sizeBrackets, sortBy]);

  const groupedByProvider = useMemo(() => {
    const groups: Record<string, ModelMetadata[]> = {};
    filteredModels.forEach((m) => {
      const prov = m.provider || 'Other';
      if (!groups[prov]) groups[prov] = [];
      groups[prov].push(m);
    });
    return groups;
  }, [filteredModels]);

  const getProviderBadge = (provider: string) => {
    const p = provider.toLowerCase();
    let bg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    let initials = provider.slice(0, 2).toUpperCase();
    
    if (p.includes('meta')) {
      bg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    } else if (p.includes('google')) {
      bg = 'bg-red-500/10 text-red-400 border-red-500/20';
    } else if (p.includes('microsoft')) {
      bg = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    } else if (p.includes('deepseek')) {
      bg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    } else if (p.includes('mistral')) {
      bg = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    } else if (p.includes('alibaba') || p.includes('qwen')) {
      bg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    } else if (p.includes('cohere')) {
      bg = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    } else if (p.includes('zhipu') || p.includes('glm')) {
      bg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    } else if (p.includes('moonshot') || p.includes('kimi')) {
      bg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    } else if (p.includes('minimax')) {
      bg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    
    return (
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold border ${bg}`} title={provider}>
        {initials}
      </span>
    );
  };

  const handleHeaderSort = (field: string) => {
    if (sortBy === field) {
      if (field === 'name') setSortBy('name_desc');
      else if (field === 'name_desc') setSortBy('name');
      else if (field === 'parameters') setSortBy('parameters_asc');
      else if (field === 'parameters_asc') setSortBy('parameters');
      else if (field === 'contextWindow') setSortBy('contextWindow_asc');
      else if (field === 'contextWindow_asc') setSortBy('contextWindow');
    } else {
      setSortBy(field);
    }
  };

  const renderSortIndicator = (field: string) => {
    const isSorted = sortBy === field || sortBy === `${field}_asc` || sortBy === `${field}_desc` || (field === 'name' && sortBy === 'name_desc');
    const isAsc = sortBy === `${field}_asc` || sortBy === 'name';
    
    if (!isSorted) {
      return <SlidersHorizontal className="w-2.5 h-2.5 text-slate-500 opacity-45 inline ml-1 group-hover:opacity-100 transition-opacity" />;
    }
    
    return (
      <span className="inline text-indigo-400 ml-1 text-[10px] font-black">
        {isAsc ? '▲' : '▼'}
      </span>
    );
  };

  const renderModelsTable = (modelsList: ModelMetadata[]) => {
    return (
      <div className="overflow-x-auto border border-brand-border/40 bg-slate-950/20 rounded-md backdrop-blur-md" id="models-table-container">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-brand-border bg-slate-950/60 text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">
              <th className="py-3 px-4">
                <button
                  onClick={() => handleHeaderSort('name')}
                  className="hover:text-slate-250 transition-colors flex items-center gap-1.5 uppercase font-bold text-left group w-full cursor-pointer"
                >
                  <span>Model Name / Specs</span>
                  {renderSortIndicator('name')}
                </button>
              </th>
              <th className="py-3 px-4 hidden sm:table-cell">Specialties</th>
              <th className="py-3 px-4 text-center">
                <button
                  onClick={() => handleHeaderSort('parameters')}
                  className="hover:text-slate-250 transition-colors inline-flex items-center gap-1.5 uppercase font-bold justify-center group cursor-pointer"
                >
                  <span>Params</span>
                  {renderSortIndicator('parameters')}
                </button>
              </th>
              <th className="py-3 px-4 text-center hidden md:table-cell">
                <button
                  onClick={() => handleHeaderSort('contextWindow')}
                  className="hover:text-slate-250 transition-colors inline-flex items-center gap-1.5 uppercase font-bold justify-center group cursor-pointer"
                >
                  <span>Context</span>
                  {renderSortIndicator('contextWindow')}
                </button>
              </th>
              <th className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-500 uppercase">Bench:</span>
                  <button
                    onClick={() => setSortBy('mmlu')}
                    className={`hover:text-slate-200 transition-all font-mono text-[9px] px-1.5 py-0.5 rounded cursor-pointer ${
                      sortBy === 'mmlu' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 border border-brand-border text-slate-400'
                    }`}
                    title="Sort by MMLU"
                  >
                    MMLU
                  </button>
                  <button
                    onClick={() => setSortBy('humanEval')}
                    className={`hover:text-slate-200 transition-all font-mono text-[9px] px-1.5 py-0.5 rounded cursor-pointer ${
                      sortBy === 'humanEval' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-900 border border-brand-border text-slate-400'
                    }`}
                    title="Sort by HumanEval Code"
                  >
                    CODE
                  </button>
                  <button
                    onClick={() => setSortBy('gsm8k')}
                    className={`hover:text-slate-200 transition-all font-mono text-[9px] px-1.5 py-0.5 rounded cursor-pointer ${
                      sortBy === 'gsm8k' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 border border-brand-border text-slate-400'
                    }`}
                    title="Sort by GSM8K Math"
                  >
                    MATH
                  </button>
                </div>
              </th>
              <th className="py-3 px-4 text-center hidden lg:table-cell">License</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/20">
            {modelsList.map((model) => {
              const isInCompare = selectedCompareIds.includes(model.id);
              const isExpanded = expandedModelIds.includes(model.id);
              return (
                <React.Fragment key={`table-group-${model.id}`}>
                  <tr 
                    className={`hover:bg-slate-900/40 transition-all font-sans text-slate-350 cursor-pointer ${
                      isExpanded ? 'bg-slate-900/20' : ''
                    }`}
                    onClick={() => toggleModelExpanded(model.id)}
                  >
                    {/* Model Name & specs */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleModelExpanded(model.id)}
                          className="p-1 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse detailed specs' : 'Expand detailed specs'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        
                        {/* Provider color indicator */}
                        {getProviderBadge(model.provider)}

                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-100 font-display text-sm hover:text-indigo-400 transition-colors">
                              {model.name}
                            </span>
                            {model.onyxLeaderboardRank && (
                              <span className="text-[8px] font-mono text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/25 font-bold">
                                #{model.onyxLeaderboardRank}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-500">
                            <span className="text-indigo-400 font-bold uppercase">{model.provider}</span>
                            <span>•</span>
                            <span>{model.releaseDate}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Use cases Specialties */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {model.primaryUseCases.slice(0, 2).map((uc) => (
                          <span 
                            key={uc} 
                            className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-950 border border-brand-border/60 text-slate-400 rounded-sm"
                          >
                            {uc}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Parameters count */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                      {model.parameters}
                      {model.activeParameters && (
                        <div className="text-[9px] text-slate-500 font-normal">Active: {model.activeParameters}</div>
                      )}
                    </td>

                    {/* Context window */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-350 hidden md:table-cell">
                      {(model.contextWindow / 1000).toLocaleString()}k
                    </td>

                    {/* Benchmarks metrics */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center gap-1.5 justify-center w-full">
                        {/* MMLU Badge */}
                        <span className="px-2 py-0.5 rounded bg-slate-950/60 border border-brand-border/80 text-[11px] font-mono" title="MMLU (General Knowledge)">
                          <span className="text-slate-500 mr-0.5">M:</span>
                          <span className="text-slate-200 font-bold">{model.benchmarks.mmlu}%</span>
                        </span>
                        {/* Code Badge */}
                        <span className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-[11px] font-mono" title="HumanEval (Coding)">
                          <span className="text-slate-500 mr-0.5">C:</span>
                          <span className="text-emerald-400 font-bold">{model.benchmarks.humanEval}%</span>
                        </span>
                        {/* Math Badge */}
                        <span className="px-2 py-0.5 rounded bg-amber-500/5 border border-amber-500/20 text-[11px] font-mono" title="GSM8K (Mathematics)">
                          <span className="text-slate-500 mr-0.5">M:</span>
                          <span className="text-amber-400 font-bold">{model.benchmarks.gsm8k}%</span>
                        </span>
                      </div>
                    </td>

                    {/* License */}
                    <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono text-[11px] text-slate-400">
                      <span className="truncate max-w-[130px] block" title={model.license}>
                        {model.license}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectVramModel(model.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded border border-transparent hover:border-brand-border/60 transition-all cursor-pointer"
                          title="Calculate hardware vRAM requirements"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleCompare(model.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded font-mono uppercase tracking-wide border transition-all cursor-pointer ${
                            isInCompare
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                              : 'bg-slate-950 hover:bg-slate-900 border-brand-border text-slate-400 hover:text-white'
                          }`}
                        >
                          {isInCompare ? 'In Stack' : 'Compare'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable sub-row details containing high density specifications */}
                  {isExpanded && (
                    <tr className="bg-slate-950/40" id={`table-details-${model.id}`}>
                      <td colSpan={7} className="p-5 border-t border-brand-border/40">
                        <ModelDeveloperSandbox 
                          model={model} 
                          onSelectVramModel={onSelectVramModel} 
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const copyCommand = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;

    const startItemIndex = (currentPage - 1) * pageSize + 1;
    const endItemIndex = Math.min(currentPage * pageSize, totalItems);

    // Generate page numbers to display
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 border border-brand-border/40 p-4 rounded-md backdrop-blur-md mt-4" id="table-pagination-control">
        <div className="text-xs text-slate-400 font-sans">
          Showing <span className="font-bold text-slate-200">{startItemIndex}</span> to <span className="font-bold text-slate-200">{endItemIndex}</span> of <span className="font-bold text-slate-200">{totalItems}</span> models
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Previous Page Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-900 border border-brand-border/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2.5 py-1 text-xs font-mono text-slate-500">
                  ...
                </span>
              );
            }
            return (
              <button
                key={`page-${p}`}
                onClick={() => setCurrentPage(p as number)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all cursor-pointer ${
                  currentPage === p
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900 border-brand-border/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next Page Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-900 border border-brand-border/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page size controller */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-950/60 border border-brand-border/60 rounded px-2.5 py-1 text-xs font-mono text-slate-300 focus:outline-none hover:border-indigo-500/30 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    );
  };

  // Total parameters index calculation
  const totalParamStr = useMemo(() => {
    let total = 0;
    models.forEach((m) => {
      const p = parseFloat(m.parameters.replace(/[^\d.]/g, '')) || 0;
      total += p;
    });
    return total > 1000 ? `${(total / 1000).toFixed(1)}T` : `${total}B`;
  }, [models]);

  const avgMMLU = useMemo(() => {
    if (models.length === 0) return 0;
    const sum = models.reduce((acc, m) => acc + m.benchmarks.mmlu, 0);
    return Math.round(sum / models.length);
  }, [models]);

  const commercialSafeCount = useMemo(() => {
    return models.filter(m => m.commercialAllowed).length;
  }, [models]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="registry-panel-container">
      {/* Sidebar Filter Panel - Glassmorphic styled and sticky optimized */}
      <div className="lg:col-span-3 space-y-5 glass-panel p-5 rounded-md h-fit lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1" id="sidebar-filters">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-brand-border pb-3">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
            <Filter className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Filters</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer uppercase tracking-wider hover:underline transition-colors"
            id="filters-reset-btn"
          >
            Clear All
          </button>
        </div>

        {/* Dynamic Registry Stats Widget */}
        <div className="bg-slate-100/50 dark:bg-slate-950/40 rounded-md border border-slate-200 dark:border-brand-border p-3.5 space-y-2.5 relative overflow-hidden" id="sidebar-stats-widget">
          {/* Decorative glowing background accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-brand-border/30 pb-2">
            <span className="p-1 bg-indigo-500/10 rounded border border-indigo-200 dark:border-indigo-500/25 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-700 dark:text-slate-200 uppercase">Registry metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white dark:bg-slate-900/40 p-2 rounded border border-slate-200/60 dark:border-brand-border/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Curated Catalog</span>
              <span className="text-xs font-extrabold font-display text-slate-800 dark:text-slate-100">{models.length} Models</span>
            </div>
            <div className="bg-white dark:bg-slate-900/40 p-2 rounded border border-slate-200/60 dark:border-brand-border/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Indexed Params</span>
              <span className="text-xs font-extrabold font-display text-indigo-600 dark:text-indigo-400">{totalParamStr}</span>
            </div>
            <div className="bg-white dark:bg-slate-900/40 p-2 rounded border border-slate-200/60 dark:border-brand-border/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Avg Benchmark</span>
              <span className="text-xs font-extrabold font-display text-emerald-600 dark:text-emerald-400">{avgMMLU}% MMLU</span>
            </div>
            <div className="bg-white dark:bg-slate-900/40 p-2 rounded border border-slate-200/60 dark:border-brand-border/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Commercial Safe</span>
              <span className="text-xs font-extrabold font-display text-amber-600 dark:text-amber-400">{commercialSafeCount} models</span>
            </div>
          </div>
        </div>

        {/* Commercial Filter Toggle */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-bold block">License Constraint</label>
          <label className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-brand-border rounded-md cursor-pointer hover:border-indigo-500/30 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <input
              type="checkbox"
              checked={commercialOnly}
              onChange={() => setCommercialOnly(!commercialOnly)}
              className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-brand-border bg-white dark:bg-slate-950 accent-indigo-500 cursor-pointer"
              id="commercial-only-checkbox"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 font-sans font-medium">Commercial Use Safe Only</span>
          </label>
        </div>

        {/* Providers */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-bold block">Model Providers</label>
          <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
            {providersList.map((prov) => {
              const isChecked = selectedProviders.includes(prov);
              return (
                <button
                  key={prov}
                  onClick={() => toggleProvider(prov)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-all flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-brand-border dark:hover:bg-slate-800/40'
                  }`}
                  id={`filter-prov-${prov.replace(/\s+/g, '-')}`}
                >
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="truncate">{prov}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 border transition-colors ${
                      isChecked
                        ? 'bg-indigo-100 border-indigo-200 text-indigo-850 dark:bg-indigo-950/60 dark:border-indigo-500/30 dark:text-indigo-300'
                        : 'bg-slate-100 border-slate-200/80 text-slate-550 dark:bg-slate-900/80 dark:border-brand-border/40 dark:text-slate-400'
                    }`}>
                      {providerCounts[prov] || 0}
                    </span>
                  </span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-bold block">Target Specialties</label>
          <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
            {useCasesList.map((useCase) => {
              const isChecked = selectedUseCases.includes(useCase);
              return (
                <button
                  key={useCase}
                  onClick={() => toggleUseCase(useCase)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-all flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-brand-border dark:hover:bg-slate-800/40'
                  }`}
                  id={`filter-usecase-${useCase.replace(/\s+/g, '-')}`}
                >
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="truncate">{useCase}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 border transition-colors ${
                      isChecked
                        ? 'bg-indigo-100 border-indigo-200 text-indigo-850 dark:bg-indigo-950/60 dark:border-indigo-500/30 dark:text-indigo-300'
                        : 'bg-slate-100 border-slate-200/80 text-slate-550 dark:bg-slate-900/80 dark:border-brand-border/40 dark:text-slate-400'
                    }`}>
                      {useCaseCounts[useCase] || 0}
                    </span>
                  </span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameter Size Bracket */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-bold block">Model Parameter Size</label>
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
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-brand-border dark:hover:bg-slate-800/40'
                  }`}
                  id={`filter-size-${b.id}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold font-sans">{b.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 border transition-colors ${
                      isChecked
                        ? 'bg-indigo-100 border-indigo-200 text-indigo-850 dark:bg-indigo-950/60 dark:border-indigo-500/30 dark:text-indigo-300'
                        : 'bg-slate-100 border-slate-200/80 text-slate-550 dark:bg-slate-900/80 dark:border-brand-border/40 dark:text-slate-400'
                    }`}>
                      {sizeBracketCounts[b.id as keyof typeof sizeBracketCounts] || 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1">{b.desc}</span>
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
                <h3 className="text-base font-extrabold text-slate-100 tracking-tight font-display">Featured Open LLMs</h3>
                <p className="text-xs text-slate-400 font-sans">Trending open weights curated by benchmark performance and license allowances.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                      className="flex-1 text-[11px] font-bold text-center py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded border border-slate-200 dark:border-brand-border transition-all cursor-pointer"
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

          <div className="flex flex-wrap items-center gap-4 shrink-0 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 border border-brand-border/60 rounded-md">
              <button
                onClick={() => setViewMode('mixed')}
                className={`px-2.5 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'mixed'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Top 12 Cards + Table list"
                id="viewmode-mixed-btn"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Mixed Layout</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Structured paginated tabular list of all models"
                id="viewmode-table-btn"
              >
                <Table className="w-3 h-3" />
                <span>Full Table</span>
              </button>
              <button
                onClick={() => setViewMode('provider')}
                className={`px-2.5 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'provider'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Organized by Providers list"
                id="viewmode-provider-btn"
              >
                <FolderGit className="w-3 h-3" />
                <span>By Provider</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-400 font-sans">Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950/60 border border-brand-border rounded-md px-3 py-2 text-xs text-slate-250 focus:outline-none hover:border-indigo-500/30 cursor-pointer font-sans"
                id="registry-sort-select"
              >
                <option value="mmlu">MMLU General</option>
                <option value="humanEval">Coding (HumanEval)</option>
                <option value="gsm8k">Math (GSM8K)</option>
                <option value="size_asc">Size: Compact to Large</option>
                <option value="size_desc">Size: Large to Compact</option>
              </select>
            </div>
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
        ) : viewMode === 'provider' ? (
          <div className="space-y-6" id="grouped-providers-container">
            {Object.keys(groupedByProvider).sort().map((prov) => {
              const provModels = groupedByProvider[prov];
              return (
                <div key={`group-${prov}`} className="glass-panel p-5 rounded-md space-y-3" id={`provider-group-${prov.replace(/\s+/g, '-')}`}>
                  <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold font-mono uppercase text-indigo-400">
                        {prov}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        {provModels.length} Model{provModels.length > 1 ? 's' : ''} Curated
                      </span>
                    </div>
                  </div>
                  {renderModelsTable(provModels)}
                </div>
              );
            })}
          </div>
        ) : viewMode === 'table' ? (
          <div className="space-y-4" id="full-table-view-container">
            <div className="glass-panel p-5 rounded-md space-y-3">
              <div className="flex items-center gap-2 border-b border-brand-border/40 pb-2.5">
                <span className="p-1.5 bg-indigo-500/5 rounded-md border border-indigo-500/20 text-indigo-400">
                  <Table className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-200 font-display">All Curated Open LLMs</h3>
                  <p className="text-[11px] text-slate-400 font-sans">Full datagrid table supporting instant sorting on MMLU, GSM8K, Coding, and parameter sizes.</p>
                </div>
              </div>
              
              {renderModelsTable(filteredModels.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize))}
              {renderPagination(filteredModels.length)}
            </div>
          </div>
        ) : (
          <div className="space-y-6" id="mixed-layout-container">
            {/* Top 12 Models as Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="models-list-grid">
              {filteredModels.slice(0, 12).map((model) => {
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
                        {model.primaryUseCases.map((useCase) => {
                          let badgeColor = 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800';
                          if (useCase === 'Coding') {
                            badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400';
                          } else if (useCase === 'Reasoning & Math') {
                            badgeColor = 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/25 dark:text-amber-400';
                          } else if (useCase === 'General Assistant') {
                            badgeColor = 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/25 dark:text-indigo-400';
                          } else if (useCase === 'Multimodal / Vision') {
                            badgeColor = 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/25 dark:text-purple-400';
                          } else if (useCase === 'Local / On-device') {
                            badgeColor = 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-500/10 dark:border-sky-500/25 dark:text-sky-400';
                          } else if (useCase === 'Low-Latency') {
                            badgeColor = 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-400';
                          }
                          return (
                            <span
                              key={useCase}
                              className={`text-[10px] sm:text-xs font-semibold font-mono border px-2.5 py-1 rounded-sm shadow-xs ${badgeColor}`}
                            >
                              {useCase}
                            </span>
                          );
                        })}
                      </div>

                      {/* Expanded Technical Details Drawer */}
                      {isExpanded && (
                        <div className="mt-4">
                          <ModelDeveloperSandbox 
                            model={model} 
                            onSelectVramModel={onSelectVramModel} 
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions footer block */}
                    <div className="border-t border-brand-border pt-4 space-y-3 mt-4">
                      <div className="flex items-center justify-between gap-2 pt-1">
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
                              <ChevronDown className="w-4 h-4 text-slate-400" />
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
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 border-slate-200 dark:border-brand-border text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
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

            {/* Remaining Models in Tabular List */}
            {filteredModels.length > 12 && (
              <div className="space-y-3.5 pt-4">
                <div className="flex items-center gap-2 border-b border-brand-border/60 pb-2">
                  <span className="p-1.5 bg-indigo-500/5 rounded-md border border-indigo-500/20 text-indigo-400">
                    <Table className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 font-display">Additional Curated Open LLMs</h4>
                    <p className="text-[11px] text-slate-500 font-sans">Showing remaining {filteredModels.length - 12} matching entries in an interactive table.</p>
                  </div>
                </div>
                {renderModelsTable(filteredModels.slice(12).slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize))}
                {renderPagination(filteredModels.length - 12)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
