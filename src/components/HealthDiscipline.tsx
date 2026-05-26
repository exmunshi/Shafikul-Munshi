import React, { useState } from "react";
import { 
  Heart, Droplet, Eye, ShieldAlert, Sparkles, Smile, Frown, Meh, Laugh,
  Timer, Flame, Compass, HelpCircle, RefreshCw, Smartphone, CheckSquare, Square
} from "lucide-react";
import { UserOSProfile } from "../types";

interface HealthDisciplineProps {
  profile: UserOSProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserOSProfile>>;
  addActivity: (desc: string) => void;
  onTriggerAssistant: (prompt: string) => void;
}

const HABITS_LIBRARY = [
  { id: "hab_1", text: "Practice DaVinci / Premiere cut edits for 45 mins", streak: 4 },
  { id: "hab_2", text: "Maintain hard screen blackout 30 mins before sleeping", streak: 3 },
  { id: "hab_3", text: "Consume at least 2.5L clean H2O", streak: 12 },
  { id: "hab_4", text: "Write 1 YouTube script hook outline segment", streak: 1 }
];

export default function HealthDiscipline({
  profile,
  setProfile,
  addActivity,
  onTriggerAssistant,
}: HealthDisciplineProps) {
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [detoxModal, setDetoxModal] = useState(false);
  const [habits, setHabits] = useState(HABITS_LIBRARY);
  
  // Local water increment loggers
  const addWater = (amount: number) => {
    setProfile(p => {
      const nextW = Math.min(p.waterTarget, p.waterIntake + amount);
      addActivity(`Logged water hydration input: +${amount}ml. Current capacity: ${nextW}ml`);
      
      // Award minor XP as discipline training
      let nextXp = p.xp + 15;
      let nextLvl = p.level;
      if (nextXp >= 1000) {
        nextXp -= 1000;
        nextLvl += 1;
        addActivity(`UPGRADE: Hydration compliance raised Operator to Tier ${nextLvl}!`);
      }

      return {
        ...p,
        waterIntake: nextW,
        xp: nextXp,
        level: nextLvl
      };
    });
  };

  const toggleDopamineDetox = () => {
    setProfile(p => {
      const nextDetox = !p.dopamineDetox;
      addActivity(nextDetox ? "DOPAMINE DETOX protocol active. Core goals isolated." : "Dopamine Detox suspended. Normal network adapters restoring.");
      return {
        ...p,
        dopamineDetox: nextDetox
      };
    });
  };

  const handleToggleHabit = (id: string, name: string) => {
    setHabits(p => p.map(hab => {
      if (hab.id === id) {
        addActivity(`Validated habits matrix item: ${name}`);
        return { ...hab, streak: hab.streak + 1 };
      }
      return hab;
    }));
  };

  const triggerEyeRestCall = () => {
    setProfile(p => ({ ...p, eyeRestInterval: 20 }));
    addActivity("Calibrated ocular muscles with eye-rest blink exercises");
    alert("Ocular calibration complete. 20-minute focus window is operational.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-health-discipline-root">
      
      {/* Physiology ledger - Water, Mood and Eye-rest (7 cols) */}
      <div className="lg:col-span-7 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500 animate-pulse" /> BIO-LOGISTIC FOCUS REGISTRY
            </h3>
            <span className="text-[10px] font-mono text-slate-500">HOMEOSTASIS CRITERIA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Water ledger block */}
            <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl relative overflow-hidden">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" /> HYDRATION CONTROL
              </span>
              
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold font-mono text-white">{profile.waterIntake} ml</span>
                <span className="text-[10px] font-mono text-slate-500">TARGET: {profile.waterTarget} ml</span>
              </div>

              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (profile.waterIntake / profile.waterTarget) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => addWater(250)}
                  className="bg-cyan-950/40 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 py-1.5 rounded-lg text-[10px] font-mono transition-colors cursor-pointer"
                >
                  +250ml FLUID
                </button>
                <button 
                  onClick={() => addWater(500)}
                  className="bg-indigo-950/40 hover:bg-indigo-500 hover:text-slate-950 text-indigo-400 border border-indigo-500/20 py-1.5 rounded-lg text-[10px] font-mono transition-colors cursor-pointer"
                >
                  +500ml HYDRA
                </button>
              </div>
            </div>

            {/* Mood selection box */}
            <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3.5">OPERATOR MOOD CELL</span>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { id: "laugh", label: "PUMPED", icon: <Laugh className="w-5 h-5 text-emerald-400" /> },
                  { id: "smile", label: "OPTIMAL", icon: <Smile className="w-5 h-5 text-cyan-400" /> },
                  { id: "neutral", label: "BLOCKED", icon: <Meh className="w-5 h-5 text-slate-400" /> },
                  { id: "frown", label: "DRAG", icon: <Frown className="w-5 h-5 text-red-400" /> },
                ].map(mood => {
                  const active = mood.id === selectedMood;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => { setSelectedMood(mood.id); addActivity(`Calibrated Operators mood context: ${mood.label}`); }}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        active 
                          ? "border-cyan-500/40 bg-slate-950 shadow-[0_0_8px_rgba(0,229,255,0.06)]" 
                          : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {mood.icon}
                      <span className="text-[8px] font-mono text-slate-400">{mood.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3.5 text-center">
                <button 
                  onClick={() => onTriggerAssistant(`I am feeling in a "${selectedMood}" state today during active video editing workflow, Jarvis. Give me high focus advice.`)}
                  className="text-[9.5px] font-mono text-cyan-400 hover:underline hover:text-cyan-300"
                >
                  CONVERSE EMOTIONAL COEFFICIENT WITH JARVIS
                </button>
              </div>
            </div>
          </div>

          {/* Ocular rest reminders */}
          <div className="bg-slate-900/30 p-4.5 rounded-xl border border-slate-850 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/25 flex items-center justify-center text-emerald-400 animate-pulse">
                <Eye className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase">OCULAR INTERVAL TRACKER</span>
                <span className="text-xs font-bold text-slate-200">20-20-20 Blink rule calibration</span>
              </div>
            </div>

            <button 
              onClick={triggerEyeRestCall}
              className="bg-emerald-950/40 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
            >
              EXECUTE EYE REFRACT_
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-900 pt-3 text-[10px] font-mono text-slate-500 flex justify-between">
          <span className="flex items-center gap-1"><Smartphone className="w-4 h-4 text-cyan-400" /> SCREEN MONITOR RUNNING</span>
          <span>SCREEN_TIME: {profile.screenTimeMinutes} MINS TODAY</span>
        </div>
      </div>

      {/* Habits Streaks and extreme Dopamine Detox Switch (5 cols) */}
      <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
            <Flame className="w-4 h-4 text-yellow-400 animate-pulse" /> BIO-DISCIPLINE REPEAT LABS
          </span>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {habits.map(hab => (
              <div key={hab.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <span className="block text-[11px] text-slate-200 font-medium leading-normal">{hab.text}</span>
                  <span className="text-[9px] font-mono text-yellow-400 font-bold flex items-center gap-1 mt-1">
                    <Flame className="w-3 h-3 fill-yellow-450" /> {hab.streak} DAYS SUCCESS
                  </span>
                </div>

                <button 
                  onClick={() => handleToggleHabit(hab.id, hab.text)}
                  className="bg-slate-950 p-1.5 rounded border border-slate-900 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/20 transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Extreme Dopamine Detox Isolation Panel */}
        <div className="mt-6 border-t border-slate-900 pt-4">
          <div className={`p-4 rounded-xl border transition-all ${
            profile.dopamineDetox 
              ? "border-red-500/70 bg-red-950/15 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse" 
              : "border-slate-850 bg-slate-900/40"
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <ShieldAlert className={`w-5 h-5 ${profile.dopamineDetox ? 'text-red-400' : 'text-slate-500'}`} />
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${profile.dopamineDetox ? 'text-red-400 text-glow' : 'text-slate-400'}`}>
                [ DOPAMINE DETOX ISOLATION ]
              </span>
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide leading-relaxed mb-3">
              Activating detox mode isolates the operating engine. Social, games, and telemetry feeds blackout. Only editing mastery and scheduler remains visible.
            </p>

            <button 
              type="button"
              onClick={toggleDopamineDetox}
              className={`w-full font-mono text-xs font-bold py-2 rounded-lg border transition-all cursor-pointer ${
                profile.dopamineDetox 
                  ? "bg-red-950 hover:bg-slate-950 text-red-400 border-red-500/40" 
                  : "bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800"
              }`}
            >
              {profile.dopamineDetox ? "ABORT DETOX INTERPOLATOR" : "ENGAGE EXTREME ISOLATION CYCLE"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
