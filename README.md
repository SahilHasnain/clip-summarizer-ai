# ClipSummarizer AI

AI-powered YouTube video summarizer built with Next.js, Tailwind CSS, and Gemini AI.

## Features

- Instant YouTube video summarization
- Clean, responsive UI with Tailwind CSS + Shadcn
- 3 free summaries per day (localStorage-based)
- Copy summary to clipboard
- Error handling for invalid URLs and unavailable transcripts

## Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
RAPID_API_KEY=your_rapidapi_key_here
```

Get your Gemini API key from: https://aistudio.google.com/app/apikey
Get your RapidAPI key from: https://rapidapi.com/

3. Run development server:
```bash
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Gemini AI
- YouTube Transcript API
