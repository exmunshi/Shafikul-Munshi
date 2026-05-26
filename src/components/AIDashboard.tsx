import React, { useState, useEffect } from "react";
import { 
  Shield, Zap, Award, Flame, User, Sun, 
  RefreshCw, CheckCircle, Clock, Volume2, AlertCircle
} from "lucide-react";
import { UserOSProfile } from "../types";

interface AIDashboardProps {
  profile: UserOSProfile;
  totalTaskCount: number;
  completedTaskCount: number;
  addActivity: (desc: string) => void;
  activities: { id: string; text: string; time: string }[];
  onTriggerAssistant: (prompt: string) => void;
}

const HOLOGRAM_QUOTES = [
  "Discipline translates intent into video timelines, Sir. Engage resolving protocols.",
  "Sleep debt identified. Recharging neural arrays on schedule is paramount to creative flow.",
  "A single edit completed daily will outpace spasmodic masterstrokes. Stay consistent.",
  "Punctuality is not a constraint, Shafikul. It is the framework of tactical advantage.",
  "YouTube algorithms recognize consistency. Continue calibrating thumbnails.",
  "System telemetry indicates learning speed has accelerated by 14% this week. Maintain current pace."
];

export default function AIDashboard({ 
  profile, 
  totalTaskCount, 
  completedTaskCount, 
  addActivity,
  activities,
  onTriggerAssistant
}: AIDashboardProps) {
  const [timeState, setTimeState] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [weatherTemp, setWeatherTemp] = useState(28);
  const [weatherDesc, setWeatherDesc] = useState("CYBER-STORM INBOUND");

  useEffect(() => {
    const timer = setInterval(() => setTimeState(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % HOLOGRAM_QUOTES.length);
    addActivity("Rotated synaptic quote index");
  };

  const formattedTime = timeState.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formattedDate = timeState.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  // Math calculated metrics
  const xpPercent = Math.min(100, Math.floor((profile.xp / 1000) * 100));
  const completionRate = totalTaskCount > 0 ? Math.floor((completedTaskCount / totalTaskCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-ai-dashboard-root">
      
      {/* Dynamic Digital Clock & Greeting Banner (7 cols on large screens) */}
      <div className="lg:col-span-7 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(0,e5,ff,0.05)] hover:border-cyan-400/40 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Shield className="w-48 h-48 text-cyan-400" />
        </div>

        <div>
          {/* Tag bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              [ SYSTEM STATUS: ONLINE ]
            </span>
            <span className="text-xs font-mono text-slate-400 select-none">
              v2.5.0-NEURAL
            </span>
          </div>

          <p className="text-slate-400 uppercase text-xs font-mono tracking-wider">SYSTEM CHRONOGRAPH</p>
          <h1 className="text-5xl font-extrabold font-mono text-cyan-400 tracking-wider text-glow p-1 bg-gradient-to-r from-cyan-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            {formattedTime}
          </h1>
          <p className="text-slate-300 font-mono text-sm mt-1">{formattedDate}</p>
        </div>

        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">[ USER_AUTHENTICATION ]</p>
          <div className="flex items-center space-x-3 mt-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-indigo-500 p-0.5 shadow-[0_0_10px_rgba(0,229,255,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="text-base font-bold text-white tracking-wide">Operator Shafikul</p>
              <p className="text-xs font-mono text-cyan-400/80">Primary OS Overlord</p>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Weather & Focus Widget (5 cols) */}
      <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 flex flex-col justify-between shadow-[0_0_20px_rgba(123,97,255,0.05)] hover:border-purple-400/40 transition-all duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-purple-400 uppercase font-bold">ATMOSPHERIC RADAR</span>
          </div>
          <button 
            onClick={() => {
              const degrees = Math.floor(Math.random() * 8) + 24;
              setWeatherTemp(degrees);
              setWeatherDesc(degrees > 28 ? "CRITICAL HUMIDITY WAVE" : "CYBER GRID CLEAR");
              addActivity(`Sensed local grid climate update: ${degrees}°C`);
            }}
            className="text-slate-500 hover:text-purple-400 transition-colors p-1 rounded hover:bg-purple-950/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="my-4 flex items-center space-x-4">
          <div className="text-4xl font-mono text-white tracking-tighter">
            {weatherTemp}°C
          </div>
          <div>
            <div className="text-xs font-semibold text-purple-400 uppercase font-mono tracking-wide">
              {weatherDesc}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              SEOUL-CHIPPED GRID AREA
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-3 border border-purple-500/10">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">Streak Level:</span>
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-purple-400" /> {profile.dailyStreak} Days
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" 
              style={{ width: `${Math.min(100, profile.dailyStreak * 10)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gamification Level, XP Meter (6 cols) */}
      <div className="md:col-span-6 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(57,255,136,0.05)] hover:border-emerald-400/40 transition-all duration-300">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-emerald-400">DISCIPLINE ENGINE LEVEL</h3>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-xs font-mono text-slate-400 mr-2">CURRENT MATRIX:</span>
            <span className="text-3xl font-extrabold font-mono text-white">Tier {profile.level}</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">{profile.xp} / 1000 XP</span>
        </div>

        <div className="h-4 w-full bg-slate-900/80 rounded-lg p-0.5 border border-emerald-500/10 overflow-hidden relative mb-4">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-400 rounded-md transition-all duration-500 shadow-[0_0_10px_rgba(57,255,136,0.3)]"
            style={{ width: `${xpPercent}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/90 font-bold tracking-wider">
            {xpPercent}% TO TIER ADVANCEMENT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono text-slate-400">
          <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest">WAKING ACCURACY</span>
            <span className="text-emerald-400 font-bold text-sm">96.8% PERFECT</span>
          </div>
          <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest">PRODUCTIVITY RATING</span>
            <span className="text-cyan-400 font-bold text-sm">{profile.productivityScore} PT</span>
          </div>
        </div>
      </div>

      {/* Interactive JARVIS Diagnostics Core Advice Block (6 cols) */}
      <div className="md:col-span-6 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,e5,ff,0.05)] relative flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">JARVIS COGNITIVE CORE</h3>
            </div>
            <button 
              onClick={handleRotateQuote}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1 hover:text-cyan-300"
            >
              <RefreshCw className="w-3 h-3" />
              <span>CYCLE INPUT</span>
            </button>
          </div>
          
          <div className="py-2">
            <span className="text-[10px] font-mono text-cyan-400/50 block">REF: INTEGRITY_LOG_A7_</span>
            <p className="text-slate-200 font-mono text-sm leading-relaxed italic">
              "{HOLOGRAM_QUOTES[quoteIndex]}"
            </p>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => onTriggerAssistant("Analyze my discipline scores today, Jarvis.")}
            className="flex-1 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-500/20 rounded-lg p-2 text-xs font-mono transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,229,255,0.15)]"
          >
            RESOLVE BIOMETRICS
          </button>
          <button 
            onClick={() => onTriggerAssistant("What editing skills should I record today?")}
            className="flex-1 bg-indigo-950/30 hover:bg-indigo-900/50 text-indigo-400 border border-indigo-500/20 rounded-lg p-2 text-xs font-mono transition-all duration-200 hover:shadow-[0_0_10px_rgba(123,97,255,0.15)]"
          >
            EDITING LESSONS
          </button>
        </div>
      </div>

      {/* Daily Tactical Operation Checklist Mission List (4 cols) */}
      <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white mb-4 flex items-center justify-between">
          <span>DAILY GRID GOALS</span>
          <span className="text-xs font-mono text-slate-500 font-normal">
            ({completedTaskCount}/{totalTaskCount} COMPLETED)
          </span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
            <CheckCircle className={`w-4 h-4 mt-0.5 ${completionRate >= 50 ? 'text-cyan-400' : 'text-slate-600'}`} />
            <div>
              <p className="text-xs font-sans text-slate-300 font-semibold">Integrate Video Skill Lesson</p>
              <p className="text-[10px] font-mono text-slate-500">Track at least 1 course in Learning tracker</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
            <Clock className={`w-4 h-4 mt-0.5 ${profile.waterIntake >= 2000 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <div>
              <p className="text-xs font-sans text-slate-300 font-semibold">Hydration Lock Routine</p>
              <p className="text-[10px] font-mono text-slate-500">Drink 2.5L clean H2O to secure focus rates</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
            <Award className={`w-4 h-4 mt-0.5 ${completedTaskCount > 0 ? 'text-purple-400' : 'text-slate-600'}`} />
            <div>
              <p className="text-xs font-sans text-slate-300 font-semibold">Decimate high-priority alarm</p>
              <p className="text-[10px] font-mono text-slate-500">Wake up accurately and finish 1 prime task</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cybernetic OS Matrix System Feed Logs (8 cols) */}
      <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
         <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              CORE OS ACTIVITY LIVE-FEED
            </span>
            <span className="text-[10px] font-mono text-slate-500">SENSORY TELEMETRY</span>
          </h3>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar font-mono text-[11px]">
            {activities.length === 0 ? (
              <div className="text-slate-600 py-8 text-center uppercase tracking-wider italic text-[11px]">
                No event signatures mapped. Start executing processes, Operator.
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex justify-between py-1 border-b border-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900/10 px-1 rounded transition-colors text-xs font-mono">
                  <span className="text-slate-500 tracking-wider">[{act.time}]</span>
                  <span className="text-slate-300 text-right font-medium max-w-[70%] truncate">{act.text}</span>
                </div>
              ))
            )}
          </div>
         </div>
         
         <div className="mt-4 flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-3">
           <span className="text-slate-500">MEMORY_SECTOR: SECURE</span>
           <span className="text-cyan-400/80 hover:underline cursor-pointer" onClick={() => onTriggerAssistant("system hardware status review")}>
             INSPECT HARDWARE SIG_
           </span>
         </div>
      </div>

    </div>
  );
}
