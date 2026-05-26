import React, { useState } from "react";
import { 
  Award, TrendingUp, Compass, Plus, BookOpen, Flame, Zap, 
  CheckCircle, ArrowUpCircle, CheckSquare, Square, RefreshCcw, Star 
} from "lucide-react";
import { LearningSkill, UserOSProfile } from "../types";

interface LearningTrackerProps {
  skills: LearningSkill[];
  setSkills: React.Dispatch<React.SetStateAction<LearningSkill[]>>;
  profile: UserOSProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserOSProfile>>;
  addActivity: (desc: string) => void;
  onTriggerAssistant: (prompt: string) => void;
}

const BADGES_LIBRARY = [
  { id: "badge_1", title: "Cutter Initiate", desc: "First 45-minute video editing practice block executed", icon: "🎬", unlockedAtXP: 300 },
  { id: "badge_2", title: "Tube Blueprint", desc: "Successfully diagrammed 2 video scripts in Creator Studio", icon: "📺", unlockedAtXP: 600 },
  { id: "badge_3", title: "Chronos Sentinel", desc: "Perfect daily punctuality indices logged 3 days sequentially", icon: "⏰", unlockedAtXP: 1000 },
  { id: "badge_4", title: "Neural Overlord", desc: "Achieved global system operation Tier 5 under Jarvis mentoring", icon: "🧠", unlockedAtXP: 2500 }
];

export default function LearningTracker({
  skills,
  setSkills,
  profile,
  setProfile,
  addActivity,
  onTriggerAssistant
}: LearningTrackerProps) {
  const [activeSkillId, setActiveSkillId] = useState<string>(skills[0]?.id || "");
  const [newSkillTitle, setNewSkillTitle] = useState("");
  const [studyMinutes, setStudyMinutes] = useState(30);

  const handleStudySkill = (skillId: string, mins: number) => {
    const xpGain = mins * 4; // e.g. 30 mins = 120 XP
    
    setSkills(p => p.map(s => {
      if (s.id === skillId) {
        let nextXp = s.xp + xpGain;
        let nextLevel = s.level;
        let leveledUp = false;

        if (nextXp >= s.xpNeeded) {
          nextXp -= s.xpNeeded;
          nextLevel += 1;
          leveledUp = true;
          addActivity(`SKILL UPGRADED: ${s.title} is now level ${nextLevel}, Operator!`);
        }

        return {
          ...s,
          xp: nextXp,
          level: nextLevel,
          streak: s.streak + 1,
          lastMaintained: new Date().toISOString().slice(0, 10)
        };
      }
      return s;
    }));

    addActivity(`Studied "${skills.find(s => s.id === skillId)?.title}" for ${mins} minutes. Accrued +${xpGain} module XP.`);

    // Award global profile XP
    setProfile(p => {
      let gXp = p.xp + xpGain;
      let gLvl = p.level;
      if (gXp >= 1000) {
        gXp -= 1000;
        gLvl += 1;
        addActivity(`CONGRATULATIONS: Global synchronization increased. Level up to Tier ${gLvl}!`);
      }
      return {
        ...p,
        xp: gXp,
        level: gLvl,
        productivityScore: p.productivityScore + Math.floor(mins / 5)
      };
    });
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) return;

    const newSk: LearningSkill = {
      id: "skill_" + Math.random().toString(36).substr(2, 9),
      title: newSkillTitle,
      level: 1,
      xp: 0,
      xpNeeded: 500,
      streak: 0,
      milestones: [
        { text: "Acquire secondary reference materials", completed: false },
        { text: "Implement standard keyframe presets", completed: false }
      ]
    };

    setSkills(p => [...p, newSk]);
    addActivity(`Mapped new learning pathway profile: ${newSkillTitle}`);
    setNewSkillTitle("");
    setActiveSkillId(newSk.id);
  };

  const handleToggleMilestone = (skillId: string, mIndex: number) => {
    setSkills(p => p.map(s => {
      if (s.id === skillId) {
        const nextMilestones = s.milestones.map((m, idx) => {
          if (idx === mIndex) {
            addActivity(`Calibrated skill milestone: ${m.text}`);
            return { ...m, completed: !m.completed };
          }
          return m;
        });
        return { ...s, milestones: nextMilestones };
      }
      return s;
    }));
  };

  const currentSkill = skills.find(s => s.id === activeSkillId) || skills[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-learning-tracker-root">
      
      {/* Skill list panel (4 cols) */}
      <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100">
              LEARNING VECTORS
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">INDEXED PATHS</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
            {skills.map(sk => {
              const active = sk.id === activeSkillId;
              const skillProgress = Math.floor((sk.xp / sk.xpNeeded) * 100);
              return (
                <button
                  key={sk.id}
                  onClick={() => setActiveSkillId(sk.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all duration-300 block ${
                    active 
                      ? "border-emerald-500/50 bg-slate-900 shadow-[0_0_10px_rgba(57,255,136,0.06)]" 
                      : "border-slate-900 bg-slate-950/20 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="font-bold text-slate-200 uppercase tracking-wide">{sk.title}</span>
                    <span className="text-emerald-400 font-bold">Lvl {sk.level}</span>
                  </div>
                  
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between mb-2">
                    <span>STREAK: {sk.streak} DAYS</span>
                    <span>{sk.xp} / {sk.xpNeeded} XP</span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-300"
                      style={{ width: `${skillProgress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Append New skill path */}
        <form onSubmit={handleCreateSkill} className="mt-4 pt-3 border-t border-slate-900 flex gap-2">
          <input 
            type="text"
            required
            placeholder="Introduce new skill loop..."
            value={newSkillTitle}
            onChange={(e) => setNewSkillTitle(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          />
          <button 
            type="submit"
            className="bg-emerald-950/40 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
          >
            ADD
          </button>
        </form>
      </div>

      {/* Selected Skill details module (8 cols) */}
      <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        {currentSkill ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950 mb-5 text-[10px] font-mono">
              <span className="text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-emerald-400" /> MATRIX DETAILS: {currentSkill.title}
              </span>
              <span className="text-slate-500">LAST SYNC: {currentSkill.lastMaintained || "NEVER RECORDED"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detailed Progress Block */}
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] font-mono text-slate-500 uppercase">SYNAPTIC LEVEL</span>
                    <span className="text-3xl font-extrabold font-mono text-white">Tier {currentSkill.level}</span>
                  </div>
                  <div className="bg-emerald-950/30 w-12 h-12 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Star className="w-6 h-6 fill-emerald-400 animate-spin-slow" />
                  </div>
                </div>

                {/* Simulated Study block */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase mb-3">INTEGRATE TRAINING HOURS</span>
                  
                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min="15"
                      max="120"
                      step="15"
                      value={studyMinutes}
                      onChange={(e) => setStudyMinutes(Number(e.target.value))}
                      className="flex-grow h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="text-sm font-mono text-slate-200 font-bold whitespace-nowrap">{studyMinutes} MINS</span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase">WILL HARVEST +{studyMinutes * 4} SKILL XP / +{studyMinutes * 4} GLOBAL XP</p>
                  
                  <button 
                    onClick={() => handleStudySkill(currentSkill.id, studyMinutes)}
                    className="w-full mt-4 bg-emerald-950/30 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-mono font-bold text-xs py-2 rounded-lg border border-emerald-500/20 hover:border-emerald-400 transition-colors cursor-pointer"
                  >
                    RESOLVE MODULE STUDY SPRINT
                  </button>
                </div>
              </div>

              {/* Milestones / To Do Checklist */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">ROADMAP MICRO-DIRECTIVES</span>
                  
                  <div className="space-y-2.5">
                    {currentSkill.milestones.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleToggleMilestone(currentSkill.id, idx)}
                        className={`w-full text-left font-mono text-xs flex items-center gap-2 transition-colors ${m.completed ? 'text-slate-500 line-through' : 'text-slate-200 hover:text-emerald-400'}`}
                      >
                        {m.completed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                        <span>{m.text}</span>
                      </button>
                    ))}
                  </div>

                  {/* Proactively query AI assistant for fresh curriculum advice */}
                  <button 
                    onClick={() => onTriggerAssistant(`Recommend 3 realistic learning milestones and courses to help me level up ${currentSkill.title}`)}
                    className="flex items-center space-x-1 mt-4 text-[10.5px] font-mono text-emerald-400 hover:underline hover:text-emerald-300"
                  >
                    <RefreshCcw className="w-3 h-3 animate-spin-slow" />
                    <span>CURRICULUM ARCHITECTURE ADVICE FROM JARVIS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-600 font-mono text-xs uppercase italic">
            Select a vector.
          </div>
        )}

        {/* Floating Achievements / Badge Case */}
        <div className="mt-8 border-t border-slate-900 pt-5">
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">DEPLOYED DISCIPLINARY ACCOMPLISHMENTS</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BADGES_LIBRARY.map(badge => {
              const isUnlocked = profile.xp + (profile.level - 1) * 1000 >= badge.unlockedAtXP;
              return (
                <div 
                  key={badge.id}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isUnlocked 
                      ? "border-emerald-500/25 bg-emerald-950/5 shadow-[0_0_12px_rgba(57,255,136,0.04)]" 
                      : "border-slate-900/60 bg-slate-950/20 opacity-40 select-none"
                  }`}
                >
                  <span className="text-3xl block filter saturate-100 mb-1">{isUnlocked ? badge.icon : "🔒"}</span>
                  <span className="block text-[11px] font-bold text-slate-200 truncate">{badge.title}</span>
                  <p className="text-[9px] font-mono text-slate-500 mt-1 line-clamp-2 leading-relaxed">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
