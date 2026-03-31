const cloudinary = require('cloudinary').v2;

// Ensure config is loaded from .env (already done in controller)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64Image - data:image/png;base64,...
 * @returns {Promise<string>} secure_url
 */
async function uploadImage(base64Image) {
  try {
    // Extract base64 data (remove data:image/png;base64, prefix)
    const matches = base64Image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    const buffer = Buffer.from(matches[2], 'base64');

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'image',
          folder: 'ai-thumbnails',
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

module.exports = {
  uploadImage
};
