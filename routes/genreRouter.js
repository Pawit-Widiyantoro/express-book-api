const express = require("express");
const router = express.Router();
const auth = require("../middleware/AuthMiddleware");
const GenreController = require("../controller/GenreController");

router.get("/", auth, GenreController.getAllGenres);

router.get("/:id", auth, GenreController.getGenreById);

router.get("/:id/books", auth, GenreController.getBooksForGenre);

router.post("/", auth, GenreController.createGenre);

router.put("/:id", auth, GenreController.updateGenre);

router.delete("/:id", auth, GenreController.deleteGenre);

module.exports=router;