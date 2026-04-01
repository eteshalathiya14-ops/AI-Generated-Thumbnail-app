const Thumbnail = require('../model/thumbnail.model');
const { buildPrompt, generateImage } = require('../services/aiService');
const { uploadImage } = require('../services/cloudinaryService');

// ─────────────────────────────────────────────
// CONTROLLERS
// ─────────────────────────────────────────────

// POST /api/thumbnails/generate — Generate AI thumbnail
exports.createThumbnail = async (req, res) => {
  try {
    const { title, aspectRatio, style, colorScheme, colorHex, additionalPrompt } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!['16:9', '1:1', '9:16'].includes(aspectRatio)) {
      return res.status(400).json({ error: 'Invalid aspect ratio. Use 16:9, 1:1, or 9:16' });
    }
    if (!style || !['Bold & Graphic', 'Minimal', '3D', 'Cartoon', 'Cinematic', 'Neon Glow'].includes(style)) {
      return res.status(400).json({ error: 'Invalid style' });
    }

    // 1. Build AI prompt
    const prompt = buildPrompt({ title, aspectRatio, style, colorScheme, colorHex, additionalPrompt });

    // 2. Generate image with OpenAI + HF fallback
    const base64Image = await generateImage(prompt, aspectRatio);

    // 3. Upload to Cloudinary
    const imageUrl = await uploadImage(base64Image);

    // 4. Save to DB
    const thumbnail = new Thumbnail({
      title: title.trim(),
      aspectRatio,
      style,
      colorScheme,
      additionalPrompt: additionalPrompt?.trim() || '',
      prompt,
      imageUrl,
      user_id: userId,
    });

    await thumbnail.save();

    res.status(201).json({
      message: 'AI thumbnail generated successfully',
      thumbnail: {
        id: thumbnail._id,
        imageUrl,
        prompt,
      },
    });

  } catch (err) {
    console.error('THUMBNAIL GENERATION ERROR:', err.message);
    
    // Enhanced error handling for AI service
    if (err.message.startsWith('openai_billing_limit')) {
      return res.status(402).json({ 
        error: 'OpenAI billing limit reached', 
        type: 'billing',
        solution: 'Switched to free Hugging Face AI. Upgrade OpenAI plan for faster generation.',
        fallback: true 
      });
    }
    if (err.message.startsWith('openai_client_error')) {
      return res.status(429).json({ 
        error: 'Rate limited by OpenAI', 
        type: 'rate_limit',
        solution: 'Switched to free fallback. Please wait a few minutes or upgrade plan.'
      });
    }
    if (err.message.startsWith('HuggingFace failed')) {
      return res.status(503).json({ 
        error: err.message, 
        type: 'service_unavailable',
        solution: 'Try again in a few moments or add your Hugging Face API key for priority access.'
      });
    }
    
    // Generic errors
    res.status(500).json({ error: err.message });
  }
};

// GET /api/thumbnails — Get all thumbnails of logged-in user
exports.getUserThumbnails = async (req, res) => {
  try {
    const thumbnails = await Thumbnail
      .find({ user_id: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ thumbnails });
  } catch (err) {
    console.error(" GET ALL ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/thumbnails/:id — Get single thumbnail by ID
exports.getThumbnailById = async (req, res) => {
  try {
    const thumbnail = await Thumbnail.findOne({
      _id:     req.params.id,
      user_id: req.user._id,
    }).select('-__v'); // exclude mongoose version

    if (!thumbnail) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    res.json({ thumbnail });
  } catch (err) {
    console.error(" GET BY ID ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/thumbnails/:id — Delete thumbnail by ID
exports.deleteThumbnail = async (req, res) => {
  try {
    const thumbnail = await Thumbnail.findOneAndDelete({
      _id:     req.params.id,
      user_id: req.user._id,
    });

    if (!thumbnail) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    res.json({ message: 'Thumbnail deleted successfully' });
  } catch (err) {
    console.error(" DELETE ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

