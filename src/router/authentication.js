const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controller/authentication');
const { schemas, middlewareValidation } = require('../middleware/validate');
const { auth } = require('../middleware/auth');


router.post("/register", middlewareValidation(schemas.registerBody), register);
router.post("/login", middlewareValidation(schemas.loginBody), login);
router.post("/forgot-password", middlewareValidation(schemas.forgotPasswordBody), forgotPassword);
router.post("/reset-password", middlewareValidation(schemas.resetPasswordBody), resetPassword);


module.exports = router;