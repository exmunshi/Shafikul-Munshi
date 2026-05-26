import React, { useState, useEffect, useRef } from "react";
import { 
  Usb, HardDrive, Download, Upload, CheckCircle2, AlertTriangle, 
  RefreshCw, Loader2, Play, Terminal, Shield, Cpu, Binary, FileJson 
} from "lucide-react";
import { 
  Task, ScheduleBlock, AlarmConfig, SleepLog, 
  LearningSkill, CreatorProject, SecretNote, UserOSProfile 
} from "../types";

interface UsbInstallerProps {
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

interface SimulatedDevice {
  name: string;
  size: string;
  speed: string;
  status: "idle" | "ready" | "flashing" | "completed" | "error";
  vendorId?: string;
  productId?: string;
}

export default function UsbInstaller({
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
}: UsbInstallerProps) {
  // UI states
  const [isVirtualInserted, setIsVirtualInserted] = useState(false);
  const [activeDevice, setActiveDevice] = useState<SimulatedDevice>({
    name: "Shafikul CyberCore USB (Simulated)",
    size: "64 GB",
    speed: "USB 3.2 Gen2 (10Gbps)",
    status: "idle"
  });
  const [selectedFileSystem, setSelectedFileSystem] = useState<"FAT32" | "EXT4" | "exFAT">("FAT32");
  const [includeSystemLogs, setIncludeSystemLogs] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [flashingState, setFlashingState] = useState<"idle" | "working" | "finished">("idle");
  const [hardwareDevices, setHardwareDevices] = useState<any[]>([]);
  const [hwLog, setHwLog] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Print scrolling terminal outputs
  const writeLog = (text: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleInsertVirtualUsb = () => {
    if (!isVirtualInserted) {
      setIsVirtualInserted(true);
      addActivity("Simulated USB slot loaded: Shafikul CyberCore 64GB inserted.");
      writeLog("USB CONNECTION ESTABLISHED on slot PORT_CYBER_C1.");
      writeLog("DEVICE ID: USB\\VID_0951&PID_1666\\SHAFIKULOS_SYSTEM");
      writeLog("Vendor: CyberCore Technologies Corp.");
      writeLog(`Capacity: ${activeDevice.size} (${activeDevice.speed})`);
      writeLog("STATUS: Valid partition table discovered. Ready for flash partition compilation.");
    } else {
      setIsVirtualInserted(false);
      setProgress(0);
      setFlashingState("idle");
      addActivity("Simulated USB drive ejected.");
      writeLog("SYSTEM METADATA: USB Device severed from viewport.");
    }
  };

  // Compile full system configuration into portable image payload
  const handleFlashUsb = () => {
    if (!isVirtualInserted) {
      alert("PLEASE MOUNT AN ACTIVE VIRTUAL USB TARGET FIRST.");
      return;
    }
    
    setFlashingState("working");
    setProgress(0);
    setLogs([]);
    writeLog("ENGAGING SECURE CYBERNETIC EMBARK PASS...");
    writeLog(`PARTITION METHOD: Compiling target as bootable ${selectedFileSystem} GPT sector.`);
    
    const steps = [
      { p: 10, m: "Initializing Boot blocks / sector alignment validation..." },
      { p: 25, m: "Flushing target partition tables... Directory structures loaded." },
      { p: 40, m: "Compiling Jarvis AI system core assembly & binaries..." },
      { p: 55, m: `Gathering local profile metadata for Operator ${profile.name}...` },
      { p: 70, m: `Packaging memory maps: ${tasks.length} tasks, ${skills.length} vectors, ${notes.length} notes...` },
      { p: 85, m: "Injecting custom UEFI cryptokeys & signing boot sector..." },
      { p: 95, m: "Validating sector integrity parity checks..." },
      { p: 100, m: "OS FLASH COMPLETED SUCCESSFULLY. COMPLYING ARCHIVE DOWNLOAD..." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setProgress(step.p);
        writeLog(step.m);
        currentStep++;
      } else {
        clearInterval(interval);
        setFlashingState("finished");
        addActivity("Successfully compiled bootable USB OS Installation Image.");
        triggerIsoDownload();
      }
    }, 600);
  };

  // Build simulated .iso (JSON file) and download it
  const triggerIsoDownload = () => {
    const backupObj = {
      identifier: "SHAFIKUL_AI_OS_SECURE_BACKUP",
      timestamp: new Date().toISOString(),
      creator: "Shafikul AI OS Web System",
      profile,
      tasks,
      schedule,
      alarms,
      sleepLogs,
      skills,
      projects,
      notes
    };

    // Serialize object
    const serializedData = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([serializedData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `shafikul_ai_os_boot_install_${new Date().toISOString().slice(0, 10)}.iso`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    writeLog("SYSTEM DIRECTIVE: Download payload compiled & transferred to host.");
  };

  // Import Backup of System JSON or ISO
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    writeLog(`Sensing file upload: ${file.name} (${file.size} bytes)`);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawText = event.target?.result as string;
        const backupData = JSON.parse(rawText);

        if (backupData.identifier === "SHAFIKUL_AI_OS_SECURE_BACKUP") {
          // Hydrate profile and variables
          if (backupData.profile) setProfile(backupData.profile);
          if (backupData.tasks) setTasks(backupData.tasks);
          if (backupData.schedule) setSchedule(backupData.schedule);
          if (backupData.alarms) setAlarms(backupData.alarms);
          if (backupData.sleepLogs) setSleepLogs(backupData.sleepLogs);
          if (backupData.skills) setSkills(backupData.skills);
          if (backupData.projects) setProjects(backupData.projects);
          if (backupData.notes) setNotes(backupData.notes);

          writeLog("SUCCESS: Authentic system signature detected! Initializing full machine rollback.");
          writeLog(`HYDRATING: Restored profile for Operator "${backupData.profile.name || "Unknown"}"`);
          addActivity(`Executed full OS system install and restore via USB. operator: ${backupData.profile.name || "Default"}`);
          alert("USB OS RESTORE AND SYSTEM INSTALL DETECTED! ALL DATA SHARDS SUCCESSFULLY REALIGNED.");
        } else {
          writeLog("ERROR: Invalid header signature. Decrypting block sector failed.");
          alert("VERIFICATION FAILURE: The provided file does not match a valid Shafikul AI OS backup signature.");
        }
      } catch (err) {
        writeLog("CRITICAL ERROR: Failed to parse raw ISO payload. File may be corrupted.");
        alert("CRITICAL CORRUPTION: The uploaded system image could not be loaded into the buffer.");
      }
    };
    reader.readAsText(file);
  };

  // Real physical WebUSB scanning
  const handleWebUsbScan = async () => {
    setHwLog("Requesting physical USB Controller credentials...");
    if (!("usb" in navigator)) {
      setHwLog("ERROR: WebUSB API is not supported by your browser software environment.");
      return;
    }

    try {
      // Prompt user to pick physical device
      const device = await (navigator as any).usb.requestDevice({ filters: [] });
      setHwLog(`CONNECTED DEVICE:\nName: ${device.productName || "Unknown USB Device"}\nVendor ID: 0x${device.vendorId.toString(16).padStart(4, '0')}\nProduct ID: 0x${device.productId.toString(16).padStart(4, '0')}\nClass: ${device.deviceClass}`);
      addActivity(`Paired physical hardware USB identifier: ${device.productName || "Unknown"}`);
    } catch (e: any) {
      if (e.name === "NotFoundError") {
        setHwLog("No hardware device selected by operator.");
      } else {
        setHwLog(`Failed to compile WebUSB port: ${e.message}`);
      }
    }
  };

  return (
    <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg mt-6" id="shafikul-usb-installer-module">
      
      {/* Title & Concept Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-900 mb-6 gap-4">
        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#00e5ff] flex items-center gap-2">
            <Usb className="w-5 h-5 text-cyan-400 animate-pulse" /> CYBER USB OS PORT & INSTALLATION CENTER
          </h3>
          <p className="text-[10px] font-mono text-slate-500 uppercase mt-1 leading-relaxed">
            Flash the custom personal Operating System onto virtual thumb drives to run portable modules, or plug in a pre-compiled boot image to restore profiles.
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Virtual USB Insert Toggle widget */}
          <button 
            type="button"
            onClick={handleInsertVirtualUsb}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition duration-300 ${
              isVirtualInserted 
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold" 
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <Cpu className={`w-4 h-4 ${isVirtualInserted ? "animate-spin" : ""}`} />
            <span>{isVirtualInserted ? "EJECT VIRTUAL USB" : "INSERT VIRTUAL USB"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid content layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Mount flasher config */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">PORTABLE OS COMPRESSED COMPILATION</span>
            </div>

            {/* Simulated USB properties */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">TARGET DRIVE:</span>
                <span className={`${isVirtualInserted ? "text-cyan-400 font-bold" : "text-slate-600"}`}>
                  {isVirtualInserted ? activeDevice.name : "[NO TARGET DRIVE INSERTED]"}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">AVAILABLE METRIC SIZE:</span>
                <span className="text-[#00e5ff]">{isVirtualInserted ? activeDevice.size : "0 GB"}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">HOST SPEED PROFILE:</span>
                <span className="text-slate-400">{isVirtualInserted ? activeDevice.speed : "N/A"}</span>
              </div>
            </div>

            {/* Selecting Partition system */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-[10px] font-mono text-slate-500 uppercase">OS PARTITION SCHEMA</label>
              <div className="grid grid-cols-3 gap-2">
                {(["FAT32", "EXT4", "exFAT"] as const).map(fs => (
                  <button
                    key={fs}
                    type="button"
                    disabled={!isVirtualInserted}
                    onClick={() => setSelectedFileSystem(fs)}
                    className={`px-2 py-1.5 rounded-md font-mono text-xs text-center border uppercase transition ${
                      selectedFileSystem === fs 
                        ? "bg-cyan-950/40 text-cyan-400 border-cyan-400" 
                        : "bg-slate-900/80 text-slate-500 border-slate-850 hover:text-slate-300 disabled:opacity-40"
                    }`}
                  >
                    {fs}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox fields to include configs */}
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-500">INCORPORATE SECURE KEY LOGS & VAULTS:</span>
              <input 
                type="checkbox"
                checked={includeSystemLogs}
                onChange={(e) => setIncludeSystemLogs(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              {/* COMPILATION TRIGGER BUTTON */}
              <button
                type="button"
                onClick={handleFlashUsb}
                disabled={!isVirtualInserted || flashingState === "working"}
                className="w-full bg-cyan-950/50 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 disabled:border-slate-850 disabled:bg-slate-900/60 disabled:text-slate-600 transition-all duration-300 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              >
                {flashingState === "working" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{flashingState === "working" ? "FLASHING OS TO USB DRIVE..." : "COMPILE & FLASH PORTABLE .ISO FILE"}</span>
              </button>
            </div>
          </div>

          {/* Import Portable ISO Backup Portal */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">RESTORE SYSTEM FROM BOOTABLE USB IMAGE</span>
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase leading-relaxed">
              Have you compiled a custom system install `.iso` previously? Select or drag and drop your save image block to flash settings instantaneously.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-grow font-mono bg-emerald-950/30 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-center transition cursor-pointer"
              >
                LOAD SYSTEM PORTABLE CONFIG (.ISO / .JSON)
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".iso,.json" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* Right Side: Terminals and Physical diagnostics */}
        <div className="md:col-span-6 space-y-4">
          
          {/* Diagnostic status flasher shell */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900 mb-3 text-[10px] text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Terminal className="w-4.5 h-4.5 text-cyan-400" /> VIRTUAL CONSOLE BUS</span>
              <span className="text-[#00e5ff]">{progress}%</span>
            </div>

            {/* High-fidelity visual flashing progress bar */}
            {flashingState === "working" && (
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-3">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 h-52 overflow-y-auto space-y-1.5 custom-scrollbar flex flex-col justify-end">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-center my-auto flex flex-col items-center justify-center gap-2">
                  <Binary className="w-8 h-8 text-slate-700 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-wider font-mono">Terminal bus idle. Slot in virtual cyberdrive storage block...</p>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <p key={idx} className="text-[10px] font-mono leading-relaxed text-emerald-400 break-all select-all">
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>

          {/* Real WebUSB port diagnostic tool */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2 mb-3">
              <Shield className="w-4.5 h-4.5 text-[#00e5ff]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">PHYSICAL WEBUSB INTEGRATION CONSOLE</span>
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase leading-relaxed mb-3">
              Attempt to query hardware registers directly using WebUSB APIs to sense real physical microcontrollers or controllers plugged directly into your motherboard.
            </p>

            <button
              type="button"
              onClick={handleWebUsbScan}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SCAN REAL WORKSPACE USB CONTROLLERS</span>
            </button>

            {hwLog && (
              <pre className="mt-3 bg-slate-950 text-slate-400 text-[10px] font-mono p-3 rounded-lg border border-slate-850 whitespace-pre-wrap leading-relaxed uppercase">
                {hwLog}
              </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
