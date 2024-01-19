const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { addBook, loadBooks, loadById, update, deleteBook } = require('../controller/books');
const { middlewareValidation, schemas } = require('../middleware/validate')

router.post("/add-book", auth("admin"), middlewareValidation(schemas.addBook), addBook);
router.get("/load", auth("superadmin", "admin", "user"), loadBooks);
router.get("/load/:id", auth("superadmin", "admin", "user"), loadById);
router.put("/update", auth("admin"), middlewareValidation(schemas.updateBook), update);
router.delete("/delete/:bookId", auth("admin"), deleteBook);

module.exports = router;