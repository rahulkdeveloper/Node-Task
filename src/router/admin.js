const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createUser } = require('../controller/admin');
const { updateBookStatus } = require("../controller/books");
const { middlewareValidation, schemas } = require('../middleware/validate')

router.post("/create-user", auth("superadmin"), middlewareValidation(schemas.createUser), createUser);
router.patch("/update-book-status", auth("superadmin"), middlewareValidation(schemas.updateBookStatus), updateBookStatus);

module.exports = router;