const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

type ModelsApiResponse = {
  error?: {
    message?: string;
  };
  models?: Array<{
    name?: string;
  }>;
};

async function listModels() {
  if (!apiKey) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = (await response.json()) as ModelsApiResponse;
    
    if (data.error) {
      console.error("API Error:", data.error.message);
      return;
    }

    console.log("AVAILABLE_MODELS_START");
    (data.models ?? []).forEach((m) => {
      console.log(m.name);
    });
    console.log("AVAILABLE_MODELS_END");
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
