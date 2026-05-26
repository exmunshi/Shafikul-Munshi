import React, { useState } from "react";
import { 
  Tv, Film, Tag, Plus, CheckSquare, Square, Trash2, 
  Sparkles, CheckCircle2, ChevronRight, ListOrdered, Calendar, Image 
} from "lucide-react";
import { CreatorProject } from "../types";

interface YouTubeCreatorStudioProps {
  projects: CreatorProject[];
  setProjects: React.Dispatch<React.SetStateAction<CreatorProject[]>>;
  addActivity: (desc: string) => void;
  onTriggerAssistant: (prompt: string) => void;
}

const SEO_CHECKLIST_LIBRARY = [
  "Verify title is under 60 characters with strong keyword emphasis",
  "Implement structured description with timeline chapter flags",
  "Design ultra-vivid thumbnail with neon cyan color contrast bounds",
  "Inject 15 targeted metadata hashtags and SEO keyphrases",
  "Insert interactive End Screen and Subscription cards"
];

export default function YouTubeCreatorStudio({
  projects,
  setProjects,
  addActivity,
  onTriggerAssistant,
}: YouTubeCreatorStudioProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newNiche, setNewNiche] = useState("Self-Improvement Tech");
  const [newScript, setNewScript] = useState("");
  const [newTags, setNewTags] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || "");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArr = newTags ? newTags.split(",").map(t => "#" + t.trim().replaceAll("#", "")) : [];

    const newProj: CreatorProject = {
      id: "project_" + Math.random().toString(36).substr(2, 9),
      title: newTitle,
      niche: newNiche,
      workflowStage: "idea",
      scriptNotes: newScript || undefined,
      thumbnailPlanned: false,
      seoTags: tagsArr,
      checklist: SEO_CHECKLIST_LIBRARY.map(c => "pending")
    };

    setProjects(p => [newProj, ...p]);
    addActivity(`Initialized creator project parameters: ${newTitle}`);
    setNewTitle("");
    setNewScript("");
    setNewTags("");
    setActiveProjectId(newProj.id);
  };

  const handleNextWorkflowStage = (projId: string) => {
    const stages: Array<CreatorProject["workflowStage"]> = ["idea", "scripting", "editing", "thumbnail", "ready", "published"];
    
    setProjects(p => p.map(proj => {
      if (proj.id === projId) {
        const currentIdx = stages.indexOf(proj.workflowStage);
        const nextStage = stages[Math.min(stages.length - 1, currentIdx + 1)];
        addActivity(`UPGRADED PRODUCTION CELL: ${proj.title} is now in stage [${nextStage.toUpperCase()}]`);
        return {
          ...proj,
          workflowStage: nextStage
        };
      }
      return proj;
    }));
  };

  const toggleThumnailFlag = (projId: string) => {
    setProjects(p => p.map(proj => {
      if (proj.id === projId) {
        const nextStatus = !proj.thumbnailPlanned;
        addActivity(`Adjusted thumbnail rendering checklist: ${proj.title}`);
        return { ...proj, thumbnailPlanned: nextStatus };
      }
      return proj;
    }));
  };

  const handleDeleteProject = (id: string, name: string) => {
    setProjects(p => p.filter(proj => proj.id !== id));
    addActivity(`Decompressed creator project file: ${name}`);
  };

  const handleToggleSeoCheck = (projId: string, index: number) => {
    setProjects(p => p.map(proj => {
      if (proj.id === projId) {
        const nextCheck = [...proj.checklist];
        nextCheck[index] = nextCheck[index] === "done" ? "pending" : "done";
        addActivity(`Toggled search SEO tag item for video: ${proj.title}`);
        return { ...proj, checklist: nextCheck };
      }
      return proj;
    }));
  };

  const requestAIScriptAdvice = (pTitle: string) => {
    onTriggerAssistant(`I am working on a YouTube video titled "${pTitle}". Please write a compelling 3-step high-retention script outline hook and metadata recommendation for my channel.`);
  };

  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const getStageColor = (stg: CreatorProject["workflowStage"]) => {
    switch (stg) {
      case "idea": return "text-cyan-400 bg-cyan-950/40 border border-cyan-500/20";
      case "scripting": return "text-yellow-400 bg-yellow-950/40 border border-yellow-500/20";
      case "editing": return "text-blue-400 bg-blue-950/40 border border-blue-500/20 animate-pulse";
      case "thumbnail": return "text-purple-400 bg-purple-950/40 border border-purple-500/20";
      case "ready": return "text-emerald-400 bg-emerald-950/40 border border-emerald-500/20";
      case "published": return "text-slate-400 bg-slate-900 border border-slate-700/50";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-youtube-creator-root">
      
      {/* Video Content pipelines (4 cols) */}
      <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1">
              <Film className="w-4 h-4 text-cyan-400" /> CREATIVE PROJECTS
            </h3>
            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/30 px-1 py-0.25 rounded">PIPELINE GRID</span>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {projects.map(proj => {
              const active = proj.id === activeProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 block relative overflow-hidden ${
                    active 
                      ? "border-purple-500/50 bg-slate-900 shadow-[0_0_12px_rgba(123,97,255,0.06)]" 
                      : "border-slate-900 bg-slate-950/20 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] text-slate-500 font-mono font-medium">{proj.niche}</span>
                    <span className={`text-[8.5px] uppercase font-mono px-2 py-0.5 rounded ${getStageColor(proj.workflowStage)}`}>
                      {proj.workflowStage}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{proj.title}</h4>

                  {proj.seoTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {proj.seoTags.slice(0, 2).map((tg, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-slate-500">{tg}</span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compile New Video Project */}
        <form onSubmit={handleCreateProject} className="mt-4 pt-3 border-t border-slate-900 space-y-2">
          <input 
            type="text"
            required
            placeholder="Envision new video idea..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
          />
          <input 
            type="text"
            placeholder="SEO Tags separated by commas (e.g. premiere, resolve)"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2 py-1 text-[10px] font-mono text-white focus:outline-none focus:border-purple-500"
          />
          <button 
            type="submit"
            className="w-full bg-purple-950/30 hover:bg-purple-500 hover:text-slate-950 text-purple-400 border border-purple-500/20 py-1.5 rounded-lg text-xs font-mono transition-all font-bold"
          >
            LAUNCH PRODUCTION INTERCEPT
          </button>
        </form>
      </div>

      {/* Workspace Sandbox / Script planner (8 cols) */}
      <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        {currentProject ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-purple-950 mb-5">
              <span className="text-xs font-mono font-bold text-purple-400 tracking-widest uppercase flex items-center gap-1">
                <Tv className="w-4.5 h-4.5 text-purple-400" /> CREATIVE CENTER WORKSPACE: {currentProject.title}
              </span>
              <button 
                onClick={() => handleDeleteProject(currentProject.id, currentProject.title)}
                className="text-slate-600 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Step advancement bar */}
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between mb-6">
              <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                <span className="text-slate-500 font-bold">PIPELINE PHASE:</span>
                <span className="text-purple-400 font-extrabold uppercase">{currentProject.workflowStage}</span>
              </div>
              
              {currentProject.workflowStage !== "published" && (
                <button 
                  onClick={() => handleNextWorkflowStage(currentProject.id)}
                  className="bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/20 px-3 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1"
                >
                  <span>ADVANCE PHASE</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left col: Script and Thumbnail settings */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">SCRIPT OUTLINE SUMMARY</span>
                  
                  <textarea 
                    rows={4}
                    value={currentProject.scriptNotes || "No outline compiled yet, Operator. Write parameters..."}
                    onChange={(e) => {
                      const text = e.target.value;
                      setProjects(p => p.map(proj => {
                        if (proj.id === currentProject.id) {
                          return { ...proj, scriptNotes: text };
                        }
                        return proj;
                      }));
                    }}
                    className="w-full bg-slate-950-80 border border-slate-850 rounded-lg p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500 placeholder-slate-700"
                  />

                  <button 
                    onClick={() => requestAIScriptAdvice(currentProject.title)}
                    className="mt-3 bg-purple-950/20 hover:bg-purple-900/30 text-purple-400 border border-purple-500/10 px-3 py-1.5 rounded-lg text-[10px] font-mono w-full flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>QUERY INSPIRATIONAL METADATA SCRIPTS FROM JARVIS</span>
                  </button>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">THUMBNAIL DESIGN CONFIG</span>
                    <span className="text-xs font-bold text-slate-200">Ready for editing preview</span>
                  </div>
                  <button 
                    onClick={() => toggleThumnailFlag(currentProject.id)}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded border transition-colors ${currentProject.thumbnailPlanned ? 'bg-purple-950 text-purple-400 border-purple-500/20' : 'bg-slate-950 text-slate-600 border-slate-900'}`}
                  >
                    {currentProject.thumbnailPlanned ? "RENDERED & DESIGNED" : "DRAFTING"}
                  </button>
                </div>
              </div>

              {/* Right col: SEO Compliance checking list */}
              <div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-purple-400" /> SEARCH ALGORITHM SEO MATRIX
                  </span>

                  <div className="space-y-3.5">
                    {SEO_CHECKLIST_LIBRARY.map((item, idx) => {
                      const isChecked = currentProject.checklist?.[idx] === "done";
                      return (
                        <button
                          key={idx}
                          onClick={() => handleToggleSeoCheck(currentProject.id, idx)}
                          className={`w-full text-left font-mono text-[11px] flex items-start gap-2.5 transition-colors ${isChecked ? 'text-slate-500 line-through' : 'text-slate-200 hover:text-purple-400'}`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-600 font-mono text-xs uppercase italic">
            Select a project.
          </div>
        )}

        <div className="mt-6 border-t border-slate-900 pt-3 text-[10px] font-mono text-slate-500 uppercase flex justify-between">
          <span>YOUTUBE WORKFLOWS NOMINAL SYSTEM AGENT CONTROL</span>
          <span className="text-cyan-400/80 hover:underline cursor-pointer" onClick={() => onTriggerAssistant("recommend content topics about video editing learning strategies for youtube status")}>
            BRAINSTORM TOPICS
          </span>
        </div>
      </div>

    </div>
  );
}
