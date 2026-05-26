import React, { useState, useEffect } from "react";
import { 
  Shield, Zap, Award, Flame, User, Sun, RefreshCw, CheckCircle, Clock, 
  Volume2, AlertCircle, LayoutDashboard, CheckSquare, Calendar, Bell, 
  Moon, BookOpen, Film, FileText, Heart, BarChart2, Settings, MessageSquare, 
  Sparkles, X, ChevronRight, Send, Loader2, KeyRound 
} from "lucide-react";

// Component imports
import AIDashboard from "./components/AIDashboard";
import SmartTaskManager from "./components/SmartTaskManager";
import AdvancedTimeScheduler from "./components/AdvancedTimeScheduler";
import AlarmReminderCenter from "./components/AlarmReminderCenter";
import SleepTracker from "./components/SleepTracker";
import LearningTracker from "./components/LearningTracker";
import YouTubeCreatorStudio from "./components/YouTubeCreatorStudio";
import PersonalNotesVault from "./components/PersonalNotesVault";
import ProductivityAnalytics from "./components/ProductivityAnalytics";
import HealthDiscipline from "./components/HealthDiscipline";
import SettingsPanel from "./components/SettingsPanel";

import { 
  Task, ScheduleBlock, AlarmConfig, SleepLog, 
  LearningSkill, CreatorProject, SecretNote, UserOSProfile 
} from "./types";

// Dynamic hydration initial default seeds
const INITIAL_PROFILE: UserOSProfile = {
  name: "Shafikul",
  level: 1,
  xp: 120,
  productivityScore: 180,
  dailyStreak: 5,
  waterIntake: 750,
  waterTarget: 2500,
  eyeRestInterval: 20,
  screenTimeMinutes: 310,
  dopamineDetox: false,
  isFocusTimerRunning: false,
  focusTimerTotalSeconds: 1500,
  focusTimerSecondsLeft: 1500,
  focusTimerLabel: "Learn Video Editing Routine"
};

const INITIAL_TASKS: Task[] = [
  {
    id: "task_1",
    title: "Master keyframe transitions and basic J-cuts",
    notes: "Watch Premiere cut-pacing educational videos before opening active timelines.",
    priority: "high",
    category: "Video Editing",
    deadline: new Date().toISOString().slice(0, 10),
    completed: false,
    repeat: "none",
    subtasks: [
      { id: "sub_1", text: "Download raw stock footages", completed: true },
      { id: "sub_2", text: "Assemble sound-effect transitions", completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "task_2",
    title: "Draft script hooks for video editing learning series",
    notes: "Enact a high impact introduction hook under 5 seconds duration.",
    priority: "medium",
    category: "YouTube",
    completed: false,
    repeat: "weekly",
    subtasks: [],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_SCHEDULE: ScheduleBlock[] = [
  {
    id: "block_1",
    title: "Wake Up, Hydration and Morning Alignment Walk",
    startTime: "06:30",
    endTime: "08:00",
    category: "discipline"
  },
  {
    id: "block_2",
    title: "Intense Premiere Video Editing Study Grid",
    startTime: "09:00",
    endTime: "11:30",
    category: "learning"
  },
  {
    id: "block_3",
    title: "YouTube Content Design & SEO Tag Mapping",
    startTime: "13:30",
    endTime: "15:30",
    category: "youtube"
  },
  {
    id: "block_4",
    title: "Workout Circuit and Core Strength Training",
    startTime: "19:00",
    endTime: "20:30",
    category: "discipline"
  }
];

const INITIAL_ALARMS: AlarmConfig[] = [
  {
    id: "alarm_1",
    time: "06:30",
    label: "Critical Wake-Up Alarm",
    enabled: true,
    voiceSynthesis: true,
    type: "wake",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  {
    id: "alarm_2",
    time: "09:00",
    label: "Engage Focus Study Timeblock",
    enabled: true,
    voiceSynthesis: true,
    type: "focus",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  }
];

const INITIAL_SLEEP: SleepLog[] = [
  { id: "sleep_1", date: "2026-05-25", sleepTime: "22:50", wakeTime: "06:30", duration: 7.7, quality: 86 },
  { id: "sleep_2", date: "2026-05-24", sleepTime: "23:10", wakeTime: "06:30", duration: 7.3, quality: 78 },
  { id: "sleep_3", date: "2026-05-23", sleepTime: "22:45", wakeTime: "06:30", duration: 7.8, quality: 92 }
];

const INITIAL_SKILLS: LearningSkill[] = [
  {
    id: "skill_1",
    title: "Premiere & DaVinci Mastery",
    level: 2,
    xp: 180,
    xpNeeded: 500,
    streak: 4,
    milestones: [
      { text: "Learn smooth keyframe ramping", completed: true },
      { text: "Study correct lumetri color space presets", completed: false }
    ]
  },
  {
    id: "skill_2",
    title: "YouTube Content Strategist",
    level: 1,
    xp: 90,
    xpNeeded: 500,
    streak: 3,
    milestones: [
      { text: "Understand hook audience metrics", completed: false }
    ]
  }
];

const INITIAL_PROJECTS: CreatorProject[] = [
  {
    id: "project_1",
    title: "Mastering J-cuts in 5 simple minutes",
    niche: "Self-Improvement Tech",
    workflowStage: "scripting",
    thumbnailPlanned: false,
    seoTags: ["#videoediting", "#timeline", "#tutorial"],
    checklist: ["done", "pending", "pending", "pending", "pending"]
  }
];

const INITIAL_NOTES: SecretNote[] = [
  {
    id: "note_1",
    title: "My 6-month Video Editing Roadmaps",
    body: "First month focus entirely on keyboard shortcuts and cut speeds. Avoid complex composite vfx.",
    category: "journal",
    isPasswordLocked: false,
    updatedAt: new Date().toUTCString()
  },
  {
    id: "note_2",
    title: "Secure Backups & Passwords",
    body: "Secret system keycodes: backup_0x22891f. Resolve credential parameters under strict encryption.",
    category: "vault",
    isPasswordLocked: true,
    passwordHash: "1337", // Predefined mock lock keycode
    updatedAt: new Date().toUTCString()
  }
];

export default function App() {
  // Global Persisted states
  const [profile, setProfile] = useState<UserOSProfile>(() => {
    const cached = localStorage.getItem("os_profile");
    return cached ? JSON.parse(cached) : INITIAL_PROFILE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem("os_tasks");
    return cached ? JSON.parse(cached) : INITIAL_TASKS;
  });

  const [schedule, setSchedule] = useState<ScheduleBlock[]>(() => {
    const cached = localStorage.getItem("os_schedule");
    return cached ? JSON.parse(cached) : INITIAL_SCHEDULE;
  });

  const [alarms, setAlarms] = useState<AlarmConfig[]>(() => {
    const cached = localStorage.getItem("os_alarms");
    return cached ? JSON.parse(cached) : INITIAL_ALARMS;
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    const cached = localStorage.getItem("os_sleep");
    return cached ? JSON.parse(cached) : INITIAL_SLEEP;
  });

  const [skills, setSkills] = useState<LearningSkill[]>(() => {
    const cached = localStorage.getItem("os_skills");
    return cached ? JSON.parse(cached) : INITIAL_SKILLS;
  });

  const [projects, setProjects] = useState<CreatorProject[]>(() => {
    const cached = localStorage.getItem("os_projects");
    return cached ? JSON.parse(cached) : INITIAL_PROJECTS;
  });

  const [notes, setNotes] = useState<SecretNote[]>(() => {
    const cached = localStorage.getItem("os_notes");
    return cached ? JSON.parse(cached) : INITIAL_NOTES;
  });

  const [activities, setActivities] = useState<{ id: string; text: string; time: string }[]>(() => {
    const cached = localStorage.getItem("os_activities");
    return cached ? JSON.parse(cached) : [
      { id: "act_1", text: "Shafikul AI OS Initialized. Holograms online.", time: new Date().toTimeString().slice(0, 5) }
    ];
  });

  // Active Screen Selector tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Floating collisional chat HUD state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Greetings, Operator Shafikul. I am Jarvis, your dedicated cybernetic scheduler and creative advisor. Video timeline study and daily discipline protocols are fully verified. How shall I target your constraints today, Sir?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);

  // Sync to local browser storage
  useEffect(() => {
    localStorage.setItem("os_profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("os_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("os_schedule", JSON.stringify(schedule));
  }, [schedule]);
  useEffect(() => {
    localStorage.setItem("os_alarms", JSON.stringify(alarms));
  }, [alarms]);
  useEffect(() => {
    localStorage.setItem("os_sleep", JSON.stringify(sleepLogs));
  }, [sleepLogs]);
  useEffect(() => {
    localStorage.setItem("os_skills", JSON.stringify(skills));
  }, [skills]);
  useEffect(() => {
    localStorage.setItem("os_projects", JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem("os_notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem("os_activities", JSON.stringify(activities));
  }, [activities]);

  // Append new telemetry activity feed
  const addActivity = (desc: string) => {
    const newAct = {
      id: "act_" + Math.random().toString(36).substr(2, 9),
      text: desc,
      time: new Date().toTimeString().slice(0, 5)
    };
    setActivities(p => [newAct, ...p].slice(0, 30));
  };

  // Dispatch live Assistant text fetches
  const handleAssistantSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || userInput;
    if (!promptToSend.trim()) return;

    const updatedMsgs = [...chatMessages, { role: "user" as const, content: promptToSend }];
    setChatMessages(updatedMsgs);
    setUserInput("");
    setIsAILoading(true);
    setIsAssistantOpen(true); // Open the sidebar drawer automatically

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs,
          userData: profile
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "[NEURAL_ALERT] Unrecognized connectivity disturbance. Fallback protocol engaged. Ensure your Gemini API Key is configured. I am ready to resolve offline queries." }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleQuickTriggerAssistant = (promptText: string) => {
    handleAssistantSend(promptText);
  };

  // Navigations sidebar tabs list configuration
  const TAB_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "tasks", label: "Tasks Core", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "scheduler", label: "Scheduler", icon: <Calendar className="w-4 h-4" /> },
    { id: "alarms", label: "Sensory Alarms", icon: <Bell className="w-4 h-4" /> },
    { id: "sleep", label: "Sleep Telemetry", icon: <Moon className="w-4 h-4" /> },
    { id: "learning", label: "Learning Vectors", icon: <BookOpen className="w-4 h-4" /> },
    { id: "creator-studio", label: "Creator Studio", icon: <Film className="w-4 h-4" /> },
    { id: "notes", label: "Notes Vault", icon: <FileText className="w-4 h-4" /> },
    { id: "health-discipline", label: "Health & Discipline", icon: <Heart className="w-4 h-4" /> },
    { id: "analytics", label: "Productivity Stats", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "settings", label: "OS Calibration", icon: <Settings className="w-4 h-4" /> },
  ];

  const filteredTabItems = profile.dopamineDetox 
    ? TAB_ITEMS.filter(it => ["dashboard", "tasks", "scheduler", "health-discipline", "settings"].includes(it.id))
    : TAB_ITEMS;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden antialiased" id="shafikul-glass-dashboard-view">
      
      {/* Immersive Background Space Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/5 filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 filter blur-[120px]" />
      </div>

      {/* Cyber Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-955/90 md:min-h-screen border-b md:border-b-0 md:border-r border-slate-900/90 py-5 px-4 flex flex-col justify-between z-10 sticky top-0 md:h-screen backdrop-blur-xl">
        <div>
          {/* Logo brand */}
          <div className="flex items-center space-x-2 px-2.5 mb-6 group">
            <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-500 via-teal-400 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-extrabold font-mono tracking-widest text-white leading-tight">SHAFIKUL AI</h2>
              <p className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">PERSONAL OS</p>
            </div>
          </div>

          {/* User profile tags */}
          <div className="mb-6 mx-1.5 p-3.5 bg-slate-900/60 rounded-xl border border-slate-850">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">USER_CRED_LEVEL</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xs font-bold text-slate-100 uppercase">Operator {profile.name}</span>
              <span className="text-xs font-extrabold text-cyan-400">Tier {profile.level}</span>
            </div>
          </div>

          {profile.dopamineDetox && (
            <div className="mx-1.5 mb-4 p-3.5 bg-red-950/20 rounded-xl border border-red-500/25 animate-pulse text-center">
              <span className="block text-[9.5px] font-mono text-red-400 font-bold tracking-widest uppercase">
                [ DOPAMINE DETOX ISOLATION ]
              </span>
            </div>
          )}

          {/* Navigation Links list */}
          <nav className="space-y-1">
            {filteredTabItems.map(item => {
              const active = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    addActivity(`Committed navigation channel swap: ${item.label.toUpperCase()}`);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-all duration-300 relative group cursor-pointer ${
                    active 
                      ? "text-cyan-400 bg-cyan-950/20 font-bold border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.03)]" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900/30"
                  }`}
                >
                  {React.cloneElement(item.icon, { 
                    className: `w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-cyan-400' : 'text-slate-500'}` 
                  })}
                  <span>{item.label}</span>
                  
                  {item.id === "tasks" && totalTasks > 0 && (
                    <span className="ml-auto text-[9.5px] bg-slate-900 border border-slate-800 px-1 py-0.25 rounded text-slate-400">
                      {completedTasks}/{totalTasks}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Motivate status line */}
        <div className="mt-8 pt-4 border-t border-slate-900 flex flex-col gap-2">
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="w-full bg-cyan-950/35 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-mono font-bold text-xs py-2 px-3 rounded-lg border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.06)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>SUMMON JARVIS</span>
          </button>
          <span className="text-[9px] font-mono text-center text-slate-600 block">&copy; 2026 SHAFIKUL PERSONAL INTEGRATION</span>
        </div>
      </aside>

      {/* Main Content Workspace viewport */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen relative z-10" id="shafikul-main-content-viewport">
        
        {/* Render View Selection Switcher */}
        {activeTab === "dashboard" && (
          <AIDashboard 
            profile={profile}
            totalTaskCount={totalTasks}
            completedTaskCount={completedTasks}
            addActivity={addActivity}
            activities={activities}
            onTriggerAssistant={handleQuickTriggerAssistant}
          />
        )}

        {activeTab === "tasks" && (
          <SmartTaskManager 
            tasks={tasks}
            setTasks={setTasks}
            addActivity={addActivity}
            onTriggerAssistant={handleQuickTriggerAssistant}
          />
        )}

        {activeTab === "scheduler" && (
          <AdvancedTimeScheduler 
            schedule={schedule}
            setSchedule={setSchedule}
            profile={profile}
            setProfile={setProfile}
            addActivity={addActivity}
          />
        )}

        {activeTab === "alarms" && (
          <AlarmReminderCenter 
            alarms={alarms}
            setAlarms={setAlarms}
            addActivity={addActivity}
          />
        )}

        {activeTab === "sleep" && (
          <SleepTracker 
            sleepLogs={sleepLogs}
            setSleepLogs={setSleepLogs}
            profile={profile}
            setProfile={setProfile}
            addActivity={addActivity}
          />
        )}

        {activeTab === "learning" && (
          <LearningTracker 
            skills={skills}
            setSkills={setSkills}
            profile={profile}
            setProfile={setProfile}
            addActivity={addActivity}
            onTriggerAssistant={handleQuickTriggerAssistant}
          />
        )}

        {activeTab === "creator-studio" && (
          <YouTubeCreatorStudio 
            projects={projects}
            setProjects={setProjects}
            addActivity={addActivity}
            onTriggerAssistant={handleQuickTriggerAssistant}
          />
        )}

        {activeTab === "notes" && (
          <PersonalNotesVault 
            notes={notes}
            setNotes={setNotes}
            addActivity={addActivity}
            onTriggerAssistant={handleQuickTriggerAssistant}
          />
        )}

        {activeTab === "health-discipline" && (
          <HealthDiscipline 
            profile={profile}
            setProfile={setProfile}
            addActivity={addActivity}
            onTriggerAssistant={handleQuickTriggerAssistant}
          />
        )}

        {activeTab === "analytics" && (
          <ProductivityAnalytics 
            profile={profile}
            totalTaskCount={totalTasks}
            completedTaskCount={completedTasks}
            addActivity={addActivity}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPanel 
            profile={profile}
            setProfile={setProfile}
            tasks={tasks}
            setTasks={setTasks}
            schedule={schedule}
            setSchedule={setSchedule}
            alarms={alarms}
            setAlarms={setAlarms}
            sleepLogs={sleepLogs}
            setSleepLogs={setSleepLogs}
            skills={skills}
            setSkills={setSkills}
            projects={projects}
            setProjects={setProjects}
            notes={notes}
            setNotes={setNotes}
            addActivity={addActivity}
          />
        )}

      </main>

      {/* Futuristic Drawer-collapsing JARVIS HUD HUD Chat window (Collapsible sidebar drawer style) */}
      {isAssistantOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-950/95 border-l border-cyan-500/30 z-50 flex flex-col justify-between shadow-[0_0_30px_rgba(0,e5,ff,0.15)] animate-slide-in-right backdrop-blur-2xl">
          
          {/* Header */}
          <div className="bg-slate-900/60 px-5 py-4 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#00e5ff] text-glow">
                JARVIS HUD DIRECTIVES
              </h3>
            </div>
            <button 
              onClick={() => setIsAssistantOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
            {chatMessages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div 
                  key={index}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[9px] font-mono text-slate-500 uppercase mb-1">
                    {isAssistant ? "JARVIS AI SYSTEM" : "OPERATOR SHAFIKUL"}
                  </span>
                  <div className={`p-3.5 rounded-xl text-xs font-mono leading-relaxed max-w-[90%] border ${
                    isAssistant 
                      ? "bg-cyan-950/20 text-cyan-100 border-cyan-500/10 shadow-[0_4px_12px_rgba(0,229,255,0.02)]" 
                      : "bg-slate-900 text-slate-100 border-slate-800"
                  }`}>
                    {msg.content.includes("Welcome") || msg.content.includes("Greetings") ? (
                      msg.content
                    ) : (
                      // Parse double breaks for cute lists
                      msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            {isAILoading && (
              <div className="flex items-start flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase mb-1">JARVIS COGNIZING...</span>
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-850 p-3 rounded-xl">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-400">Resolving matrix pathways...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input control */}
          <div className="p-4 border-t border-cyan-500/20 bg-slate-950">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Coordinate prompt with Jarvis..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAssistantSend()}
                className="flex-grow bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
              <button 
                onClick={() => handleAssistantSend()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-2 rounded-lg flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(0,229,255,0.2)] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                { label: "Check focus", text: "Analyze my deep work parameters and advise me." },
                { label: "Sleep audit", text: "Evaluate my sleep levels and suggest bedtime routines." },
                { label: "Video topic", text: "Propose 3 hyper-lucid YouTube topics for video editing." }
              ].map((pill, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleQuickTriggerAssistant(pill.text)}
                  className="text-[9px] font-mono font-bold bg-cyan-950/20 hover:bg-cyan-900/35 text-cyan-400 border border-cyan-500/10 px-2 py-1 rounded"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Floating summons core cockpit launcher bottom-right */}
      {!isAssistantOpen && (
        <button 
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-950 hover:bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 p-4 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.35)] flex items-center justify-center cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95"
          title="Summon Jarvis AI Assistant Coordinator"
        >
          <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform duration-300 text-cyan-400" />
        </button>
      )}

    </div>
  );
}
