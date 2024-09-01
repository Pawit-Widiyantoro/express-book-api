const express = require("express");
const router = express.Router();
const auth = require("../middleware/AuthMiddleware");
const BookController = require("../controller/BookController");

router.get("/", auth, BookController.getAllBooks);

router.get("/:id", auth, BookController.getBookById);

router.post("/", auth, BookController.createBook);

router.put("/:id", auth, BookController.updateBook);

router.delete("/:id", auth, BookController.deleteBook);

module.exports = router;