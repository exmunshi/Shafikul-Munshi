import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("your") || apiKey.trim() === "") {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error("Error initializing GoogleGenAI client:", err);
    return null;
  }
}

// Check configuration status
app.get("/api/config-status", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";
  res.json({
    hasGeminiKey: hasKey,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// AI Chat Core (Jarvis)
app.post("/api/ai/assistant", async (req, res) => {
  const { messages, userData } = req.body;

  const client = getGeminiClient();
  if (!client) {
    // Elegant fallback simulation if API Key is not set yet
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    let mockResponse = "";
    
    const queryLower = lastUserMessage.toLowerCase();
    if (queryLower.includes("hello") || queryLower.includes("hi") || queryLower.includes("hey")) {
      mockResponse = `[OS_INTELLIGENCE] Welcome back, Operator Shafikul. 
System status is NOMINAL. I am running in local-node simulation mode. 
Tasks compiled: learn Premier Pro / DaVinci Resolve, frame your thumbnail strategy, and secure 7.5 hours of restorative sleep tonight. 

How shall we calibrate your focus layout, Sir?`;
    } else if (queryLower.includes("youtube") || queryLower.includes("channel")) {
      mockResponse = `[YOUTUBE_STRATEGIST] Intercepting video design query. 
To launch your content creation loop, Sir, I recommend:
1. Choose a tight edit-focused niche: "Before & After Editing Breakdowns".
2. Hook within 5 seconds using geometric side-by-side transition animations.
3. Master J-cuts and sound sweeps. This will multiply viewer retention.

Let's lock down this concept in your Creator Studio.`;
    } else if (queryLower.includes("discipline") || queryLower.includes("sleep") || queryLower.includes("productivity")) {
      mockResponse = `[DISCIPLINE_BOOST] Routine alignment checklist activated:
- Punctuality Score: Current pacing is adequate but needs tight alignment.
- Sleep Metric: Aim to set "Sleep Mode" by 11:00 PM tonight. 20-minute screen black-out beforehand is highly recommended.
- Consistency: 1 hour daily of editing practice overrides 5 hours of sporadic crunching.

The OS is logging your daily micro-commitments. Stay crisp.`;
    } else {
      mockResponse = `[OS_CORE] Command acknowledged, Shafikul. Jarvis AI Core is running in simulated offline mode. 
Your target priorities remain: video editing acceleration and YouTube workflow establishment. 

I can assist with adding tasks, timing sleep cycles, and logging creator ideas locally. Standard routines remain operational.`;
    }

    return res.json({ reply: mockResponse, simulated: true });
  }

  try {
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are Jarvis, the advanced AI core of Shafikul's Personal Operating System (Shafikul AI Personal OS).
Your user is Shafikul.
Shafikul is on a hyper-disciplined self-improvement quest to:
- Learn video editing (Premiere, DaVinci Resolve)
- Start YouTube content creation, planning video ideas, scripts, checklists
- Drastically improve time management, consistency, and daily punctuality
- Maintain consistent routine hours and track sleep patterns (aim for 7-8 hrs, waking up consistently)

Current time context: ${new Date().toISOString()}
Shafikul's current OS status: ${JSON.stringify(userData || {})}

Tone directives:
- Speak like Jarvis from Iron Man combined with a high-fidelity cyberpunk super-OS.
- Respectful, highly intelligent, sharp, military-disciplined, yet deeply motivating.
- Match cyberpunk aesthetics. Use futuristic log tags once in a while such as [OS_INTELLIGENCE], [CORE_SYS_REC], [DISCIPLINE_BOOST], [YOUTUBE_STRATEGIST], or [NEURAL_LINK].
- Avoid long paragraphs. Deliver answers in structured, bite-sized bullet lists, clean code-blocks, or short powerful paragraphs.
- Address him as "Sir", "Operator Shafikul", or "Shafikul".`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    res.json({ reply: response.text || "Diagnostic cycle complete, Sir. No output response generated.", simulated: false });
  } catch (error: any) {
    console.error("Gemini assistant error:", error);
    res.status(500).json({ error: "Failed to query the AI core. " + error.message });
  }
});

// AI Advisor System & Personalized Diagnostics
app.post("/api/ai/recommend", async (req, res) => {
  const { userData } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Sleek pre-calculated offline recommendations to make the OS gorgeous and functional
    return res.json({
      recommendations: [
        "Dedicate exactly 45 minutes to 'B-Roll pacing exercises' in your video editing software today.",
        "Enforce a hard screen lock 30 minutes before bed to reduce blue-light cortisol spikes.",
        "Add 1 proactive buffer block in your calendar for unannounced daily delays to train punctuality."
      ],
      youtubeIdeas: [
        {
          title: "How I master editing with an AI Operating System",
          niche: "Self-Improvement Tech",
          difficulty: "Medium",
          checklist: [
            "Script structure: Hook with OS visual, show actual editing timeline, summarize learning tracker.",
            "Thumbnail concept: High contrast glowing teal screen behind a clean side-portrait.",
            "SEO tag suggestion: #software #videoediting #productivityOS"
          ]
        },
        {
          title: "5 Video Editing Habits I Wish I Learned Sooner",
          niche: "Creative Education",
          difficulty: "Easy",
          checklist: [
            "Structure: Quick cuts demonstrating bad habits vs smooth adjustments.",
            "Explain J-cuts, L-cuts, and keyboard short-shortcuts.",
            "Pitch subscriber call-to-action near the 3-minute pacing mark."
          ]
        }
      ],
      motivation: "Consistency is not about perfection, Shafikul. It is about registering daily minimum targets. One clip edited a day beats a masterpiece done twice a year.",
      levelAdvancementTips: "Spend 200 XP further on learning checklist goals to unlock Tier-2 holographic widgets.",
      simulated: true
    });
  }

  try {
    const prompt = `Analyze Shafikul's current OS diagnostics and user data to guide his roadmap in video editing, YouTube creation, punctuality, and sleep cycles.
Current Diagnostics:
${JSON.stringify(userData || {})}

You must return a raw JSON object aligned exactly with this schema without adding extra markdown formatting outside the JSON:
{
  "recommendations": ["string", "string", "string"], 
  "youtubeIdeas": [
    {
      "title": "string",
      "niche": "string",
      "difficulty": "Easy" | "Medium" | "High",
      "checklist": ["string", "string", "string"]
    }
  ],
  "motivation": "string",
  "levelAdvancementTips": "string"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ ...data, simulated: false });
  } catch (error: any) {
    console.error("AI recommendation error:", error);
    res.status(500).json({ error: "Failed to compile recommendations. " + error.message });
  }
});

// Fallback/Vite middleware routing setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SHAFIKUL AI OS] Server online, addressing interfaces at http://localhost:${PORT}`);
  });
}

setupVite();
