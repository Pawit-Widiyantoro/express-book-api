const { Genre, Book } = require("../model/Index");
const logger = require("../logger");

exports.getAllGenres = async (req, res) => {
    try {
        const genre = await Genre.findAll();
        logger.info(`Successfully retrieved genre!`);
        res.status(200).json({
            message: "Genre fetched successfully!",
            data: genre,
        });
    } catch (error) {
        logger.error(`Error retrieving genre: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

exports.getGenreById = async (req, res) => {
    const genreId = req.params.id;
    logger.info(`Received GET request on /genre/${genreId}`);

    try {
        const genre = await Genre.findByPk(genreId);
        if (genre) {
            logger.info(`Successfully retrieved genre with ID: ${genreId}`);
            res.status(200).json({
                message: "Success",
                data: genre,
                books: `http://localhost/genres/${genreId}/books`,
            });
        } else {
            logger.warn(`Genre with ID: ${genreId} not found`)
            res.status(404).json({
                message: "Genre not found",
            });
        }
    } catch (error) {
        logger.error(`Error retrieving genre with ID ${genreId}: ${error.message}`, {stack: error.stack});
        res.status(400).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.createGenre = async (req, res) => {
    logger.info(`Received POST request on /genres`);
    try {
        const genre = await Genre.create(req.body);
        logger.info(`Genre created successfully`);
        res.status(201).json({
            message: "Genre created!",
            data: genre,
        });
    } catch (error) {
        logger.error(`Error creating genre: ${error.message}`, {stack: error.stack});
        res.status(400).json({
            message: "Bad Request",
            error: error.message,
        })
    }
}

exports.updateGenre = async (req, res) => {
    const genreId = req.params.id;
    logger.info(`Received PUT request on /genre/${genreId}`);

    try {
        const [updatedCount] = await Genre.update(req.body, {
            where: { id: genreId }
        });
        if(updatedCount > 0){
            logger.info(`Genre updated with ID: ${genreId} successfully`);
            res.status(200).json({
                message: "Genre updated successfully!",
            });
        } else {
            logger.warn(`Genre with ID: ${genreId} not found!`);
            res.status(404).json({
                message: "Genre not found",
            });
        }
    } catch (error) {
        logger.error(`Error updating genre with ID ${genreId}: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.deleteGenre = async (req, res) => {
    const genreId = req.params.id;
    logger.info(`Received DELETE request on /genres/${genreId}`);

    try {
        const deleted = await Genre.destroy({
            where: { id: genreId },
        });
        if (deleted) {
            logger.info(`Genre with ID ${genreId} deleted successfully!`);
            res.status(204).json({
                message: "Genre deleted successfully",
            });
        } else {
            logger.warn(`Genre with ID: ${genreId} not found`);
            res.status(404).json({
                message: "Genre not found",
            });
        }
    } catch (error) {
        logger.error(`Error deleting genre ID ${genreId}: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.getBooksForGenre = async (req, res) => {
    const genreId = req.params.id;
    logger.info(`Received GET request to fetch books for genre with ID: ${genreId}`);

    try {
        const genre = await Genre.findByPk(genreId, {
            include: Book
        });

        if(genre) {
            logger.info(`Successfully retrieved books for genre with ID: ${genreId}`);
            res.status(200).json({
                message: "Books fetched successfully!",
                data: genre.Books,
            });
        } else {
            logger.warn(`Genre with ID ${genreId} not found`);
            res.status(404).json({
                message: "Genre not found",
            });
        }
    } catch (error) {
        logger.error(`Error retrieving books for genre with ID ${genreId}: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}