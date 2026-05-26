import React, { useState } from "react";
import { 
  Key, Lock, Unlock, Eye, HelpCircle, Plus, Search, 
  Trash2, ShieldCheck, FileText, RefreshCw, Send, AlertCircle 
} from "lucide-react";
import { SecretNote } from "../types";

interface PersonalNotesVaultProps {
  notes: SecretNote[];
  setNotes: React.Dispatch<React.SetStateAction<SecretNote[]>>;
  addActivity: (desc: string) => void;
  onTriggerAssistant: (prompt: string) => void;
}

export default function PersonalNotesVault({
  notes,
  setNotes,
  addActivity,
  onTriggerAssistant,
}: PersonalNotesVaultProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCat, setNewCat] = useState<"ideas" | "vault" | "journal" | "reflection">("ideas");
  const [lockWithPassword, setLockWithPassword] = useState(false);
  const [lockPass, setLockPass] = useState("");

  const [userInputKey, setUserInputKey] = useState("");
  const [unlockedNotes, setUnlockedNotes] = useState<Record<string, boolean>>({});

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNote: SecretNote = {
      id: "note_" + Math.random().toString(36).substr(2, 9),
      title: newTitle,
      body: newBody,
      category: newCat,
      isPasswordLocked: lockWithPassword,
      passwordHash: lockWithPassword ? lockPass : undefined,
      updatedAt: new Date().toUTCString(),
    };

    setNotes(p => [newNote, ...p]);
    addActivity(`Committed note matrix to local memory space: ${newTitle}`);
    
    setNewTitle("");
    setNewBody("");
    setLockWithPassword(false);
    setLockPass("");
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, title: string) => {
    setNotes(p => p.filter(n => n.id !== id));
    addActivity(`Deassociated note file payload: ${title}`);
  };

  const handleNoteBodyChange = (id: string, text: string) => {
    setNotes(p => p.map(note => {
      if (note.id === id) {
        return {
          ...note,
          body: text,
          updatedAt: new Date().toUTCString(),
        };
      }
      return note;
    }));
  };

  const tryUnlockNote = (note: SecretNote) => {
    if (!userInputKey) return;
    if (userInputKey === note.passwordHash) {
      setUnlockedNotes(p => ({ ...p, [note.id]: true }));
      addActivity(`DECRYPTED SENSITIVE BLOCK: Note unlocked: ${note.title}`);
      setUserInputKey("");
    } else {
      addActivity(`DECRYPTION FAILURE: Key signature mismatch for note: ${note.title}`);
      alert("INCORRECT DECRYPTION SIGNATURE ACCESS DENIED.");
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const getCatLabelColor = (cat: string) => {
    switch (cat) {
      case "ideas": return "text-cyan-400 bg-cyan-950/40 border border-cyan-500/10";
      case "vault": return "text-red-400 bg-red-950/40 border border-red-500/10";
      case "journal": return "text-emerald-400 bg-emerald-950/40 border border-emerald-500/10";
      case "reflection": return "text-purple-400 bg-purple-950/40 border border-purple-500/10";
      default: return "text-slate-400 bg-slate-900";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shafikul-notes-vault-root">
      
      {/* Search and notes directory (4 cols) */}
      <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1">
              <FileText className="w-4 h-4 text-cyan-400" /> REPLICATED SECTOR NOTES
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-1 py-0.25 rounded">S-VAULT</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search encrypted brain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8.5 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">ALL MEMORY SECTORS</option>
              <option value="ideas">YOUTUBE IDEAS & CHEATS</option>
              <option value="vault">CREDENTIALS & VAULT SECURE</option>
              <option value="journal">DAILY BIOLOGICAL JOURNAL</option>
              <option value="reflection">SELF DISCIPLINE REFLECTION</option>
            </select>
          </div>

          <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredNotes.map(note => {
              const active = note.id === activeNoteId;
              const locked = note.isPasswordLocked && !unlockedNotes[note.id];
              return (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-300 block ${
                    active 
                      ? "border-cyan-500/50 bg-slate-900 shadow-[0_0_12px_rgba(0,229,255,0.05)]" 
                      : "border-slate-900 bg-slate-950/20 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 text-[9.5px] font-mono text-slate-500">
                    <span className={`px-1.5 py-0.25 rounded capitalize ${getCatLabelColor(note.category)}`}>
                      {note.category}
                    </span>
                    {locked ? <Lock className="w-3 h-3 text-red-500" /> : <Unlock className="w-3 h-3 text-slate-600" />}
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 truncate mt-1">{note.title}</h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Create note inline */}
        <form onSubmit={handleCreateNote} className="mt-4 pt-3 border-t border-slate-900 space-y-2">
          <input 
            type="text"
            required
            placeholder="Introduce new note entry..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />
          <textarea 
            rows={2}
            placeholder="Compose initial thoughts..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            className="w-full bg-slate-900 border border-slate-855 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCat}
              onChange={(e: any) => setNewCat(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg p-1 text-[10px] font-mono text-white focus:outline-none"
            >
              <option value="ideas">ideas</option>
              <option value="vault">vault SECURE</option>
              <option value="journal">journal</option>
              <option value="reflection">reflection</option>
            </select>
            <div className="flex items-center justify-between px-1.5 bg-slate-900 rounded border border-slate-800">
              <span className="text-[9px] font-mono text-slate-500">SECURE CRYPT?</span>
              <input 
                type="checkbox"
                checked={lockWithPassword}
                onChange={(e) => setLockWithPassword(e.target.checked)}
                className="w-3 h-3"
              />
            </div>
          </div>
          {lockWithPassword && (
            <input 
              type="text"
              required
              placeholder="Deploy password code (e.g. 1234)"
              value={lockPass}
              onChange={(e) => setLockPass(e.target.value)}
              className="w-full bg-red-950/20 border border-red-500/30 rounded px-2 py-1 text-[10px] font-mono text-white focus:outline-none"
            />
          )}
          <button 
            type="submit"
            className="w-full bg-cyan-950/40 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 py-1.5 rounded-lg text-xs font-mono transition-all font-semibold cursor-pointer"
          >
            COMMIT TO REPLICATOR
          </button>
        </form>
      </div>

      {/* Workspace Sandbox / Rich Text editor (8 cols) */}
      <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between">
        {currentNote ? (
          <div className="h-full flex flex-col justify-between">
            {/* Header note path */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4 text-xs font-mono">
              <span className="text-slate-400">NOTE_ID: {currentNote.id}</span>
              <span className="text-indigo-400">UPDATED: {currentNote.updatedAt}</span>
            </div>

            {/* Check if password locked and not unlocked */}
            {currentNote.isPasswordLocked && !unlockedNotes[currentNote.id] ? (
              <div className="my-12 flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto p-6 bg-red-950/10 border border-red-500/25 rounded-2xl">
                <Lock className="w-12 h-12 text-red-500 animate-pulse" />
                <h4 className="text-sm font-mono font-bold uppercase text-red-400">CYPHER CORE ACCESS GRANTED</h4>
                <p className="text-[10px] font-mono text-slate-500 text-center leading-relaxed font-semibold">
                  This memory partition is fully cryptographic. Input your preassigned keypad credential to decrypt.
                </p>
                <div className="flex gap-2 w-full">
                  <input 
                    type="password"
                    placeholder="Credential code..."
                    value={userInputKey}
                    onChange={(e) => setUserInputKey(e.target.value)}
                    className="flex-grow bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                  <button 
                    onClick={() => tryUnlockNote(currentNote)}
                    className="bg-red-950 hover:bg-red-500 hover:text-slate-950 text-red-400 border border-red-500/30 px-3.5 py-1.5 rounded text-xs font-mono transition-all cursor-pointer"
                  >
                    DECRYPT
                  </button>
                </div>
              </div>
            ) : (
              // Unlocked editor area
              <div className="flex-1 mt-2">
                <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-1.5 mb-3 uppercase tracking-wide">
                  <Unlock className="w-4 h-4 text-cyan-400" /> {currentNote.title}
                </h2>
                <textarea 
                  rows={14}
                  value={currentNote.body}
                  onChange={(e) => handleNoteBodyChange(currentNote.id, e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500/30 font-semibold"
                />

                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => {
                      addActivity(`Dispatched auto-save for note: ${currentNote.title}`);
                      alert("METADATA STATE FLUSHED AND AUTO-SAVED INTEGRITY GREEN.");
                    }}
                    className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 text-[10.5px] font-mono py-2 rounded-lg transition-all"
                  >
                    FORCE AUTO-SAVE FLUSH
                  </button>
                  <button 
                    onClick={() => onTriggerAssistant(`Synthesize a beautiful executive summary of this note context:\n${currentNote.body}`)}
                    className="flex-1 bg-cyan-950/40 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 text-[10.5px] font-mono py-2 rounded-lg transition-all"
                  >
                    AI COGNITION SUMMARY
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-600 font-mono text-xs uppercase italic">
            Select an active node memory.
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-950 flex items-center space-x-2 text-[10px] font-mono text-slate-500">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
          <span>LOCAL REPLICATORS RUNNING COMPRESSION PROTOCOLS. MEMORY SECURE.</span>
        </div>
      </div>

    </div>
  );
}
