import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, RotateCcw, Clock, Plus, Zap, Calendar, User, 
  Trash2, AlertCircle, Activity, Hourglass, HelpCircle 
} from "lucide-react";
import { ScheduleBlock, UserOSProfile } from "../types";

interface AdvancedTimeSchedulerProps {
  schedule: ScheduleBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
  profile: UserOSProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserOSProfile>>;
  addActivity: (desc: string) => void;
}

export default function AdvancedTimeScheduler({
  schedule,
  setSchedule,
  profile,
  setProfile,
  addActivity,
}: AdvancedTimeSchedulerProps) {
  const [activeTab, setActiveTab] = useState<"day" | "weekly" | "focus">("day");
  
  // Time Block State
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("10:30");
  const [newCategory, setNewCategory] = useState<"work" | "learning" | "youtube" | "discipline" | "personal">("learning");
  const [newNotes, setNewNotes] = useState("");

  // Focus Timer controls (Pomodoro Engine)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (profile.isFocusTimerRunning && profile.focusTimerSecondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setProfile(p => {
          if (p.focusTimerSecondsLeft <= 1) {
            clearInterval(timerRef.current!);
            addActivity(`Completed Focus Block: ${p.focusTimerLabel}. Dispatching rewards.`);
            
            // Audio Web Feed Trigger (Hologram beep)
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.type = "sine";
              osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high nice frequency
              gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.6);
            } catch (e) {}

            // Increment XP and level
            let newXp = p.xp + 150;
            let currentLevel = p.level;
            if (newXp >= 1000) {
              newXp = newXp - 1000;
              currentLevel += 1;
              addActivity(`LEVEL ADVANCEMENT INSTANTIATED: Operator Shafikul upgraded to Tier ${currentLevel}!`);
            }

            return {
              ...p,
              isFocusTimerRunning: false,
              focusTimerSecondsLeft: 0,
              xp: newXp,
              level: currentLevel,
              productivityScore: p.productivityScore + 10,
            };
          }
          return {
            ...p,
            focusTimerSecondsLeft: p.focusTimerSecondsLeft - 1
          };
        });
      }, 1000);
    } else if (!profile.isFocusTimerRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [profile.isFocusTimerRunning, setProfile, addActivity]);

  const handleStartTimer = (label: string, minutes: number) => {
    setProfile(p => ({
      ...p,
      isFocusTimerRunning: true,
      focusTimerLabel: label,
      focusTimerTotalSeconds: minutes * 60,
      focusTimerSecondsLeft: minutes * 60
    }));
    addActivity(`Engaged Focus Mode: ${label} for ${minutes} minutes.`);
  };

  const handleToggleTimer = () => {
    setProfile(p => ({
      ...p,
      isFocusTimerRunning: !p.isFocusTimerRunning
    }));
    addActivity(profile.isFocusTimerRunning ? "Suspended active focus timer" : "Resumed active focus timer");
  };

  const handleResetTimer = () => {
    setProfile(p => ({
      ...p,
      isFocusTimerRunning: false,
      focusTimerSecondsLeft: p.focusTimerTotalSeconds
    }));
    addActivity("Calibrated focus timer parameters to initial coordinates");
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBlock: ScheduleBlock = {
      id: "block_" + Math.random().toString(36).substr(2, 9),
      title: newTitle,
      startTime: newStart,
      endTime: newEnd,
      category: newCategory,
      notes: newNotes || undefined
    };

    setSchedule(prev => [...prev].sort((a,b) => a.startTime.localeCompare(b.startTime)));
    setSchedule(prev => [...prev, newBlock].sort((a,b) => a.startTime.localeCompare(b.startTime)));

    addActivity(`Compiled operational schedule block: ${newTitle}`);
    setNewTitle("");
    setNewNotes("");
  };

  const handleDeleteBlock = (id: string, name: string) => {
    setSchedule(p => p.filter(b => b.id !== id));
    addActivity(`Purged schedule block: ${name}`);
  };

  // Convert minutes left to standard display
  const mins = Math.floor(profile.focusTimerSecondsLeft / 60);
  const secs = profile.focusTimerSecondsLeft % 60;
  const displayTimer = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const currentActiveTime = new Date().toTimeString().slice(0, 5); // eg "14:35"

  // Check if current system time overlaps with a time-block
  const isBlockActive = (start: string, end: string) => {
    return currentActiveTime >= start && currentActiveTime <= end;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "work": return "border-red-500 text-red-400 bg-red-950/20";
      case "learning": return "border-cyan-400 text-cyan-400 bg-cyan-950/20";
      case "youtube": return "border-purple-500 text-purple-400 bg-purple-950/20";
      case "discipline": return "border-emerald-400 text-emerald-400 bg-emerald-950/20";
      default: return "border-slate-500 text-slate-300 bg-slate-900/60";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-time-scheduler-root">
      
      {/* Tab Switcher */}
      <div className="lg:col-span-12 flex gap-2 border-b border-slate-900 pb-3">
        {(["day", "weekly", "focus"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); addActivity(`Calibrated scheduler viewport: ${tab.toUpperCase()}`); }}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-widest rounded-lg transition-all duration-300 border uppercase ${
              activeTab === tab 
                ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.30)]" 
                : "text-slate-400 hover:text-white bg-slate-950/40 border-slate-900"
            }`}
          >
            {tab === 'day' ? 'DAILY TIMELINE' : tab === 'weekly' ? 'ROUTINE CONSOLIDATOR' : 'FOCUS CORE (POMODORO)'}
          </button>
        ))}
      </div>

      {activeTab === "day" && (
        <>
          {/* Main Timeline Stream (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between mb-4 border-b border-slate-950 pb-3">
                <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> LIVE CHRONOGRAM DIRECTIVES
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">SYS_TIME: {currentActiveTime}</span>
              </div>

              {schedule.length === 0 ? (
                <div className="text-center py-12 text-slate-600 font-mono text-xs uppercase tracking-widest italic">
                  NO TIMELINE RESERVATIONS REGISTERED. DEFINE A WORK BLOCK Sir.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-900">
                  {schedule.map(block => {
                    const active = isBlockActive(block.startTime, block.endTime);
                    return (
                      <div 
                        key={block.id}
                        className={`pl-8 relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                          active 
                            ? "border-cyan-400/90 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,229,255,0.15)] animate-pulse" 
                            : "border-slate-900 hover:border-slate-800 bg-slate-950/30"
                        }`}
                      >
                        {/* Dot indicator on timeline thread */}
                        <div className={`absolute left-[9px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border ${
                          active ? "bg-cyan-400 border-white shadow-[0_0_8px_#00e5ff]" : "bg-slate-900 border-slate-800"
                        }`} />

                        <div className="min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              [{block.startTime} - {block.endTime}]
                            </span>
                            <span className={`text-[8.5px] uppercase font-mono px-1.5 py-0.25 rounded border font-semibold ${getCategoryColor(block.category)}`}>
                              {block.category}
                            </span>
                            {active && <span className="text-[8px] tracking-widest font-mono text-cyan-400 font-bold bg-cyan-950 px-1 py-0.25 rounded animate-pulse">[ ACTIVE ]</span>}
                          </div>
                          <h4 className="text-sm font-semibold tracking-wide text-slate-200 mt-1">{block.title}</h4>
                          {block.notes && <p className="text-[11px] font-mono text-slate-500 mt-1">{block.notes}</p>}
                        </div>

                        <button 
                          onClick={() => handleDeleteBlock(block.id, block.title)}
                          className="text-slate-600 hover:text-red-400 p-1.5 rounded hover:bg-slate-950/90 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* New Time Block Scheduler Setup (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
              <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-1">
                <Plus className="w-4 h-4 text-cyan-400" /> GRAPH NEW TIMELINE NODE
              </h3>

              <form onSubmit={handleAddBlock} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase">TITLE DIRECTIVE</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Video Edit Color Grading Exercises"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">START TIME</label>
                    <input 
                      type="time"
                      required
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">END TIME</label>
                    <input 
                      type="time"
                      required
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase">MATRIX CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="work">DEEP WORK BLOCK</option>
                    <option value="learning">VIDEO EDITING / ACADEMIC</option>
                    <option value="youtube">YOUTUBE CONTENT CALENDAR</option>
                    <option value="discipline">DISCIPLINE ROUTINE</option>
                    <option value="personal">PERSONAL ENERGY MATRIX</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase">OPERATING GUIDELINE NOTES</label>
                  <textarea 
                    rows={2}
                    placeholder="Provide detailed strategy specifications..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-cyan-950/30 hover:bg-cyan-500 hover:text-slate-950 font-mono font-bold text-xs py-2.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
                >
                  GRAPH TIMEBLOCK LOCK
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {activeTab === "weekly" && (
        <div className="lg:col-span-12 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" /> DEEP DISCIPLINARY RUTINE BUFFER
            </h3>
            <span className="text-[10px] font-mono text-slate-500">WEEKLY ROUTINE GRID</span>
          </div>

          <p className="text-xs font-mono text-slate-400 leading-relaxed max-w-2xl mb-6">
            Sir, consistency is mapped week-over-week. Below is your primary auto-recurring discipline architecture. 
            Calibrate learning video editing and YouTube brainstorm sessions to stay highly coordinated.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, idx) => (
              <div key={day} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/65 flex flex-col justify-between hover:border-cyan-500/20 transition-all">
                <span className="block text-xs font-mono font-bold text-cyan-400 tracking-widest mb-3">{day}</span>
                
                <div className="space-y-2 text-[10px] font-mono text-left">
                  <div className="bg-cyan-950/30 p-1 rounded border border-cyan-500/10 text-cyan-300">
                    <span className="block font-bold">09:00 - 11:00</span>
                    <span>Edit Mastery</span>
                  </div>
                  <div className="bg-purple-950/40 p-1 rounded border border-purple-500/10 text-purple-300">
                    <span className="block font-bold">14:00 - 16:00</span>
                    <span>YT Creator loop</span>
                  </div>
                  <div className="bg-emerald-950/30 p-1 rounded border border-emerald-500/10 text-emerald-300">
                    <span className="block font-bold">23:00 - 06:30</span>
                    <span>Sleep Grid</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800 text-[9px] font-mono text-slate-500">
                  NOMINAL CONSTRAINTS
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "focus" && (
        <div className="lg:col-span-12 bg-slate-950/60 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,e5,ff,0.06)] flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md space-y-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                [ FOCUS MATRIX: E-CHAMBER ]
              </span>
              <p className="text-slate-400 font-mono text-xs mt-3 uppercase tracking-wider">CURRENT FOCUS TARGET</p>
              <h2 className="text-xl font-bold tracking-wide text-white mt-1 uppercase font-mono">
                {profile.focusTimerLabel || "RESTING MODE PROTOCOLS_"}
              </h2>
            </div>

            {/* Glowing Digital Dial Countdown */}
            <div className="my-8 relative inline-flex items-center justify-center p-8 bg-slate-900 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] w-48 h-48 select-none">
              <span className="text-4xl font-extrabold font-mono text-cyan-400 tracking-wider text-glow animate-pulse">
                {displayTimer}
              </span>
              
              <Hourglass className="absolute top-4 text-slate-800 w-5 h-5 animate-spin-slow" />
            </div>

            {/* Active System Buttons */}
            <div className="flex justify-center space-x-3">
              {profile.focusTimerSecondsLeft > 0 ? (
                <>
                  <button 
                    onClick={handleToggleTimer}
                    className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,229,255,0.35)] cursor-pointer"
                  >
                    {profile.isFocusTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{profile.isFocusTimerRunning ? "PAUSE FEED" : "ENGAGE"}</span>
                  </button>
                  <button 
                    onClick={handleResetTimer}
                    className="flex items-center space-x-1 border border-slate-800 text-slate-400 hover:text-white font-mono font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>RESET</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => handleStartTimer("Learn Video Editing Routine", 45)}
                    className="bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 font-mono text-xs px-3 py-2 rounded-lg hover:border-indigo-400 transition-colors cursor-pointer"
                  >
                    Engage: editing suite (45m)
                  </button>
                  <button 
                    onClick={() => handleStartTimer("YouTube Scripting & Outlines", 30)}
                    className="bg-purple-950/40 text-purple-300 border border-purple-500/30 font-mono text-xs px-3 py-2 rounded-lg hover:border-purple-400 transition-colors cursor-pointer"
                  >
                    Engage: content scripting (30m)
                  </button>
                  <button 
                    onClick={() => handleStartTimer("Daily Micro Sprint Focus", 15)}
                    className="bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-mono text-xs px-3 py-2 rounded-lg hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    Micro Punctuality sprint (15m)
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] font-mono text-slate-500 leading-relaxed max-w-sm mx-auto uppercase">
              Completing deep focus grids rewards +150 XP. Ensure distraction algorithms are purged before launch, Shafikul.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
