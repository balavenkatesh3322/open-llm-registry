import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Activity, 
  X, 
  Globe, 
  Users, 
  Laptop, 
  Compass, 
  ExternalLink,
  Github,
  Heart,
  ChevronRight,
  Shield,
  Smartphone
} from 'lucide-react';

interface TrafficAndContactWidgetsProps {
  currentTab: string;
}

interface TelemetryEvent {
  id: string;
  time: string;
  location: string;
  action: string;
  badge: string;
}

const SIMULATED_LOCATIONS = [
  'San Francisco, US', 'London, UK', 'Singapore', 'Bengaluru, IN', 
  'Munich, DE', 'Sydney, AU', 'Tokyo, JP', 'Paris, FR', 
  'Toronto, CA', 'Amsterdam, NL', 'Seoul, KR', 'Dublin, IE'
];

const SIMULATED_ACTIONS = [
  { action: "Searched for 'DeepSeek-R1-70B'", badge: "Search" },
  { action: "Checked Ollama run command for 'Llama-3.3'", badge: "CLI" },
  { action: "Initiated LLM Guided Advisor checklist", badge: "Advisor" },
  { action: "Estimated VRAM requirements for 'Qwen-2.5-72B'", badge: "VRAM" },
  { action: "Explored 'Mistral Small' parameter details", badge: "View" },
  { action: "Toggled Commercial Use license filter", badge: "Filter" },
  { action: "Downloaded offline architecture parameters", badge: "Asset" },
  { action: "Vetted Hugging Face repository endpoints", badge: "Repo" }
];

export default function TrafficAndContactWidgets({ currentTab }: TrafficAndContactWidgetsProps) {
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [showTrafficDrawer, setShowTrafficDrawer] = useState(false);
  
  // Traffic stats
  const [activeUsers, setActiveUsers] = useState(42);
  const [totalPageViews, setTotalPageViews] = useState(1284);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([]);
  
  // Client stats
  const [clientInfo, setClientInfo] = useState({
    userAgent: 'Loading...',
    platform: 'Unknown',
    resolution: '0x0',
    language: 'en-US',
    networkType: '4G/Broadband',
    sessionDuration: 0
  });

  // Increment session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setClientInfo(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real client stats on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      let platformName = navigator.platform || 'Web Browser';
      if (ua.includes('Macintosh')) platformName = 'macOS';
      else if (ua.includes('Windows')) platformName = 'Windows';
      else if (ua.includes('Linux')) platformName = 'Linux';
      else if (ua.includes('iPhone') || ua.includes('iPad')) platformName = 'iOS';
      else if (ua.includes('Android')) platformName = 'Android';

      setClientInfo(prev => ({
        ...prev,
        userAgent: ua,
        platform: platformName,
        resolution: `${window.screen.width} x ${window.screen.height}`,
        language: navigator.language || 'en-US'
      }));
    }
  }, []);

  // Fluctuating active users & accumulating total views
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return Math.max(30, Math.min(65, next));
      });
      setTotalPageViews(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate initial events and append new ones periodically
  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return now.toTimeString().split(' ')[0];
    };

    // Initial event backlog
    const initialEvents: TelemetryEvent[] = Array.from({ length: 6 }).map((_, i) => {
      const loc = SIMULATED_LOCATIONS[Math.floor(Math.random() * SIMULATED_LOCATIONS.length)];
      const actObj = SIMULATED_ACTIONS[Math.floor(Math.random() * SIMULATED_ACTIONS.length)];
      const offsetSec = (i + 1) * 12;
      const eventTime = new Date(Date.now() - offsetSec * 1000).toTimeString().split(' ')[0];

      return {
        id: `init-${i}`,
        time: eventTime,
        location: loc,
        action: actObj.action,
        badge: actObj.badge
      };
    });

    setTelemetryEvents(initialEvents);

    // Stream new events
    const eventStream = setInterval(() => {
      const loc = SIMULATED_LOCATIONS[Math.floor(Math.random() * SIMULATED_LOCATIONS.length)];
      const actObj = SIMULATED_ACTIONS[Math.floor(Math.random() * SIMULATED_ACTIONS.length)];
      
      const newEvent: TelemetryEvent = {
        id: `stream-${Date.now()}`,
        time: formatTime(),
        location: loc,
        action: actObj.action,
        badge: actObj.badge
      };

      setTelemetryEvents(prev => [newEvent, ...prev.slice(0, 8)]);
    }, 4500);

    return () => clearInterval(eventStream);
  }, []);

  // Format session time
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      {/* Floating Action Buttons Group - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end" id="floating-widget-group">
        
        {/* WhatsApp Floating Trigger */}
        <button
          onClick={() => {
            setShowWhatsAppPopup(!showWhatsAppPopup);
            setShowTrafficDrawer(false);
          }}
          className={`flex items-center gap-2 p-3 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
            showWhatsAppPopup 
              ? 'bg-rose-500 hover:bg-rose-600' 
              : 'bg-emerald-600 hover:bg-emerald-500 animate-bounce'
          }`}
          style={{ animationDuration: '3s' }}
          title="Direct WhatsApp Helpline"
          id="whatsapp-floating-trigger"
        >
          <MessageCircle className="w-5 h-5 fill-white/10" />
          <span className="text-xs font-semibold pr-1 hidden sm:inline">WhatsApp Help</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-300"></span>
          </span>
        </button>

        {/* Telemetry Floating Trigger */}
        <button
          onClick={() => {
            setShowTrafficDrawer(!showTrafficDrawer);
            setShowWhatsAppPopup(false);
          }}
          className={`flex items-center gap-2 p-3 rounded-full shadow-xl border hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
            showTrafficDrawer 
              ? 'bg-indigo-600 border-indigo-500 text-white' 
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:border-brand-border dark:text-slate-100 backdrop-blur-md'
          }`}
          title="Live Traffic and Geolocation Telemetry"
          id="traffic-floating-trigger"
        >
          <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div className="flex flex-col items-start pr-1 hidden sm:flex text-left leading-none gap-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Live Traffic</span>
            <span className="text-[11px] font-mono text-indigo-400 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              {activeUsers} Active
            </span>
          </div>
        </button>
      </div>

      {/* WhatsApp Quick Chat Dialog */}
      {showWhatsAppPopup && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-80 rounded-lg border border-brand-border shadow-2xl overflow-hidden glass-panel animate-fade-in"
          id="whatsapp-popup-card"
        >
          {/* Header */}
          <div className="bg-emerald-600/90 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 font-bold font-display text-sm">
                BV
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">Bala Venkatesh</h4>
                <span className="text-[9px] text-emerald-100 font-mono">Lead AI Engineer & Author</span>
              </div>
            </div>
            <button 
              onClick={() => setShowWhatsAppPopup(false)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 font-sans text-xs text-slate-300">
            <p className="leading-relaxed">
              Hello! Have a question about local open-weight LLMs, inference architectures, or want to explore collaboration?
            </p>
            <div className="bg-slate-950/40 p-2.5 rounded border border-brand-border flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold text-base mt-0.5">&ldquo;</span>
              <p className="text-[11px] text-slate-400 italic leading-normal">
                Let's discuss GPU quantizations, vLLM routing configurations, or project sponsorship. Directly reachable via WhatsApp!
              </p>
            </div>
            <div className="pt-2">
              <a 
                href="https://wa.me/919003812808?text=Hello%20Bala,%20I'm%20using%20the%20OpenLLM%20Index%20and%20would%20love%20to%20chat!" 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-950/35 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/10" />
                <span>Start Direct WhatsApp Chat</span>
              </a>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-950/40 px-4 py-2 border-t border-brand-border text-center">
            <span className="text-[9px] text-slate-500 font-mono">Direct Line: +91 9003812808</span>
          </div>
        </div>
      )}

      {/* Live Traffic & Telemetry sliding Console Drawer */}
      {showTrafficDrawer && (
        <div 
          className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950/95 border-l border-brand-border shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in"
          id="traffic-telemetry-drawer"
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono">OpenLLM Telemetry Console</h3>
                <p className="text-[9px] text-slate-500 font-mono">Real-time visitor patterns and node streams</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTrafficDrawer(false)}
              className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-thin-scrollbar">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-3 rounded border border-brand-border space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                  <span>Current Users</span>
                  <Users className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-mono font-bold text-slate-100">{activeUsers}</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping inline-block" />
                    LIVE
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-900/60 p-3 rounded border border-brand-border space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                  <span>Today's Views</span>
                  <Activity className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-mono font-bold text-slate-100">{totalPageViews}</span>
                  <span className="text-[9px] text-indigo-400 font-mono font-bold">+{(Math.random() * 1.5 + 0.5).toFixed(1)}k/hr</span>
                </div>
              </div>
            </div>

            {/* My Connection Signature Block */}
            <div className="bg-slate-900/30 border border-brand-border/60 rounded p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wide">Your Session Signature</span>
                </div>
                <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase">Secure Connection</span>
              </div>
              
              <div className="space-y-2 font-mono text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>Connection Origin</span>
                  <span className="text-slate-200">Local Host / Studio Container</span>
                </div>
                <div className="flex justify-between">
                  <span>Detected Platform</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <Laptop className="w-3 h-3 text-slate-500" />
                    {clientInfo.platform}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Display Resolution</span>
                  <span className="text-slate-200">{clientInfo.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language / Locale</span>
                  <span className="text-slate-200">{clientInfo.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Navigation Path</span>
                  <span className="text-indigo-400 font-bold bg-indigo-500/5 px-1 rounded border border-indigo-500/20">
                    /{currentTab === 'registry' ? 'explore-registry' : currentTab}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Session Active For</span>
                  <span className="text-emerald-400 font-bold">{formatDuration(clientInfo.sessionDuration)}</span>
                </div>
              </div>
            </div>

            {/* Top Visited Routes Breakdown */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Top Router Heatmap</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-300">/explore-registry</span>
                    <span className="text-slate-400 font-bold">42% (Current Base)</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-300">/guided-advisor (New)</span>
                    <span className="text-rose-300 font-bold">28% (Trending)</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full bg-rose-400 rounded-full animate-pulse" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-300">/inference-engines</span>
                    <span className="text-slate-400 font-bold">18%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-300">/vram-predictor</span>
                    <span className="text-slate-400 font-bold">12%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Streaming Log Feed */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Live Node Traffic Logs</span>
              <div className="bg-slate-950 border border-brand-border rounded p-2.5 font-mono text-[9.5px] leading-relaxed text-slate-400 space-y-2.5 max-h-[180px] overflow-y-auto custom-thin-scrollbar">
                {telemetryEvents.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-2 border-b border-brand-border/20 pb-1.5 last:border-0 last:pb-0 animate-fade-in">
                    <span className="text-indigo-400 shrink-0">[{evt.time}]</span>
                    <span className="text-slate-500 font-bold shrink-0">{evt.location}</span>
                    <span className="text-slate-300 flex-1 truncate">{evt.action}</span>
                    <span className="text-[7.5px] font-sans font-extrabold px-1 py-0.2 rounded bg-slate-900 border border-brand-border text-slate-400 uppercase shrink-0">
                      {evt.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-900 border-t border-brand-border space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Global load balanced node</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold">99.98% SLA</span>
            </div>
            
            <a 
              href="https://github.com/balavenkatesh3322/open-llm-registry" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-brand-border hover:border-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Github className="w-4 h-4 text-indigo-400" />
              <span>Contribute Code / Submit Metrics</span>
            </a>
          </div>

        </div>
      )}
    </>
  );
}
