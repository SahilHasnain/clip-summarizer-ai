import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    let transcriptText;
    try {
      const response = await fetch(
        `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`,
        {
          headers: {
            "x-rapidapi-key": process.env.RAPID_API_KEY || "",
            "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }

      const data = await response.json();
      const transcript = data.transcript || data;
      transcriptText = Array.isArray(transcript)
        ? transcript.map((item: any) => item.text).join(" ")
        : "";
    } catch (err) {
      console.error("Transcript fetch error:", err);
      return NextResponse.json(
        { error: "Transcript not available for this video" },
        { status: 404 }
      );
    }

    if (!transcriptText || transcriptText.length < 10) {
      return NextResponse.json(
        { error: "Transcript is empty or too short" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const prompt = `Summarize the following YouTube video transcript clearly and concisely.
Include 5–7 bullet points highlighting the key takeaways and a short one-line summary at the beginning.

Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }
}
