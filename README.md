# Communication Analyzer AI (Vocalist AI)

AI-powered communication analysis for transcribed speech/text. The app detects tone, intent, emotional intensity, politeness, and confidence, then rewrites the input into a clearer, more empathetic version while preserving intent.

Built with Next.js App Router + AI SDK + Google Gemini.


## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- AI SDK (`ai`) + Google provider (`@ai-sdk/google`)
- Zod for runtime schema enforcement


## Prerequisites

- Node.js 20+
- npm 10+ (or equivalent package manager)
- A Google Generative AI API key

## Environment Variables

Create a `.env.local` file in project root:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Without this key, `/api/analyze` returns:

- status: `500`
- code: `MISSING_KEY`

## Getting Started

1. Install dependencies:

	 ```bash
	 npm install
	 ```

2. Add `.env.local` as shown above.

3. Start development server:

	 ```bash
	 npm run dev
	 ```

4. Open http://localhost:3000

## Scripts

```bash
# Start app
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

### Evaluation script

Runs benchmark cases against local API endpoint.

```bash
npx tsx scripts/evaluate.ts
```

Notes:
- Requires dev server running at `http://localhost:3000`
- Uses predefined tone/intent expectations and reports pass rate + average latency

### Model discovery utility

```bash
npx tsx scripts/list_models.ts
```

Prints available Gemini model names using your configured API key.
