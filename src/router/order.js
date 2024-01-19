const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { buyNow } = require("../controller/order");
const { middlewareValidation, schemas } = require('../middleware/validate')

router.post("/buy-now", auth("user"), middlewareValidation(schemas.createOrder), buyNow);

module.exports = router;