const axios = require('axios');
const aiConfig = require('../config/ai.js');

/**
 * Build high-quality YouTube thumbnail prompt
 */
function buildPrompt({ title, aspectRatio, style, colorScheme, additionalPrompt = '' }) {
  const styleDesc = aiConfig.STYLE_DESCS[style] || aiConfig.STYLE_DESCS['Bold & Graphic'];
  const colorDesc = aiConfig.COLOR_SCHEMES[colorScheme] || aiConfig.COLOR_SCHEMES.aurora;
  const sizeDesc = `optimized for ${aspectRatio} aspect ratio`;

  let prompt = `Create a highly engaging YouTube thumbnail designed for maximum CTR. `;
  prompt += `Main bold text reads "${title.toUpperCase()}", `;
  prompt += `using striking typography that pops. `;
  prompt += `${styleDesc}, ${colorDesc}, ${sizeDesc}. `;
  prompt += `Eye-catching composition with professional layout, `;
  prompt += `optional expressive human face reacting emotionally, `;
  prompt += `glow effects, arrows or elements directing attention to text. `;
  prompt += `Real YouTube thumbnail style like MrBeast - not generic AI art, `;
  prompt += `high contrast, vibrant colors, sharp details, perfect for mobile viewing.`;

  if (additionalPrompt) {
    prompt += ` ${additionalPrompt}`;
  }

  return prompt;
}

/**
 * Generate image using OpenAI DALL-E 3 (primary)
 */
async function generateWithOpenAI(prompt, aspectRatio) {
  const size = aiConfig.ASPECT_SIZES[aspectRatio];
  if (!size) throw new Error('Invalid aspect ratio');

  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    {
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality: 'hd',
      response_format: 'b64_json',
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 120000,
    }
  );

  const data = response.data.data[0];
  return `data:image/png;base64,${data.b64_json}`;
}

/**
 * Generate image using HuggingFace Router (fallback)
 * NOTE: router.huggingface.co is the NEW required endpoint
 *       api-inference.huggingface.co is DEPRECATED and no longer works
 */
async function generateWithHuggingFace(prompt) {
  const HF_MODELS = [
    'black-forest-labs/FLUX.1-schnell',           // fastest, great quality
    'stabilityai/stable-diffusion-xl-base-1.0',   // classic SDXL
    'runwayml/stable-diffusion-v1-5',             // lightweight fallback
  ];

  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('HuggingFace failed: HUGGINGFACE_API_KEY is not set in .env');
  }

  const headers = {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  let lastError = null;

  for (const model of HF_MODELS) {
    try {
      console.log(`Trying HuggingFace model: ${model}`);

      const response = await axios.post(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        { inputs: prompt },
        {
          headers,
          responseType: 'arraybuffer',
          timeout: 90000,
        }
      );

      // HF returns image bytes on success — check content-type to detect error JSON
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const jsonBody = JSON.parse(Buffer.from(response.data).toString());
        const msg = jsonBody?.error || JSON.stringify(jsonBody);
        console.warn(`HF model ${model} returned JSON error:`, msg);
        lastError = new Error(msg);
        continue;
      }

      console.log(`HuggingFace success with model: ${model}`);
      const base64 = Buffer.from(response.data).toString('base64');
      return `data:image/png;base64,${base64}`;

    } catch (error) {
      let errorMsg = error.message;

      if (error.response?.data) {
        try {
          const decoded = Buffer.from(error.response.data).toString();
          const parsed = JSON.parse(decoded);
          errorMsg = parsed?.error || decoded;
        } catch {
          errorMsg = Buffer.from(error.response.data).toString();
        }
      }

      console.warn(`HF model ${model} failed (HTTP ${error.response?.status}):`, errorMsg);
      lastError = new Error(errorMsg);

      // Hard auth error — no point trying other models
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`HuggingFace auth failed: Invalid API key. Check HUGGINGFACE_API_KEY in .env`);
      }
    }
  }

  throw new Error(`HuggingFace failed: All models unavailable. ${lastError?.message || ''}`);
}

/**
 * Main: OpenAI first, HuggingFace fallback on ANY error
 */
async function generateImage(prompt, aspectRatio) {
  // ── Try OpenAI ──────────────────────────────────────────────────────────────
  if (process.env.OPENAI_API_KEY) {
    try {
      const result = await generateWithOpenAI(prompt, aspectRatio);
      return result;
    } catch (openaiError) {
      const status = openaiError.response?.status;
      const msg = openaiError.response?.data?.error?.message || openaiError.message;
      console.warn(`OpenAI failed (HTTP ${status}): ${msg} — falling back to HuggingFace`);
    }
  } else {
    console.warn('OPENAI_API_KEY not set — using HuggingFace directly');
  }

  // ── Fallback: HuggingFace ───────────────────────────────────────────────────
  return await generateWithHuggingFace(prompt);
}

module.exports = {
  buildPrompt,
  generateImage,
};