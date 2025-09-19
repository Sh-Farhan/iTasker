
// import { NextResponse } from "next/server";
// import { generateText } from "ai";
// import { xai } from "@ai-sdk/xai";

// // IMPORTANT: Do NOT set runtime='edge' when using the AI SDK here.

// export async function GET() {
//   return NextResponse.json({
//     endpoint: "/api/ai/generate",
//     methods: ["GET", "POST"],
//     usage:
//       "POST with JSON body: { intent: 'generate'|'summarize', prompt?: string, board?: { columns: [...] } }",
//     note: "Visiting this endpoint in a browser issues GET and returns this info.",
//   });
// }

// export async function POST(req: Request) {
//   try {
//     const { intent, prompt, board } = await req.json();

//     if (!intent || (intent !== "generate" && intent !== "summarize")) {
//       return NextResponse.json({ error: "Invalid intent" }, { status: 400 });
//     }

//     // Define the model once to avoid repetition
//     const model = xai(process.env.XAI_MODEL || "grok-4");

//     // Use if/else if for clear, distinct logic paths
//     if (intent === "generate") {
//       if (!prompt || typeof prompt !== "string") {
//         return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
//       }

//       const { text } = await generateText({
//         model: model,
//         prompt: `
// Act as a helpful project assistant. Generate a concise set of Kanban tasks from the user's request.

// User request: "${prompt}"

// Return ONLY valid JSON with this shape:
// {
//   "columns": [
//     { "id": "todo", "title": "To Do", "tasks": [ { "title": "Task title", "description": "1-2 sentence description" } ] },
//     { "id": "inprogress", "title": "In Progress", "tasks": [] },
//     { "id": "done", "title": "Done", "tasks": [] }
//   ]
// }

// Rules:
// - Generate 5-10 tasks total across columns (mostly in "todo").
// - Titles must be short and actionable.
// - Keep descriptions brief (<= 2 sentences).
// - NEVER include markdown or extra commentary—JSON only.
//         `,
//       });

//       let data: any;
//       try {
//         data = JSON.parse(text);
//       } catch (error) {
//         // Log the malformed response for debugging
//         console.error("Failed to parse AI JSON response:", text); 
//         // Return a meaningful error to the client
//         return NextResponse.json(
//           { error: "The AI returned an invalid JSON response. Please try again." },
//           { status: 500 }
//         );
//       }
//       return NextResponse.json({ result: data });

//     } else if (intent === "summarize") {
//       if (!board) {
//         return NextResponse.json({ error: "Missing board for summarize" }, { status: 400 });
//       }

//       const { text } = await generateText({
//         model: model,
//         prompt: `
// You are a succinct project analyst. Summarize this Kanban board.

// Board JSON:
// ${JSON.stringify(board, null, 2)}

// Provide:
// - Overall status in one sentence.
// - Top 3 risks or blockers.
// - Next 3 recommended tasks to start.

// Keep under 120 words. Plain text only.
//         `,
//       });
//       return NextResponse.json({ summary: text });
//     }
    
//   } catch (error: any) {
//     // Top-level catch for all other errors
//     return NextResponse.json(
//       { error: error?.message || "AI request failed. Ensure the Grok (xAI) integration is configured (XAI_API_KEY)." },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google"; // Changed from 'xai'

// IMPORTANT: Do NOT set runtime='edge' when using the AI SDK here.

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/ai/generate",
    methods: ["GET", "POST"],
    usage:
      "POST with JSON body: { intent: 'generate'|'summarize', prompt?: string, board?: { columns: [...] } }",
    note: "Visiting this endpoint in a browser issues GET and returns this info.",
  });
}

export async function POST(req: Request) {
  try {
    const { intent, prompt, board } = await req.json();

    if (!intent || (intent !== "generate" && intent !== "summarize")) {
      return NextResponse.json({ error: "Invalid intent" }, { status: 400 });
    }

    const model = google("models/gemini-1.5-flash-latest");

    if (intent === "generate") {
      if (!prompt || typeof prompt !== "string") {
        return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
      }

      const { text } = await generateText({
        model: model,
        prompt: `
Act as a helpful project assistant. Generate a concise set of Kanban tasks from the user's request.

User request: "${prompt}"

Return ONLY valid JSON with this shape:
{
  "columns": [
    { "id": "todo", "title": "To Do", "tasks": [ { "title": "Task title", "description": "1-2 sentence description" } ] },
    { "id": "inprogress", "title": "In Progress", "tasks": [] },
    { "id": "done", "title": "Done", "tasks": [] }
  ]
}

Rules:
- Generate 5-10 tasks total across columns (mostly in "todo").
- Titles must be short and actionable.
- Keep descriptions brief (<= 2 sentences).
- NEVER include markdown or extra commentary—JSON only.
        `,
      });

      let data: any;
      try {
        // **FIX: Clean the AI response before parsing**
        const cleanedText = text.replace(/```json\n|```/g, "");
        data = JSON.parse(cleanedText);
      } catch (error) {
        console.error("Failed to parse AI JSON response:", text);
        return NextResponse.json(
          { error: "The AI returned an invalid JSON response. Please try again." },
          { status: 500 }
        );
      }
      return NextResponse.json({ result: data });

    } else if (intent === "summarize") {
      if (!board) {
        return NextResponse.json({ error: "Missing board for summarize" }, { status: 400 });
      }

      const { text } = await generateText({
        model: model,
        prompt: `
You are a succinct project analyst. Summarize this Kanban board.

Board JSON:
${JSON.stringify(board, null, 2)}

Provide:
- Overall status in one sentence.
- Top 3 risks or blockers.
- Next 3 recommended tasks to start.

Keep under 120 words. Plain text only.
        `,
      });
      return NextResponse.json({ summary: text });
    }
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "AI request failed. Ensure the Google AI integration is configured (GOOGLE_GENERATIVE_AI_API_KEY)." },
      { status: 500 }
    );
  }
}