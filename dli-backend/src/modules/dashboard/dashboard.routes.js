const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const { getMe } = require('./dashboard.controller');

const router = express.Router();

router.get('/me', verifyToken, getMe);

module.exports = router;
