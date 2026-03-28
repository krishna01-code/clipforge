import { AssemblyAI } from "assemblyai";
import { NextRequest, NextResponse } from "next/server";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
    }
const transcript = await client.transcripts.transcribe({
      audio_url: videoUrl,
      speech_models: ["universal-2"],
      language_detection: true,
    });

    if (transcript.status === "error") {
      return NextResponse.json({ error: transcript.error }, { status: 500 });
    }

    const words = transcript.words || [];
    console.log("Total words:", words.length);
    console.log("First word:", words[0]);

    const clips = [];
    let i = 0;

    while (i < words.length) {
      const startMs = words[i].start;
      const endMs = startMs + 8000;
      const clipWords = words.filter((w) => w.start >= startMs && w.start < endMs);
      const text = clipWords.map((w) => w.text).join(" ");

      if (text.trim().length > 5) {
        clips.push({
          text: text.trim(),
          rank: 0.9 - clips.length * 0.1,
          timestamps: [{ start: startMs, end: endMs }],
        });
      }

      const nextIdx = words.findIndex((w) => w.start >= endMs);
      if (nextIdx === -1) break;
      i = nextIdx;
    }

    return NextResponse.json({
      success: true,
      transcript: transcript.text,
      highlights: clips.slice(0, 5),
    });

  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}