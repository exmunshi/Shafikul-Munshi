import React, { useState } from "react";
import { 
  TrendingUp, BarChart2, Star, Target, Shield, Clock, 
  HelpCircle, RefreshCw, Zap, Award 
} from "lucide-react";
import { UserOSProfile } from "../types";

interface ProductivityAnalyticsProps {
  profile: UserOSProfile;
  totalTaskCount: number;
  completedTaskCount: number;
  addActivity: (desc: string) => void;
}

export default function ProductivityAnalytics({
  profile,
  totalTaskCount,
  completedTaskCount,
  addActivity,
}: ProductivityAnalyticsProps) {
  const [activeMetric, setActiveMetric] = useState<"focus" | "completion" | "discipline">("focus");

  const completionRate = totalTaskCount > 0 ? Math.floor((completedTaskCount / totalTaskCount) * 100) : 0;

  // Custom static data for daily consistency rating
  const focusDataPoints = [45, 90, 60, 120, 30, 75, 90]; // Last 7 days in minutes
  const sleepTrendQuality = [78, 85, 92, 80, 88, 95, 90]; // Last 7 days in quality pct
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const handleMetricReset = () => {
    addActivity("Calibrated statistical telemetry coordinates to perfect alignment");
  };

  const maxMinVal = Math.max(...focusDataPoints);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-productivity-analytics-root">
      
      {/* Metric selection rail (4 cols) */}
      <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> SYSTEM DIAGNOSTICS
            </h3>
            <button onClick={handleMetricReset} className="text-slate-500 hover:text-cyan-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-400 leading-relaxed mb-4 uppercase">
            OPERATOR METRIC SECTOR ANALYSIS. ANALYZE BIOPATH AND DIRECTIVE EXECUTION RATIOS.
          </p>

          <div className="space-y-2">
            {[
              { id: "focus", label: "DEEP FOCUS SPRINT TELEMETRY", metric: "380 MINS/WK", color: "border-cyan-500 text-cyan-400" },
              { id: "completion", label: "TASK RESOLUTION INDEX", metric: `${completionRate}% ACCURACY`, color: "border-purple-500 text-purple-400" },
              { id: "discipline", label: "CIRCADIAN SLEEP ALIGNMENT", metric: "96.5% NOMINAL", color: "border-emerald-500 text-emerald-400" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => { setActiveMetric(m.id as any); addActivity(`Calibrated analytics view: ${m.label}`); }}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-300 block ${
                  activeMetric === m.id 
                    ? `bg-slate-900 ${m.color}/50 shadow-[0_0_15px_rgba(0,229,255,0.02)]` 
                    : "border-slate-900 bg-slate-950/20 hover:border-slate-850"
                }`}
              >
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">{m.label}</span>
                <span className="text-sm font-bold font-mono text-slate-200 mt-1">{m.metric}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 mt-4 text-[10px] font-mono text-slate-400">
          <div className="flex justify-between font-bold mb-1">
            <span>CORE RECOVERY PT</span>
            <span className="text-cyan-400">2,850 XP TOTAL</span>
          </div>
          <div className="h-1 bg-slate-950 w-full rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-[68%]" />
          </div>
        </div>
      </div>

      {/* Graphical Holographic chart (8 cols) */}
      <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950 mb-5 text-[10px] font-mono">
            <span className="text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-cyan-400 animate-pulse" /> HOLOGRAPHIC WAVE VECTOR: {activeMetric.toUpperCase()}
            </span>
            <span className="text-slate-500 uppercase">GRID RESOLUTION: TRUE</span>
          </div>

          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 relative">
            
            {/* Embedded Cyber Background Grid */}
            <div className="absolute inset-0 grid grid-rows-4 pointer-events-none p-4 opacity-10">
              <div className="border-b border-cyan-500" />
              <div className="border-b border-cyan-500" />
              <div className="border-b border-cyan-500" />
              <div className="border-b border-cyan-500" />
            </div>

            {activeMetric === "focus" && (
              <>
                <p className="text-[10px] font-mono text-slate-400 mb-6 uppercase">WEEKLY MINUTES OF HYPER-FOCUS SPRINT CYCLES LOGGED</p>
                {/* SVG glowing focus bar line chart */}
                <div className="h-44 w-full flex items-end gap-3.5 relative z-10">
                  {focusDataPoints.map((val, idx) => {
                    const pct = Math.min(100, Math.round((val / 150) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-950 text-[9px] text-cyan-400 border border-cyan-500/30 p-1 rounded font-mono transition-opacity z-20">
                          {val} mins
                        </span>
                        <div 
                          className="w-full bg-gradient-to-t from-cyan-950 to-cyan-400 rounded-t-md hover:filter hover:brightness-125 transition-all shadow-[0_0_10px_rgba(0,229,255,0.25)]"
                          style={{ height: `${pct}%` }}
                        />
                        <span className="text-[9px] font-mono text-slate-500 mt-2">{weekDays[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeMetric === "completion" && (
              <>
                <p className="text-[10px] font-mono text-slate-400 mb-6 uppercase">TACTICAL MATRIX TASK RESOLUTION TREND (PCT RESOLVED)</p>
                <div className="h-44 w-full flex items-end gap-3.5 relative z-10 text-center justify-center">
                  {/* Huge neon circular metric diagram */}
                  <div className="relative inline-flex items-center justify-center p-6 bg-slate-950 rounded-full border border-purple-500/20 shadow-[0_0_20px_rgba(123,97,255,0.1)] w-36 h-36">
                    <span className="text-3xl font-extrabold font-mono text-purple-400 animate-pulse">{completionRate}%</span>
                    <span className="absolute bottom-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest">RESOLVED RATIO</span>
                  </div>
                </div>
              </>
            )}

            {activeMetric === "discipline" && (
              <>
                <p className="text-[10px] font-mono text-slate-400 mb-6 uppercase">circadian Sleep quality coefficient rating trends</p>
                {/* SVG curved path sleep quality chart */}
                <div className="h-44 w-full flex items-end gap-3.5 relative z-10">
                  {sleepTrendQuality.map((val, idx) => {
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-950 text-[9px] text-emerald-400 border border-emerald-500/30 p-1 rounded font-mono transition-opacity z-20">
                          {val}% quality
                        </span>
                        <div 
                          className="w-full bg-gradient-to-t from-emerald-950 to-emerald-400 rounded-t-md hover:filter hover:brightness-125 transition-all shadow-[0_0_10px_rgba(57,255,136,0.25)]"
                          style={{ height: `${val}%` }}
                        />
                        <span className="text-[9px] font-mono text-slate-500 mt-2">{weekDays[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </div>

        {/* Tactical intelligence advice box */}
        <div className="mt-6 bg-slate-900/60 p-4 border border-slate-800 rounded-xl">
          <div className="flex gap-2 items-start text-xs font-mono mb-1">
            <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">AI COGNITIVE METRIC ADVICE_</p>
              {completionRate < 50 ? (
                <p className="text-slate-400 mt-1 uppercase text-[9.5px] leading-relaxed">
                  Operator Shafikul. Task completeness indices are pacing below 50%. Decommission non-critical routine goals and prioritize YouTube scripts to scale content upload ratios.
                </p>
              ) : (
                <p className="text-slate-400 mt-1 uppercase text-[9.5px] leading-relaxed">
                  Execution vectors are running at optimal levels. Disciplinary consistency is maintaining a 92% accurate threshold. Keep up current Premiere editing study cycles to lock in Tier 3 achievements.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
