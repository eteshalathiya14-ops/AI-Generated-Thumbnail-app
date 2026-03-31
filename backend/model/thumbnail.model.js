const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid")


const thumbnailSchema = new mongoose.Schema(
  {
    _id: {
    type: String,
    default: uuidv4   
  },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true
    },

    aspectRatio: {
      type: String,
      enum: ['16:9', '1:1', '9:16'],
      default: '16:9'
    },

    style: {
      type: String,
       enum: [
        'Bold & Graphic',
        'Minimal',
        '3D',
        'Cartoon',
        'Cinematic',
        'Neon Glow'
      ],
      default: 'Bold & Graphic'
    },

    colorScheme: {
      type: String,
      enum: [
        'aurora',
        'sunset',
        'ocean',
        'midnight',
        'sakura',
        'forest',
        'volcano',
        'mist'
      ],
      default: 'aurora' 
    },

    additionalPrompt: {
      type: String,
      trim: true
    },

    prompt: {
      type: String,
      trim: true
    },

    imageUrl: {
      type: String,
      required: true
    },

    user_id: {
      type: String,   
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Thumbnail', thumbnailSchema);