const express = require('express');
const { validateRequest } = require('../../middleware/validate');
const { loginSchema } = require('./auth.schema');
const { login } = require('./auth.controller');

const router = express.Router();

router.post('/login', validateRequest({ body: loginSchema }), login);

module.exports = router;
