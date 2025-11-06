"use client";

import { useState } from "react";
import { InputBox } from "@/components/input-box";
import { SummaryResult } from "@/components/summary-result";
import { Loader } from "@/components/loader";
import { useFreeLimit } from "@/hooks/use-free-limit";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { canUse, incrementUsage, remaining } = useFreeLimit();

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!canUse()) {
      setError(
        `Daily limit reached. You have ${remaining()} summaries remaining today.`
      );
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);
      incrementUsage();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            ClipSummarizer AI
          </h1>
          <p className="text-gray-600 text-lg">
            Get instant AI-powered summaries of YouTube videos
          </p>
          <p className="text-sm text-gray-500">
            {remaining()} free summaries remaining today
          </p>
        </div>

        <InputBox
          value={videoUrl}
          onChange={setVideoUrl}
          onSubmit={handleSummarize}
          loading={loading}
          error={error}
        />

        {loading && <Loader />}
        {summary && <SummaryResult summary={summary} />}
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500">
        Built with ❤️ by Sahil Hasnain
      </footer>
    </main>
  );
}
