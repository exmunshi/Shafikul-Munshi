import React, { useState } from "react";
import { 
  Plus, Search, List, Kanban, AlertTriangle, Clock, 
  Trash2, Edit3, CheckSquare, Square, ThumbsUp, Send, Loader2, RefreshCcw
} from "lucide-react";
import { Task, Priority, SubTask } from "../types";

interface SmartTaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addActivity: (desc: string) => void;
  onTriggerAssistant: (prompt: string) => void;
}

export default function SmartTaskManager({ 
  tasks, 
  setTasks, 
  addActivity, 
  onTriggerAssistant 
}: SmartTaskManagerProps) {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  // New Task form state
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("Learning");
  const [deadline, setDeadline] = useState("");
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // Subtask adding state
  const [newSubtaskText, setNewSubtaskText] = useState("");

  const handleCreateOrUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditingId) {
      // Edit mode
      setTasks(prev => prev.map(t => {
        if (t.id === isEditingId) {
          addActivity(`Updated task payload: ${title}`);
          return {
            ...t,
            title,
            notes,
            priority,
            category,
            deadline,
            repeat
          };
        }
        return t;
      }));
      setIsEditingId(null);
    } else {
      // Create mode
      const newTask: Task = {
        id: "task_" + Math.random().toString(36).substr(2, 9),
        title,
        notes,
        priority,
        category,
        deadline: deadline || undefined,
        completed: false,
        repeat,
        subtasks: [],
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      addActivity(`Instantiated task matrix: ${title}`);
    }

    // Reset Form
    setTitle("");
    setNotes("");
    setPriority("medium");
    setCategory("Learning");
    setDeadline("");
    setRepeat("none");
    setIsFormOpen(false);
  };

  const startEdit = (task: Task) => {
    setIsEditingId(task.id);
    setTitle(task.title);
    setNotes(task.notes || "");
    setPriority(task.priority);
    setCategory(task.category);
    setDeadline(task.deadline || "");
    setRepeat(task.repeat);
    setIsFormOpen(true);
  };

  const deleteTask = (id: string, titleStr: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addActivity(`Decommissioned task: ${titleStr}`);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        addActivity(`Task completeness changed: ${t.title} -> ${nextState ? 'COMPLETED' : 'PENDING'}`);
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSub = task.subtasks.map(sub => {
          if (sub.id === subtaskId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });
        return { ...task, subtasks: updatedSub };
      }
      return task;
    }));
    addActivity(`Toggled subtask completion index`);
  };

  const addSubtask = (taskId: string) => {
    if (!newSubtaskText.trim()) return;
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newSub: SubTask = {
          id: "sub_" + Math.random().toString(36).substr(2, 9),
          text: newSubtaskText,
          completed: false
        };
        return { ...task, subtasks: [...task.subtasks, newSub] };
      }
      return task;
    }));
    setNewSubtaskText("");
    addActivity(`Appended subtask leaf node`);
  };

  // AI Task Recommendation Assist
  const requestSuggestiveAI = () => {
    onTriggerAssistant(
      "Based on my YouTube goal, video editing learning tracks, and sleep priorities, suggest 3 high-impact tasks to add to my scheduler right now."
    );
  };

  // Filter calculations
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || task.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityGlow = (p: Priority) => {
    switch (p) {
      case "high":
        return "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-950/20";
      case "medium":
        return "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)] bg-yellow-950/20";
      case "low":
        return "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-slate-900/60";
    }
  };

  const getPriorityTag = (p: Priority) => {
    switch (p) {
      case "high": return <span className="text-[9px] font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/30">HIGHT TACTICAL</span>;
      case "medium": return <span className="text-[9px] font-bold text-yellow-400 bg-yellow-950/80 px-1.5 py-0.5 rounded border border-yellow-500/30">STANDARD PITCH</span>;
      case "low": return <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">ROUTINE BLOCK</span>;
    }
  };

  return (
    <div className="space-y-6" id="shafikul-task-manager-root">
      
      {/* Search and Controller Panel */}
      <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold font-mono tracking-wide text-white mr-4">TACTICAL SCHEDULING ENGINE</h2>
            <button 
              onClick={() => { setIsFormOpen(true); setIsEditingId(null); }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
            >
              <Plus className="w-4 h-4" /> INITIATE OPERATION
            </button>
            <button 
              onClick={requestSuggestiveAI}
              className="bg-purple-950/40 hover:bg-purple-900/45 text-purple-300 border border-purple-500/30 font-mono font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200"
            >
              <RefreshCcw className="w-3.5 h-3.5 animate-spin-slow" /> SUGGEST VIA AI CORE
            </button>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded font-mono text-xs flex items-center gap-1 ${viewMode === 'list' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" /> LIST
            </button>
            <button 
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded font-mono text-xs flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Kanban className="w-3.5 h-3.5" /> KANBAN
            </button>
          </div>

        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search index variables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800/80 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="learning">LEARNING & ACADEMIC</option>
              <option value="youtube">YOUTUBE STUDIO</option>
              <option value="video editing">VIDEO EDITING</option>
              <option value="discipline">DISCIPLINE TRAINING</option>
              <option value="personal">PERSONAL MATRIX</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">ALL FOCUS PRIORITIES</option>
              <option value="high">HIGH CRITICAL</option>
              <option value="medium">MEDIUM TACTICAL</option>
              <option value="low">LOW ROUTINE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Creation / Edit Modal Backdrop overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] animate-fade-in">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold tracking-widest text-cyan-400">
                {isEditingId ? "MUTATE CORE TASK SPECIFICATION" : "COMPILE NEW MATRIX NODES"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                [ TERMINATE ]
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateTask} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">TASK CORE TITLE</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Master premiere cut speed keys"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">SYNAPSE NOTES / REASONING</label>
                <textarea 
                  rows={2}
                  placeholder="Provide sub-layer directives..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">CRITICAL PRIORITY</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="high">HIGH (CRITICAL GLOW)</option>
                    <option value="medium">MEDIUM (TACTICAL GLOW)</option>
                    <option value="low">LOW (ROUTINE BIOME)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">SECTOR INDEX</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Learning">Learning</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Discipline">Discipline</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">TARGET TIMEMARK</label>
                  <input 
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">MATRIX REPEAT</label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as "none" | "daily" | "weekly")}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="none">DO NOT REPEAT</option>
                    <option value="daily">CYCLE DAILY</option>
                    <option value="weekly">CYCLE WEEKLY</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {isEditingId ? "COMPILE RECONSTITUTION" : "GENERATE AND DEPLOY"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 font-mono text-xs px-4 rounded-lg transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Primary Tasks Display Section */}
      {viewMode === "list" ? (
        // List Mode Layout
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-slate-950/30 text-center py-12 rounded-xl border border-slate-800/85">
              <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Operational parameters blank. Initiate a high priority node.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                className={`p-5 rounded-xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${getPriorityGlow(task.priority)}`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <button 
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-slate-950 text-cyan-400 border border-cyan-500/20 px-1.5 rounded">
                        {task.category}
                      </span>
                      {getPriorityTag(task.priority)}
                      {task.repeat !== 'none' && (
                        <span className="text-[8px] font-mono text-purple-400 border border-purple-500/20 px-1 rounded uppercase bg-purple-950/30">
                          cycle: {task.repeat}
                        </span>
                      )}
                    </div>
                    
                    <h4 className={`text-sm font-semibold tracking-wide mt-1.5 ${task.completed ? 'line-through text-slate-500 font-normal' : 'text-slate-100'}`}>
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-400 mt-1 font-mono">{task.notes}</p>
                    )}

                    {/* Deadline node icon block */}
                    {task.deadline && (
                      <div className="flex items-center text-[10px] font-mono text-slate-500 mt-2 gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400/80" />
                        <span>TACTICAL LIMIT: {task.deadline}</span>
                      </div>
                    )}

                    {/* Interactive Subtask Expansion nodes */}
                    <div className="mt-4 border-t border-slate-800/60 pt-3">
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">MICRO-DIRECTIVES ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</p>
                      
                      {task.subtasks.length > 0 && (
                        <div className="space-y-1.5 mb-2 pl-2">
                          {task.subtasks.map(sub => (
                            <div key={sub.id} className="flex items-center gap-2">
                              <button 
                                onClick={() => toggleSubtask(task.id, sub.id)}
                                className={`text-[11px] font-mono flex items-center gap-1.5 transition-colors ${sub.completed ? 'text-slate-500 line-through' : 'text-slate-300 hover:text-cyan-400'}`}
                              >
                                {sub.completed ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                                {sub.text}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 max-w-sm mt-1">
                        <input 
                          type="text"
                          placeholder="Append micro directive..."
                          value={newSubtaskText}
                          onChange={(e) => setNewSubtaskText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addSubtask(task.id)}
                          className="bg-slate-950/80 border border-slate-900 rounded-lg px-2 px-1 text-[11px] font-mono text-white flex-1 focus:outline-none focus:border-cyan-500"
                        />
                        <button 
                          onClick={() => addSubtask(task.id)}
                          className="bg-cyan-950/50 text-cyan-400 text-[10.5px] border border-cyan-500/20 px-2 py-0.5 rounded hover:bg-cyan-900/60"
                        >
                          ADD
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Operations column */}
                <div className="flex md:flex-col items-center gap-2 md:justify-center self-end md:self-center border-t md:border-t-0 md:pl-4 border-slate-800 pt-3 md:pt-0">
                  <button 
                    onClick={() => startEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-950/80 rounded transition-all cursor-pointer"
                    title="Edit Directive"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id, task.title)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-950/80 rounded transition-all cursor-pointer"
                    title="Decommission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Kanban Columns View (3 static priority columns)
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["high", "medium", "low"] as Priority[]).map(colPriority => {
            const priorityTasks = filteredTasks.filter(t => t.priority === colPriority);
            return (
              <div key={colPriority} className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
                    colPriority === 'high' ? 'text-red-400' : colPriority === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {colPriority} prioritization ({priorityTasks.length})
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    colPriority === 'high' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : colPriority === 'medium' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  }`} />
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[500px] flex-1 pr-1 custom-scrollbar">
                  {priorityTasks.length === 0 ? (
                    <div className="text-center py-12 text-slate-700 text-xs uppercase font-mono italic">
                      sector clear
                    </div>
                  ) : (
                    priorityTasks.map(task => (
                      <div 
                        key={task.id}
                        className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2 hover:border-cyan-500/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono uppercase bg-slate-950 text-cyan-400 px-1 py-0.5 rounded">
                            {task.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit(task)} className="p-0.5 text-slate-500 hover:text-white"><Edit3 className="w-3 h-3" /></button>
                            <button onClick={() => deleteTask(task.id, task.title)} className="p-0.5 text-slate-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>

                        <h5 className="text-xs font-bold text-slate-100">{task.title}</h5>
                        {task.notes && <p className="text-[11px] font-mono text-slate-400 line-clamp-2">{task.notes}</p>}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
                          <button 
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="text-[10px] font-mono flex items-center gap-1 hover:text-cyan-400"
                          >
                            {task.completed ? (
                              <span className="text-cyan-400 text-glow flex items-center gap-1"><CheckSquare className="w-3 h-3" /> COMPLETED</span>
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1"><Square className="w-3 h-3" /> PENDING</span>
                            )}
                          </button>
                          {task.deadline && (
                            <span className="text-[9px] font-mono text-slate-500">{task.deadline}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
