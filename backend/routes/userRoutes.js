const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);
router.get('/email/:id', userController.getEmail);

module.exports = router;