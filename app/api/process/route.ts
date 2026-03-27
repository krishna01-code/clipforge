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
      auto_highlights: true,
    });

    if (transcript.status === "error") {
      return NextResponse.json({ error: transcript.error }, { status: 500 });
    }

    const highlights = transcript.auto_highlights_result?.results
      ?.sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))
      .slice(0, 5)
      .map((h) => ({
        text: h.text,
        rank: h.rank,
        timestamps: h.timestamps,
      }));

    return NextResponse.json({
      success: true,
      transcript: transcript.text,
      highlights: highlights || [],
    });

  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}