const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const thumbnailController = require('../controller/thumbnail.controller');

// Protected routes for thumbnails
router.post('/generate', auth, thumbnailController.createThumbnail);
router.get('/', auth, thumbnailController.getUserThumbnails);
router.get('/:id', auth, thumbnailController.getThumbnailById);
router.delete('/:id', auth, thumbnailController.deleteThumbnail);

module.exports = router;
