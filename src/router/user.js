const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadProfileImage, loadProfile } = require('../controller/user');

router.get("/load-profile", auth("user", "admin", "superadmin"), loadProfile);

module.exports = router;