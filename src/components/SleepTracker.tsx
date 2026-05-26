import React, { useState } from "react";
import { 
  Moon, Sun, Coffee, Plus, HelpCircle, Flame, 
  Trash2, TrendingUp, AlertTriangle, BatteryCharging, ShieldAlert 
} from "lucide-react";
import { SleepLog, UserOSProfile } from "../types";

interface SleepTrackerProps {
  sleepLogs: SleepLog[];
  setSleepLogs: React.Dispatch<React.SetStateAction<SleepLog[]>>;
  profile: UserOSProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserOSProfile>>;
  addActivity: (desc: string) => void;
}

export default function SleepTracker({
  sleepLogs,
  setSleepLogs,
  profile,
  setProfile,
  addActivity,
}: SleepTrackerProps) {
  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [quality, setQuality] = useState(85);
  const [notes, setNotes] = useState("");

  const calculateDuration = (sleep: string, wake: string) => {
    const [sHrs, sMins] = sleep.split(":").map(Number);
    const [wHrs, wMins] = wake.split(":").map(Number);
    
    let diffMins = (wHrs * 60 + wMins) - (sHrs * 60 + sMins);
    if (diffMins < 0) {
      diffMins += 24 * 60; // Over midnight
    }
    return Number((diffMins / 60).toFixed(1));
  };

  const handleAddSleepLog = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDuration(sleepTime, wakeTime);

    const newLog: SleepLog = {
      id: "sleep_" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().slice(0, 10),
      sleepTime,
      wakeTime,
      duration,
      quality,
      notes: notes || undefined
    };

    setSleepLogs(p => [newLog, ...p]);
    addActivity(`Logged sleep metrics: ${duration} hours at quality ${quality}%`);
    setNotes("");

    // Award XP
    setProfile(p => {
      let xpAward = 100;
      let nextXp = p.xp + xpAward;
      let currentLevel = p.level;
      if (nextXp >= 1000) {
        nextXp -= 1000;
        currentLevel += 1;
        addActivity(`UPGRADE DISPATCH: Sleep schedule integrity raised Operator level to Tier ${currentLevel}!`);
      }
      return {
        ...p,
        xp: nextXp,
        level: currentLevel,
      };
    });
  };

  const handleDeleteLog = (id: string, date: string) => {
    setSleepLogs(p => p.filter(l => l.id !== id));
    addActivity(`Expunged sleep log profile dated: ${date}`);
  };

  // Math calculated values
  const avgSleep = sleepLogs.length > 0 
    ? Number((sleepLogs.reduce((acc, l) => acc + l.duration, 0) / sleepLogs.length).toFixed(1))
    : 7.5;

  const avgQuality = sleepLogs.length > 0 
    ? Math.round(sleepLogs.reduce((acc, l) => acc + l.quality, 0) / sleepLogs.length)
    : 80;

  const sleepDebt = Number((Math.max(0, 7.5 - avgSleep)).toFixed(1));

  const getQualityColor = (q: number) => {
    if (q >= 85) return "text-emerald-400";
    if (q >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-sleep-tracker-root">
      
      {/* Visual Analytics Grid (8 cols) */}
      <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950 mb-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Moon className="w-4.5 h-4.5 fill-indigo-400 animate-pulse" /> BIO-RHYTHMIC SLEEP TELEMETRY
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">CIRCADIAN INTEGRITY METRICS</span>
          </div>

          {/* Core Sleep Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">AVG DURATION</span>
              <span className="text-2xl font-bold font-mono text-white">{avgSleep} hrs</span>
              <span className="block text-[9px] font-mono text-slate-400 mt-1">Goal: 7.5 hrs/night</span>
            </div>

            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">AVG QUALITY</span>
              <span className={`text-2xl font-bold font-mono ${getQualityColor(avgQuality)}`}>{avgQuality}%</span>
              <span className="block text-[9px] font-mono text-slate-400 mt-1">Goal: &gt;80% REST</span>
            </div>

            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">SLEEP DEBT</span>
              <span className={`text-2xl font-bold font-mono ${sleepDebt > 1 ? 'text-red-400' : 'text-emerald-400'}`}>{sleepDebt} hrs</span>
              <span className="block text-[9px] font-mono text-slate-400 mt-1">Weekly accumulated lag</span>
            </div>

            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">CONSISTENCY</span>
              <span className="text-2xl font-bold font-mono text-indigo-400">92%</span>
              <span className="block text-[9px] font-mono text-slate-400 mt-1">Wake sync accuracy</span>
            </div>
          </div>

          {/* SVG Histograms */}
          <div className="mb-6">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">HISTORICAL CIRCADIAN ALIGNMENT (LAST 7 PERIODINGS)</p>
            {sleepLogs.length === 0 ? (
              <div className="text-center py-6 bg-slate-900/30 rounded border border-slate-800 text-slate-600 text-xs uppercase font-mono">
                No circadian histories registered. Insert telemetry logs to activate chart projection systems.
              </div>
            ) : (
              <div className="h-32 w-full flex items-end gap-3 pt-4 border-b border-slate-900">
                {sleepLogs.slice(0, 7).reverse().map((log, index) => {
                  const percentHeight = Math.min(100, Math.round((log.duration / 12) * 100));
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-950 text-[9px] text-indigo-400 border border-indigo-500/30 p-1 rounded font-mono transition-opacity z-10 text-center whitespace-nowrap">
                        {log.duration} hrs ({log.quality}%)
                      </span>

                      {/* Bar segment */}
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-900 via-indigo-600 to-cyan-400 rounded-t-md hover:filter hover:brightness-125 transition-all shadow-[0_0_8px_rgba(123,97,255,0.2)]"
                        style={{ height: `${percentHeight}%` }}
                      />
                      
                      <span className="text-[8px] font-mono text-slate-600 mt-1.5 truncate max-w-full">
                        {log.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Circadian Recommendation System */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
            <BatteryCharging className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-white font-mono uppercase text-[10px] tracking-widest text-indigo-300">JARVIS RECOMMENDATION DIRECTIVES_</p>
              {sleepDebt > 1.2 ? (
                <p className="mt-1 font-mono">
                  Operator, sleep debt accumulated to <b className="text-red-400">{sleepDebt} hours</b>. 
                  Enforce screen lockdown protocol by <b>10:30 PM tonight</b> and target 8.0 hours tonight. 
                  Your Premiere learning speed correlates strongly with optimal sleep cycles.
                </p>
              ) : (
                <p className="mt-1 font-mono">
                  Rest integrity is excellent, Sir (<b className="text-emerald-400">NOMINAL STABLE</b>). 
                  Continue maintaining the preconfigured wake-up intercept at 6:30 AM to scale YouTube content outputs.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* History Stream List */}
        <div className="mt-4 max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {sleepLogs.length > 0 && (
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">CHRONOLOGICAL MATRIX DATAPOINTS</p>
          )}
          {sleepLogs.map(log => (
            <div key={log.id} className="flex justify-between items-center text-xs font-mono bg-slate-900/30 p-2.5 rounded border border-slate-900 hover:border-indigo-500/10 transition-colors">
              <span className="text-slate-400">[{log.date}] Sleep: {log.sleepTime} - Wake: {log.wakeTime}</span>
              <div className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold">{log.duration} hrs ({log.quality}%)</span>
                <button 
                  onClick={() => handleDeleteLog(log.id, log.date)}
                  className="text-slate-600 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Input Logger (4 cols) */}
      <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
        <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-1">
          <Plus className="w-4 h-4 text-indigo-400" /> APPEND SLEEP CYCLE LOGS
        </h3>

        <form onSubmit={handleAddSleepLog} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">BEDTIME DISENGAGEMENT</label>
            <input 
              type="time"
              required
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">WAKING RE-ENGAGEMENT</label>
            <input 
              type="time"
              required
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">QUALITY COEFFICIENT ({quality}%)</label>
            <input 
              type="range"
              min="20"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">CYCLE REMARKS / BIO-DYNAMICS</label>
            <textarea 
              rows={2}
              placeholder="e.g. Dream clarity high, slight restless leg index..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-950/30 hover:bg-indigo-500 hover:text-slate-950 font-mono font-bold text-xs py-2.5 rounded-lg border border-indigo-500/30 hover:border-indigo-400 transition-all duration-300 shadow-[0_0_12px_rgba(123,97,255,0.1)]"
          >
            RESOLVE BIOPATH MATRIX (+100 XP)
          </button>
        </form>
      </div>

    </div>
  );
}
