const axios = require('axios');
const aiConfig = require('../config/ai.js');

// ── Aspect ratio → width/height for HuggingFace ───────────────────────────
// SDXL works best at these resolutions
const HF_SIZES = {
  '16:9': { width: 1024, height: 576 },
  '1:1':  { width: 1024, height: 1024 },
  '9:16': { width: 576,  height: 1024 },
}

function hexToColorName(hex) {
  const colors = {
    '#ff0000': 'bright red', '#dc2f02': 'deep red', '#e85d04': 'fiery orange-red',
    '#ff8906': 'warm orange', '#faa307': 'golden orange', '#f4a261': 'soft orange',
    '#ffd166': 'bright yellow', '#ffc300': 'vivid yellow',
    '#2cb67d': 'emerald green', '#52b788': 'mint green', '#1b4332': 'deep forest green',
    '#39ff14': 'neon green',
    '#0077b6': 'deep ocean blue', '#00b4d8': 'bright cyan blue', '#90e0ef': 'light sky blue',
    '#7f5af0': 'vivid purple', '#533483': 'deep violet', '#7c6ff7': 'soft lavender purple',
    '#f72585': 'hot pink', '#ff70a6': 'soft pink', '#ffb7c5': 'light pink',
    '#22d3ee': 'bright cyan', '#06b6d4': 'vivid teal cyan',
    '#1a1a2e': 'very dark navy', '#16213e': 'dark midnight blue',
    '#e9ecef': 'light gray', '#adb5bd': 'medium gray', '#6c757d': 'dark gray',
  }
  if (colors[hex?.toLowerCase()]) return colors[hex.toLowerCase()]
  try {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
    let closest = 'vibrant color', minDist = Infinity
    for (const [h, name] of Object.entries(colors)) {
      const cr=parseInt(h.slice(1,3),16), cg=parseInt(h.slice(3,5),16), cb=parseInt(h.slice(5,7),16)
      const dist = Math.sqrt((r-cr)**2+(g-cg)**2+(b-cb)**2)
      if (dist < minDist) { minDist=dist; closest=name }
    }
    return closest
  } catch { return 'vibrant color' }
}

function buildPrompt({ title, aspectRatio, style, colorScheme, colorHex = [], additionalPrompt = '' }) {
  const styleDesc = aiConfig.STYLE_DESCS[style] || aiConfig.STYLE_DESCS['Bold & Graphic']

  let colorDesc
  if (colorHex && colorHex.length >= 2) {
    const names = colorHex.map(h => hexToColorName(h))
    colorDesc = `use ${names[0]} as dominant color, ${names[1]} as secondary${names[2] ? `, ${names[2]} as accent` : ''}`
  } else {
    colorDesc = aiConfig.COLOR_SCHEMES[colorScheme] || aiConfig.COLOR_SCHEMES.aurora
  }

  const compositionMap = {
    '16:9': 'wide horizontal landscape layout, all text fully visible, nothing cropped at edges',
    '1:1':  'square centered layout, all text perfectly centered and fully visible',
    '9:16': 'tall vertical portrait layout for mobile, text stacked vertically, fully visible top to bottom',
  }
  const compositionRule = compositionMap[aspectRatio] || compositionMap['16:9']
  const spellingNote = `Text must be spelled EXACTLY: "${title.toUpperCase()}" — no missing or extra letters.`

  let prompt = `YouTube thumbnail. ${spellingNote} `
  prompt += `Show text: "${title.toUpperCase()}". `
  prompt += `${styleDesc}. Color: ${colorDesc}. `
  prompt += `${compositionRule}. `
  prompt += `Professional high contrast vibrant MrBeast style thumbnail.`
  if (additionalPrompt) prompt += ` ${additionalPrompt}`

  return prompt
}

// ── OpenAI ─────────────────────────────────────────────────────────────────
async function generateWithOpenAI(prompt, aspectRatio) {
  const size = aiConfig.ASPECT_SIZES[aspectRatio]
  if (!size) throw new Error('Invalid aspect ratio')

  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    { model: 'dall-e-3', prompt, n: 1, size, quality: 'hd', response_format: 'b64_json' },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 120000,
    }
  )
  return `data:image/png;base64,${response.data.data[0].b64_json}`
}

// ── HuggingFace ─────────────────────────────────────────────────────────────
async function generateWithHuggingFace(prompt, aspectRatio) {
  const HF_MODELS = [
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-xl-base-1.0',
    'runwayml/stable-diffusion-v1-5',
  ]

  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('HuggingFace failed: HUGGINGFACE_API_KEY is not set in .env')
  }

  // ✅ Get correct width/height for aspect ratio
  const { width, height } = HF_SIZES[aspectRatio] || HF_SIZES['16:9']

  const headers = {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'image/png',
  }

  let lastError = null

  for (const model of HF_MODELS) {
    try {
      console.log(`Trying HuggingFace model: ${model} at ${width}x${height}`)

      const response = await axios.post(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          inputs: prompt,
          parameters: {
            width,    // ✅ explicit width
            height,   // ✅ explicit height
            num_inference_steps: 30,
            guidance_scale: 7.5,
          }
        },
        { headers, responseType: 'arraybuffer', timeout: 90000 }
      )

      const contentType = response.headers['content-type'] || ''
      if (contentType.includes('application/json')) {
        const jsonBody = JSON.parse(Buffer.from(response.data).toString())
        lastError = new Error(jsonBody?.error || JSON.stringify(jsonBody))
        console.warn(`HF model ${model} JSON error:`, lastError.message)
        continue
      }

      console.log(`HuggingFace success: ${model} at ${width}x${height}`)
      return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`

    } catch (error) {
      let errorMsg = error.message
      if (error.response?.data) {
        try {
          const decoded = Buffer.from(error.response.data).toString()
          errorMsg = JSON.parse(decoded)?.error || decoded
        } catch { errorMsg = Buffer.from(error.response.data).toString() }
      }
      console.warn(`HF model ${model} failed (HTTP ${error.response?.status}):`, errorMsg)
      lastError = new Error(errorMsg)
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`HuggingFace auth failed: Invalid API key`)
      }
    }
  }
  throw new Error(`HuggingFace failed: All models unavailable. ${lastError?.message || ''}`)
}

// ── Main ────────────────────────────────────────────────────────────────────
async function generateImage(prompt, aspectRatio) {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateWithOpenAI(prompt, aspectRatio)
    } catch (openaiError) {
      const status = openaiError.response?.status
      const msg = openaiError.response?.data?.error?.message || openaiError.message
      console.warn(`OpenAI failed (HTTP ${status}): ${msg} — falling back to HuggingFace`)
    }
  } else {
    console.warn('OPENAI_API_KEY not set — using HuggingFace directly')
  }
  // ✅ Pass aspectRatio to HuggingFace too
  return await generateWithHuggingFace(prompt, aspectRatio)
}

module.exports = { buildPrompt, generateImage }