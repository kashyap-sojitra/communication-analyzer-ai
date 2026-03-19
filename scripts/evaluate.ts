// A simple test script to evaluate the AI Agent against PRD benchmarks
// Required to run via tsx: `npx tsx scripts/evaluate.ts`

import "process";

const API_URL = "http://localhost:3000/api/analyze";

const tests = [
  { id: "T-01", input: "Do this now!", expectedTone: "commanding", expectedIntent: "command" },
  { id: "T-02", input: "Can you please help me?", expectedTone: "polite", expectedIntent: "request" },
  { id: "T-03", input: "Why is this still broken?!", expectedTone: "frustrated", expectedIntent: "complaint" },
  { id: "T-04", input: "Oh great, another crash.", expectedTone: "sarcastic", expectedIntent: "complaint" },
  { id: "T-05", input: "Good morning!", expectedTone: "friendly", expectedIntent: "greeting" },
  { id: "T-06", input: "The file is on the server.", expectedTone: "neutral", expectedIntent: "information" },
  { id: "T-07", input: "YOU NEVER LISTEN TO ME.", expectedTone: "angry", expectedIntent: "complaint" },
  { id: "T-08", input: "Thank you so much, really helpful.", expectedTone: "polite", expectedIntent: "appreciation" },
];

async function runTests() {
  console.log("🚀 Starting Voice AI Agent Evaluation Benchmark\n");

  let passed = 0;
  let totalLatency = 0;

  for (const test of tests) {
    console.log(`Evaluating [${test.id}] "${test.input}"`);
    
    const start = Date.now();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: test.input }),
      });
      
      const latency = Date.now() - start;
      totalLatency += latency;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ API Error: ${response.statusText} - ${errorData.message || 'No message'}`);
        if (errorData.stack) console.error(errorData.stack.split('\n').slice(0, 3).join('\n')); // Log first 3 lines of stack
        continue;
      }

      const data = await response.json();
      
      const toneMatch = data.tone === test.expectedTone;
      const intentMatch = data.intent === test.expectedIntent;
      
      if (toneMatch && intentMatch) {
        console.log(`✅ Passed - Tone: ${data.tone}, Intent: ${data.intent} (${latency}ms)`);
        passed++;
      } else {
        console.log(`❌ Failed (${latency}ms)`);
        if (!toneMatch) console.log(`   Expected Tone: ${test.expectedTone}, Got: ${data.tone}`);
        if (!intentMatch) console.log(`   Expected Intent: ${test.expectedIntent}, Got: ${data.intent}`);
      }
      
    } catch (e: unknown) {
        console.error(`❌ Error running test ${test.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
    console.log("------------------------------------------");
  }

  const avgLatency = (totalLatency / tests.length).toFixed(0);
  console.log(`\n📊 Benchmark Results: ${passed}/${tests.length} Passed`);
  console.log(`⏱️ Average Latency: ${avgLatency}ms`);
  if (parseInt(avgLatency) > 2000) {
      console.warn("⚠️ Warning: Average latency exceeds NFR-1 requirement of 2 seconds.");
  } else {
      console.log("✅ Latency meets NFR-1 requirements.");
  }
}

// Check if server is running before executing
fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "test" }) })
    .then(() => runTests())
    .catch((err) => {
        console.error("❌ Cannot connect to API. Please ensure the Next.js server is running (`npm run dev`) before executing this script.", err);
    });
