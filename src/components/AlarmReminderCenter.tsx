import React, { useState, useEffect } from "react";
import { 
  Bell, Volume2, Plus, Clock, ToggleLeft, ToggleRight, Trash2, 
  Sparkles, CheckSquare, MessageSquare, Play, AlertOctagon, HelpCircle 
} from "lucide-react";
import { AlarmConfig } from "../types";

interface AlarmReminderCenterProps {
  alarms: AlarmConfig[];
  setAlarms: React.Dispatch<React.SetStateAction<AlarmConfig[]>>;
  addActivity: (desc: string) => void;
}

export default function AlarmReminderCenter({
  alarms,
  setAlarms,
  addActivity,
}: AlarmReminderCenterProps) {
  const [newTime, setNewTime] = useState("06:30");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"wake" | "focus" | "sleep" | "rest">("wake");
  const [synthesizeVoice, setSynthesizeVoice] = useState(true);

  // Trigger audio beeper simulation
  const playCyberBeep = (freq = 600, duration = 0.4) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or not supported on this client loop.");
    }
  };

  // Test Voice speech synthesizer
  const speakSynthesis = (text: string) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      synth.cancel(); // Stop playing queue
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
      
      // Look for a futuristic or robotic standard English voice if found
      const voices = synth.getVoices();
      const googleVoice = voices.find(v => v.name.includes("Google US English") || v.lang.includes("en-US"));
      if (googleVoice) {
        utterance.voice = googleVoice;
      }
      
      synth.speak(utterance);
      addActivity(`Dispatched Audio Voice Matrix: "${text}"`);
    } else {
      addActivity(`Speech Synthesis failed. Text template: ${text}`);
    }
  };

  // Check and trigger active alarms
  useEffect(() => {
    const alarmInterval = setInterval(() => {
      const checkTime = new Date().toTimeString().slice(0, 5); // "HH:MM"
      
      alarms.forEach(al => {
        if (al.enabled && al.time === checkTime) {
          // Play buzzer!
          playCyberBeep(750, 1.2);
          
          if (al.voiceSynthesis) {
            speakSynthesis(`Operator Shafikul. Your ${al.label} alarm is currently active. Align your discipline constraints.`);
          }
          
          // Request desktop notify
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Shafikul OS: ${al.label} Alarm`, {
              body: `Execution timeline reached: ${al.time}. Stay punctual.`,
              icon: "/favicon.ico"
            });
          }

          addActivity(`TRIGGERED ALARM BUFFER: ${al.label} at ${al.time}`);
        }
      });
    }, 60000); // Check once per minute

    // Ask permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => clearInterval(alarmInterval);
  }, [alarms]);

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newAl: AlarmConfig = {
      id: "alarm_" + Math.random().toString(36).substr(2, 9),
      time: newTime,
      label: newLabel,
      enabled: true,
      voiceSynthesis: synthesizeVoice,
      type: newType,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    };

    setAlarms(p => [...p, newAl].sort((a,b) => a.time.localeCompare(b.time)));
    addActivity(`Engaged alarm interceptor: ${newLabel} set to ${newTime}`);
    setNewLabel("");
  };

  const toggleAlarmState = (id: string) => {
    setAlarms(p => p.map(al => {
      if (al.id === id) {
        addActivity(`Toggled alarm feed status: ${al.label} -> ${!al.enabled ? 'ENGAGED' : 'PURGED'}`);
        return { ...al, enabled: !al.enabled };
      }
      return al;
    }));
  };

  const deleteAlarm = (id: string, name: string) => {
    setAlarms(p => p.filter(al => al.id !== id));
    addActivity(`Deassociated alarm loop: ${name}`);
  };

  const handleManualTest = (al: AlarmConfig) => {
    playCyberBeep(al.type === 'wake' ? 900 : 500, 0.8);
    speakSynthesis(`Initializing simulation, Sir. Test parameters verified for: ${al.label}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-alarm-reminder-root">
      
      {/* Alarms Index (7 cols) */}
      <div className="lg:col-span-7 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              <Bell className="w-4.5 h-4.5 text-cyan-400 animate-pulse" /> TARGET SENSORY ALARMS & REMINDERS
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">TELEMETRY LOOPS APPROVED</span>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {alarms.length === 0 ? (
              <div className="text-center py-12 text-slate-700 font-mono text-xs uppercase tracking-widest italic">
                NO ACTIVE SENSORY BUZZERS CONFIGURED. SET A WAKE-UP INTERCEPT Sir.
              </div>
            ) : (
              alarms.map(alarm => (
                <div 
                  key={alarm.id} 
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    alarm.enabled 
                      ? "border-cyan-500/30 bg-slate-900/60 shadow-[0_0_12px_rgba(0,229,255,0.04)]" 
                      : "border-slate-900 bg-slate-950/20 opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleAlarmState(alarm.id)}
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {alarm.enabled ? (
                        <ToggleRight className="w-8 h-8 text-cyan-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-600" />
                      )}
                    </button>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-mono tracking-tight text-white">{alarm.time}</span>
                        <span className={`text-[8px] uppercase font-mono px-1 rounded border font-semibold ${
                          alarm.type === 'wake' ? 'text-red-400 border-red-500/30 bg-red-950/30' :
                          alarm.type === 'focus' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30' :
                          alarm.type === 'sleep' ? 'text-purple-400 border-purple-500/30 bg-purple-950/30' : 'text-slate-400 border-slate-500/30'
                        }`}>
                          {alarm.type}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">{alarm.label}</p>
                      {alarm.voiceSynthesis && (
                        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3" /> Voice Synth Engaged (JARVIS)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleManualTest(alarm)}
                      className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 bg-slate-950 p-1.5 rounded border border-slate-900 hover:border-cyan-500/20 flex items-center space-x-1"
                      title="Test Sensory Simulation"
                    >
                      <Play className="w-3 h-3" />
                      <span>SIMULATE</span>
                    </button>

                    <button 
                      onClick={() => deleteAlarm(alarm.id, alarm.label)}
                      className="text-slate-600 hover:text-red-400 p-2 rounded hover:bg-slate-950/80 transition-colors"
                      title="Decommission Loop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2 border-t border-slate-900 pt-3 text-[10px] font-mono text-slate-400">
          <AlertOctagon className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>ALARM INTERCEPT SYSTEM SENSING WEB_AUDIO ACCURACY</span>
        </div>
      </div>

      {/* New Alarm Compiler (5 cols) */}
      <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
        <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-1">
          <Plus className="w-4.5 h-4.5 text-cyan-400" /> GRAPH NEW BUZZER INTERCEPT
        </h3>

        <form onSubmit={handleAddAlarm} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">CHRONOGRAM TIME</label>
            <input 
              type="time"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2.5 text-base font-bold font-mono text-cyan-400 tracking-widest focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">INTERCEPT LABEL / DIRECTIVE</label>
            <input 
              type="text"
              required
              placeholder="e.g. Mandatory Wake Up - Premiere Pro Practice"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-500 uppercase">ALARM SECTOR CLASSIFICATION</label>
            <select
              value={newType}
              onChange={(e: any) => setNewType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="wake">WAKE UP (CRITICAL OVERRIDE)</option>
              <option value="focus">FOCUSED LEARNING ALARM</option>
              <option value="sleep">REST RECHARGING SIGNATURE</option>
              <option value="rest">EYE-REST BREAK CALIBRATOR</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-slate-850">
            <div>
              <span className="block text-xs font-bold text-slate-200">JARVIS Voice Synthesize</span>
              <span className="text-[10px] font-mono text-slate-500">Read alarm directive using Speech Synthesis</span>
            </div>
            <button 
              type="button"
              onClick={() => {
                setSynthesizeVoice(!synthesizeVoice);
                playCyberBeep(440, 0.2);
              }}
              className={`p-1 rounded font-mono text-[10px] font-bold border transition-colors ${synthesizeVoice ? 'bg-cyan-950 text-cyan-400 border-cyan-500/20' : 'bg-slate-950 text-slate-600 border-slate-900'}`}
            >
              {synthesizeVoice ? "ACTIVE" : "OFFLINE"}
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-950/30 hover:bg-cyan-500 hover:text-slate-950 font-mono font-bold text-xs py-2.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_12px_rgba(0,229,255,0.1)]"
          >
            COMPILE SENSORY BUZZER
          </button>
        </form>
      </div>

    </div>
  );
}
