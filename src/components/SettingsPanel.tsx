import React, { useState, useEffect } from "react";
import { 
  Settings, User, ShieldCheck, Database, Key, HelpCircle, AlertTriangle, 
  RefreshCw, CheckCircle2, ChevronRight, Sliders, Smartphone, Trash2 
} from "lucide-react";
import { 
  Task, ScheduleBlock, AlarmConfig, SleepLog, 
  LearningSkill, CreatorProject, SecretNote, UserOSProfile 
} from "../types";
import UsbInstaller from "./UsbInstaller";

interface SettingsPanelProps {
  profile: UserOSProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserOSProfile>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  schedule: ScheduleBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
  alarms: AlarmConfig[];
  setAlarms: React.Dispatch<React.SetStateAction<AlarmConfig[]>>;
  sleepLogs: SleepLog[];
  setSleepLogs: React.Dispatch<React.SetStateAction<SleepLog[]>>;
  skills: LearningSkill[];
  setSkills: React.Dispatch<React.SetStateAction<LearningSkill[]>>;
  projects: CreatorProject[];
  setProjects: React.Dispatch<React.SetStateAction<CreatorProject[]>>;
  notes: SecretNote[];
  setNotes: React.Dispatch<React.SetStateAction<SecretNote[]>>;
  addActivity: (desc: string) => void;
}

export default function SettingsPanel({
  profile,
  setProfile,
  tasks,
  setTasks,
  schedule,
  setSchedule,
  alarms,
  setAlarms,
  sleepLogs,
  setSleepLogs,
  skills,
  setSkills,
  projects,
  setProjects,
  notes,
  setNotes,
  addActivity,
}: SettingsPanelProps) {
  const [operatorName, setOperatorName] = useState(profile.name);
  const [waterMls, setWaterMls] = useState(profile.waterTarget);
  const [apiHasKey, setApiHasKey] = useState<boolean | null>(null);
  const [apiEnvironment, setApiEnvironment] = useState("");
  const [apiLatency, setApiLatency] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Check backend server setup on component mount
  const verifyBackendIntegrity = async () => {
    setIsVerifying(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/config-status");
      const data = await res.json();
      setApiHasKey(data.hasGeminiKey);
      setApiEnvironment(data.environment || "sandbox");
      const elapsed = Math.round(performance.now() - start);
      setApiLatency(`${elapsed} ms`);
      addActivity(`Verified Gemini configuration status. API Key status: ${data.hasGeminiKey ? 'DETECTED' : 'NOT FOUND'}`);
    } catch (e) {
      setApiHasKey(false);
      setApiEnvironment("error");
      setApiLatency("network fail");
      addActivity("Failed to sense Node/Express backend configuration status.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    verifyBackendIntegrity();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(p => ({
      ...p,
      name: operatorName,
      waterTarget: waterMls
    }));
    addActivity(`Reconfigured global identity: Operating pseudonym set to "${operatorName}"`);
    alert("GLOBAL PROFILE CALIBRATED SUCCESSFULLY.");
  };

  const forceEmergencyReset = () => {
    if (confirm("WARNING: Are you sure you want to flush all local database states? This cannot be undone.")) {
      localStorage.clear();
      addActivity("EMERGENCY REBOOT: Memory segments flushed. Initiating restart.");
      window.location.reload();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-settings-root">
      
      {/* Identity Configurations (7 cols) */}
      <div className="lg:col-span-12 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg mb-2">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          <h2 className="text-xl font-bold font-mono text-white uppercase tracking-wider">OS CALIBRATION & CONFIGS</h2>
        </div>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
          Calibrate system variables, telemetry nodes, and verify machine endpoints under Jarvis supervision.
        </p>
      </div>

      <div className="lg:col-span-7 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-5">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              <User className="w-4.5 h-4.5 text-cyan-400" /> IDENTITY PROFILE CALIBRATION
            </h3>
            <span className="text-[10px] font-mono text-slate-500">VARIABLE REGISTER</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 uppercase">OPERATOR NICKNAME</label>
              <input 
                type="text"
                required
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 uppercase">TARGET DAILY FLUID WATER LEVEL (ml)</label>
              <input 
                type="number"
                required
                min="1000"
                max="5000"
                value={waterMls}
                onChange={(e) => setWaterMls(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-cyan-950/40 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 py-2 rounded-lg text-xs font-mono transition-all font-bold"
            >
              SAVE GLOBAL ALIGNMENT VARIABLES
            </button>
          </form>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-4 bg-slate-900/10 p-3 rounded-lg border border-slate-850">
          <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> EMERGENCY SYSTEM DIAGNOSIS
          </h4>
          <p className="text-[10px] font-mono text-slate-500 leading-normal mb-3 uppercase">
            Should local browser memories suffer state corruption or telemetry mismatches, you may force a full system flush. Warning: Deletes all local metrics, tasks, and historical logs.
          </p>

          <button 
            onClick={forceEmergencyReset}
            className="flex items-center space-x-1.5 bg-red-950/20 hover:bg-red-500 hover:text-slate-950 text-red-400 border border-red-500/35 px-4 py-2 rounded-lg text-xs font-mono transition-all font-bold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>FLUSH METRIC CACHES & DEPLOY REBOOT</span>
          </button>
        </div>
      </div>

      {/* Cloud Dev & API Status Panel (5 cols) */}
      <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950 mb-5">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1">
              <Key className="w-4 h-4 text-cyan-400" /> API KEY STATUS & DIAGNOSTICS
            </h3>
            <button 
              onClick={verifyBackendIntegrity} 
              disabled={isVerifying}
              className="text-slate-500 hover:text-cyan-400"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <p className="text-[10.5px] font-mono text-slate-400 leading-relaxed uppercase mb-4">
            This operating system bridges a backend service connecting securely to official Google GenAI endpoints. 
            To access live AI assistant outputs, your key can be found/configured in the platform's **Settings &gt; Secrets** panel.
          </p>

          <div className="space-y-2.5">
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono text-slate-500">GEMINI_API_KEY ENVELOPE</span>
                <span className="text-xs font-bold text-slate-200">
                  {apiHasKey === null ? "SENSING..." : apiHasKey ? "CONFIGURED WORKSPACE" : "RUNNING simulated FALLBACK"}
                </span>
              </div>
              <div className={`p-1 rounded font-mono text-[9px] font-bold border capitalize ${
                apiHasKey === null ? 'bg-slate-900 text-slate-500 border-slate-800' :
                apiHasKey ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20' : 'bg-yellow-950 text-yellow-400 border-yellow-500/20'
              }`}>
                {apiHasKey === null ? "pending" : apiHasKey ? "secured" : "fallback fallback"}
              </div>
            </div>

            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">ENV_MODE:</span>
              <span className="text-slate-200 uppercase font-bold">{apiEnvironment || "DEVELOPMENT"}</span>
            </div>

            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">API_LATENCY:</span>
              <span className="text-cyan-400 font-bold">{apiLatency || "0 ms"}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-900 pt-3">
          <p className="text-[9.5px] font-mono text-slate-500 uppercase leading-relaxed text-center">
            You do NOT need to input values inside the UI. The environment loads variables automatically from the hosting engine.
          </p>
        </div>
      </div>

      <div className="lg:col-span-12">
        <UsbInstaller 
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
      </div>

    </div>
  );
}
