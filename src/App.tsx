import React, { useState, useEffect } from 'react';
import { 
  OPEN_SOURCE_MODELS, 
  fetchModelsFromReadme, 
  fetchModelsFromMarkdownFiles, 
  fetchHomePageContent, 
  HomePageContent 
} from './data/models';
import RegistryPanel from './components/RegistryPanel';
import VramCalculator from './components/VramCalculator';
import ComparisonCanvas from './components/ComparisonCanvas';
import MatchingWizard from './components/MatchingWizard';
import InferenceEnginesPanel from './components/InferenceEnginesPanel';
import SyncPanel from './components/SyncPanel';
import DeveloperAd from './components/DeveloperAd';
import TrafficAndContactWidgets from './components/TrafficAndContactWidgets';
import { 
  Database, 
  Search,
  Cpu, 
  Layers, 
  Compass, 
  Settings, 
  Github, 
  HelpCircle, 
  TrendingUp, 
  Terminal, 
  Award,
  Zap,
  BookOpen,
  Linkedin,
  Heart,
  Gift,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

const renderStyledHeroTitle = (title: string) => {
  const keyword = "Open-Source LLMs";
  if (title.includes(keyword)) {
    const parts = title.split(keyword);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-indigo-400 via-rose-300 to-emerald-400 bg-clip-text text-transparent font-extrabold">{keyword}</span>
        {parts[1]}
      </>
    );
  }
  return title;
};

const IconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  Terminal,
  Award
};

export default function App() {
  const [models, setModels] = useState(OPEN_SOURCE_MODELS);
  const [activeTab, setActiveTab] = useState<'registry' | 'vram' | 'compare' | 'wizard' | 'engines' | 'sync'>('registry');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(['deepseek-r1', 'llama-3.3-70b-instruct']);
  const [selectedVramModelId, setSelectedVramModelId] = useState<string>('llama-3.3-70b-instruct');
  const [globalSearch, setGlobalSearch] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [homeContent, setHomeContent] = useState<HomePageContent | null>(null);

  // Apply theme class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load models and page contents from markdown files on mount
  useEffect(() => {
    let active = true;
    async function loadDynamicContent() {
      // 1. Try to load models from modular markdown registry files
      const markdownModels = await fetchModelsFromMarkdownFiles();
      if (markdownModels && active) {
        setModels(markdownModels);
      } else {
        // Fallback to README.md if markdown folder is not accessible
        const readmeModels = await fetchModelsFromReadme();
        if (readmeModels && active) {
          setModels(readmeModels);
        }
      }

      // 2. Load dynamic home page content from markdown
      const homeData = await fetchHomePageContent();
      if (homeData && active) {
        setHomeContent(homeData);
      }
    }
    loadDynamicContent();
    return () => {
      active = false;
    };
  }, []);

  // Listen for Ctrl+K global keyboard shortcut to focus header search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('header-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle model selection in comparison stack (limit to max 3)
  const handleToggleCompare = (id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert('Comparison stack is limited to a maximum of 3 models at a time. Please remove an existing model first.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSelectVramModel = (id: string) => {
    setSelectedVramModelId(id);
    setActiveTab('vram');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 font-sans antialiased" id="app-root-container">
      {/* Decorative top grid accent with crisp, thin balanced lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Primary Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-brand-border/40" id="app-sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Left: Brand Identity with Brain Emoji Vibe */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-xl sm:text-2xl select-none" role="img" aria-label="neural-brain-vibe">🧠</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">2026</span>
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight font-display leading-none">OpenLLM Index</h1>
                </div>
                <p className="text-[8px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">Decision Engine & Registry</p>
              </div>
            </div>

            {/* Middle-Left: Global Interactive Search Bar (Hugging Face style) */}
            <div className="hidden md:flex xl:hidden 2xl:flex items-center relative max-w-[160px] lg:max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Search models..."
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  if (activeTab !== 'registry') {
                    setActiveTab('registry');
                  }
                }}
                className="w-full pl-8 pr-10 py-1.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-brand-border rounded text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/10 transition-all font-sans"
              />
              <span className="absolute right-2 text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-brand-border/60 text-slate-400 dark:text-slate-500 pointer-events-none">
                Ctrl+K
              </span>
            </div>

            {/* Middle-Right: Beautiful Navigation Tabs (similar to HF header tabs: light text with icons, active state uses a subtle underline/capsule) */}
            <nav className="hidden xl:flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 flex-1 min-w-0 justify-end" id="desktop-navbar">
              <button
                onClick={() => setActiveTab('registry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer border shrink-0 ${
                  activeTab === 'registry'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
                id="nav-tab-registry"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Models</span>
              </button>

              <button
                onClick={() => setActiveTab('wizard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer border shrink-0 ${
                  activeTab === 'wizard'
                    ? 'bg-rose-500/10 border-rose-500/35 text-rose-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-rose-300 hover:bg-rose-950/10'
                }`}
                id="nav-tab-wizard"
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Advisor</span>
              </button>

              <button
                onClick={() => setActiveTab('engines')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer border shrink-0 ${
                  activeTab === 'engines'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
                id="nav-tab-engines"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Engines</span>
              </button>

              <button
                onClick={() => setActiveTab('vram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer border shrink-0 ${
                  activeTab === 'vram'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
                id="nav-tab-vram"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>VRAM</span>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer relative border shrink-0 ${
                  activeTab === 'compare'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
                id="nav-tab-compare"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare</span>
                {selectedCompareIds.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/35 text-[9px] font-bold text-slate-200 border border-brand-border font-mono ml-0.5">
                    {selectedCompareIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer border shrink-0 ${
                  activeTab === 'sync'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
                id="nav-tab-sync"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Registry</span>
              </button>
            </nav>

            {/* Right Side Actions / GitHub */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dropdown for smaller screens where the horizontal menu would wrap */}
              <div className="xl:hidden hidden md:block">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-brand-border text-xs rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer font-semibold"
                >
                  <option value="registry">Explore Models</option>
                  <option value="wizard">LLM Advisor</option>
                  <option value="engines">Inference Engines</option>
                  <option value="vram">VRAM Predictor</option>
                  <option value="compare">Compare Matrix ({selectedCompareIds.length})</option>
                  <option value="sync">Registry Manager</option>
                </select>
              </div>

              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-brand-border hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" id="app-main-layout">
        
        {/* Mobile Navigation Bar - Symmetrical and sharp */}
        <div className="grid grid-cols-6 gap-0.5 p-1 bg-brand-nav border border-brand-border rounded-md md:hidden" id="mobile-navigation">
          <button
            onClick={() => setActiveTab('registry')}
            className={`py-2.5 px-0.5 rounded-sm text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'registry' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold' 
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            id="m-nav-tab-registry"
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight">Explore</span>
          </button>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`py-2.5 px-0.5 rounded-sm text-center flex flex-col items-center justify-between gap-1 cursor-pointer transition-all ${
              activeTab === 'wizard' 
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold' 
                : 'text-slate-400 border border-rose-500/10 hover:text-rose-300'
            }`}
            id="m-nav-tab-wizard"
          >
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span className="text-[9px] font-bold leading-none">Advisor</span>
          </button>
          <button
            onClick={() => setActiveTab('engines')}
            className={`py-2.5 px-0.5 rounded-sm text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'engines' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold' 
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            id="m-nav-tab-engines"
          >
            <Terminal className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight">Engines</span>
          </button>
          <button
            onClick={() => setActiveTab('vram')}
            className={`py-2.5 px-0.5 rounded-sm text-center flex flex-col items-center justify-between gap-1 cursor-pointer transition-all ${
              activeTab === 'vram' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold' 
                : 'text-slate-400 hover:text-indigo-400 border border-transparent'
            }`}
            id="m-nav-tab-vram"
          >
            <Cpu className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">VRAM</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`py-2.5 px-0.5 rounded-sm text-center flex flex-col items-center justify-between gap-1 cursor-pointer transition-all relative ${
              activeTab === 'compare' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold' 
                : 'text-slate-400 hover:text-indigo-400 border border-transparent'
            }`}
            id="m-nav-tab-compare"
          >
            <Layers className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">Compare</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-2.5 px-0.5 rounded-sm text-center flex flex-col items-center justify-between gap-1 cursor-pointer transition-all ${
              activeTab === 'sync' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold' 
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            id="m-nav-tab-sync"
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="text-[9px] font-medium leading-none">Manage</span>
          </button>
        </div>

        {/* Hero Segment - Symmetrical grid, solid borders, exact margins */}
        <div className="relative overflow-hidden rounded-md glass-panel p-6 sm:p-8" id="hero-marketing-segment">
          {/* Symmetrical gradient glow */}
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-full bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 rounded-sm text-[10px] font-mono tracking-wider font-semibold">
                <Zap className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                <span>{homeContent?.heroBadge || "100% COMPATIBLE WITH OLLAMA, VLLM & HUGGING FACE"}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight leading-tight font-display">
                {homeContent?.heroTitle ? (
                  renderStyledHeroTitle(homeContent.heroTitle)
                ) : (
                  <>Discover & Deploy the Perfect <span className="bg-gradient-to-r from-indigo-400 via-rose-300 to-emerald-400 bg-clip-text text-transparent font-extrabold font-semibold">Open-Source LLMs</span> In Seconds</>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans max-w-2xl">
                {homeContent?.heroDescription || "Avoid catalog fatigue. Discover, analyze, and test the finest open-weight models vetted by execution benchmarks, licenses, and context limits. Compute local VRAM hardware compatibility and compare execution structures in 30 seconds."}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setActiveTab('registry')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-all cursor-pointer shadow-sm"
                  id="hero-explore-cta"
                >
                  Browse Curated Catalog
                </button>
                <button
                  onClick={() => setActiveTab('wizard')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-brand-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md transition-all cursor-pointer"
                  id="hero-quiz-cta"
                >
                  Guided Model Matcher
                </button>
              </div>
            </div>

            {/* Quick Metrics Ticker Block - Styled as a crisp hardware ledger panel */}
            <div className="lg:col-span-4 bg-brand-bg/80 border border-brand-border rounded-md p-5 space-y-4 shadow-inner" id="stats-ticker-widget">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                <span>INDEX STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>● STABLE</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="border-l border-brand-border pl-3">
                  <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{models.length}</span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Top-vetted Models</p>
                </div>
                <div className="border-l border-brand-border pl-3">
                  <span className="text-2xl font-bold text-indigo-400 font-mono tracking-tight">
                    {models.length > 0 ? Math.max(...models.map(m => m.contextWindow)) / 1000 : 128}K
                  </span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Peak Context</p>
                </div>
                <div className="border-l border-brand-border pl-3">
                  <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
                    {models.length > 0 ? (models.filter(m => m.deployment.ollamaId).length / models.length * 100).toFixed(0) : 100}%
                  </span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Ollama Native</p>
                </div>
                <div className="border-l border-brand-border pl-3">
                  <span className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
                    {models.length > 0 ? (models.filter(m => m.license.toLowerCase().includes('apache') || m.license.toLowerCase().includes('mit')).length / models.length * 100).toFixed(0) : 60}%
                  </span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Apache-2.0 / MIT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Screen Content Panel */}
        <div id="interactive-screen-mount">
          {activeTab === 'registry' && (
            <RegistryPanel
              models={models}
              selectedCompareIds={selectedCompareIds}
              onToggleCompare={handleToggleCompare}
              onSelectVramModel={handleSelectVramModel}
              search={globalSearch}
              onSearchChange={setGlobalSearch}
            />
          )}

          {activeTab === 'vram' && (
            <VramCalculator
              models={models}
              initialModelId={selectedVramModelId}
            />
          )}

          {activeTab === 'compare' && (
            <ComparisonCanvas
              selectedModelIds={selectedCompareIds}
              models={models}
              onRemoveModel={handleToggleCompare}
              onClearAll={() => setSelectedCompareIds([])}
              onBackToRegistry={() => setActiveTab('registry')}
            />
          )}

          {activeTab === 'wizard' && (
            <MatchingWizard
              models={models}
              onSelectModel={(id) => {
                handleSelectVramModel(id);
              }}
            />
          )}

          {activeTab === 'engines' && (
            <InferenceEnginesPanel
              models={models}
            />
          )}

          {activeTab === 'sync' && (
            <SyncPanel
              models={models}
              onUpdateModels={(updatedList) => setModels(updatedList)}
            />
          )}
        </div>

        {/* Secondary Info / Use Guide block (Anti-AI-Slop & Human Vibe focus) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 glass-panel p-6" id="footer-educational-grid">
          {homeContent?.guides && homeContent.guides.length > 0 ? (
            homeContent.guides.map((guide, idx) => {
              const GuideIcon = IconMap[guide.icon] || Award;
              let borderClass = "";
              if (idx === 0) borderClass = "border-b md:border-b-0 md:border-r border-brand-border/60 last:border-0 md:pr-6 md:last:pr-0";
              else if (idx === 1) borderClass = "border-b md:border-b-0 md:border-r border-brand-border/60 last:border-0 md:px-6 md:last:border-0";
              else borderClass = "last:border-0 md:pl-6";

              return (
                <div key={guide.id} className={`space-y-2.5 p-1 ${borderClass}`}>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-500/5 rounded-md border border-indigo-500/10 text-indigo-400">
                      <GuideIcon className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider font-display text-slate-200">{guide.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {guide.description.includes('**') ? (
                      (() => {
                        const parts = guide.description.split('**');
                        return (
                          <>
                            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-200">{part}</strong> : part)}
                          </>
                        );
                      })()
                    ) : (
                      guide.description
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <>
              <div className="space-y-2.5 p-1 border-b md:border-b-0 md:border-r border-brand-border/60 last:border-0 md:pr-6 md:last:pr-0">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-500/5 rounded-md border border-indigo-500/10 text-indigo-400"><TrendingUp className="w-4 h-4" /></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-display text-slate-200">How to choose quantization?</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  <strong>Q4_K_M</strong> (4-bit quantization) is the gold standard for running open LLMs locally. It reduces weight size by 70%+ with virtually zero noticeable loss in conversational intelligence. Only choose 16-bit float if doing complex scientific evaluations.
                </p>
              </div>

              <div className="space-y-2.5 p-1 border-b md:border-b-0 md:border-r border-brand-border/60 last:border-0 md:px-6 md:last:border-0">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-500/5 rounded-md border border-emerald-500/10 text-emerald-400"><Terminal className="w-4 h-4" /></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-display text-slate-200">Why local models?</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Running models offline ensures 100% data privacy (crucial for proprietary codebases or medical/financial context), works entirely without internet connection, has zero per-token execution costs, and bypasses third-party rate limits.
                </p>
              </div>

              <div className="space-y-2.5 p-1 last:border-0 md:pl-6">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500/5 rounded-md border border-amber-500/10 text-amber-400"><Award className="w-4 h-4" /></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-display text-slate-200">Our evaluation strategy</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Instead of loading custom proprietary test benches, we curate authenticated industry ratings across MMLU (high-level general knowledge), HumanEval (strict Python code block accuracy tests), and GSM8K (high-school multi-step mathematical reasoning).
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Redesigned Premium Professional Glassmorphic Footer */}
      <footer className="border-t border-brand-border bg-slate-950/80 backdrop-blur-lg py-12 mt-16 relative overflow-hidden" id="app-footer">
        {/* Subtle grid elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:4rem] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-brand-border/60">
            
            {/* Mission Statement */}
            <div className="lg:col-span-4 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded">
                  <Database className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-bold font-display text-slate-200">OpenLLM Index</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                An independent developer directory built to combat catalog fatigue. We benchmark, evaluate, and provide precise local hardware compatibility data for the world's finest open weight language models.
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                All metrics are parsed from authentic Hugging Face, Chatbot Arena, and manufacturer test blocks.
              </p>
            </div>

            {/* Contributor Section */}
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                  <Heart className="w-3.5 h-3.5 fill-emerald-400/10" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300 font-mono">Community Contribution</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Want to help catalog new models or improve the local VRAM predictors? We are 100% open-source! Check our repository and submit a pull request with new data mappings.
              </p>
              <div>
                <a 
                  href="https://github.com/balavenkatesh3322/open-llm-registry" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Contribute on GitHub &rarr;</span>
                </a>
              </div>
            </div>

            {/* Sponsor Section */}
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded">
                  <Gift className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300 font-mono">Sponsor Project</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Help us offset the compute resources required to run continuous benchmark evaluations, GPU sandbox quantizations, and live hardware compatibility predictions. Every sponsorship keeps this index fast and free.
              </p>
              <div>
                <a 
                  href="https://balavenkatesh3322.github.io/bala_venkatesh_profile/" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-semibold hover:text-rose-300 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                  <span>Become a Sponsor &rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Symmetrical Authoring Credits and Socials */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">Created & Maintained By</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                <a 
                  href="https://balavenkatesh3322.github.io/bala_venkatesh_profile/" 
                  target="_blank" 
                  referrerPolicy="no-referrer" 
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-all hover:underline text-sm font-display"
                  id="footer-author-link"
                >
                  Bala Venkatesh
                </a>
                <span className="text-slate-600 font-mono">|</span>
                <span className="text-slate-400 text-xs font-sans">Lead AI Engineer</span>
              </div>
            </div>

            {/* Premium Social Badge Container */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a 
                href="https://github.com/balavenkatesh3322/open-llm-registry" 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 border border-slate-200 dark:border-brand-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-all text-xs font-sans"
                title="GitHub Repository"
              >
                <Github className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub Repository</span>
              </a>

              <a 
                href="https://www.linkedin.com/in/bala-venkatesh-67964247/" 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 border border-slate-200 dark:border-brand-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-all text-xs font-sans"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                <span>LinkedIn Profile</span>
              </a>

              <a 
                href="https://balavenkatesh3322.github.io/bala_venkatesh_profile/" 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 border border-slate-200 dark:border-brand-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-all text-xs font-sans"
                title="Professional Portfolio"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Portfolio</span>
              </a>

              <a 
                href="mailto:venkateshpnk22@gmail.com" 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 border border-slate-200 dark:border-brand-border hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-all text-xs font-mono text-[11px]"
                title="Email Direct"
              >
                <span>venkateshpnk22@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-border/20 mt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-600">
            <p>All rights reserved &copy; 2026 OpenLLM Index.</p>
            <p className="mt-1 sm:mt-0">Vetted for Offline execution, Privacy First local systems.</p>
          </div>
        </div>
      </footer>
      <TrafficAndContactWidgets currentTab={activeTab} />
    </div>
  );
}
