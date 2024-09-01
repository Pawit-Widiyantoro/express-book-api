const { Book, Genre } = require("../model/Index")
const logger = require("../logger");
const upload = require("../middleware/uploadMiddleware");

exports.getAllBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const offset = page * limit;

    logger.info(`Received GET request on /books - Page: ${page}, Limit: ${limit}`);

    if(isNaN(page) || page < 0 || isNaN(limit) || limit <= 0){
        logger.warn(`Invalid page or limit numbers: Page = ${page}, Limit = ${limit}`)
        return res.status(400).json({
            message: "Invalid page or limit numbers",
        });
    }

    try {
        const books = await Book.findAll({
            limit: limit,
            offset:offset,
            include: Genre,
        });
        logger.info(`Successfully retrieved books - Page: ${page}, Limit: ${limit}`)
        res.status(200).json({
            message: "Success",
            page: page,
            limit: limit,
            data: books
        });
    } catch (error) {
        logger.error(`Error retrieving books: ${error.message}`, {stack: error.stack})
        res.status(500).json({
            message:"Internal Server Error", 
            error: error.message
        });
    }
}

exports.getBookById = async (req, res) => {
    const bookId = parseInt(req.params.id);
    logger.info(`Received GET request on /books/${bookId}`)

    try {        
        const book = await Book.findByPk(bookId, {
            include: Genre,
        });
        if(book) {
            logger.info(`Successfully retrieved book with ID: ${bookId}`)
            res.status(200).json({
                message: "Success",
                data: book,
            });
        } else {
            logger.warn(`Book not found with ID: ${bookId}`)
            res.status(404).json({
                message:"Book not found"
            });
        }
    } catch (error) {
        logger.error(`Error retrieving books with ID ${bookId}: ${error.message}`, {stack: error.stack})
        res.status(500).json({
            message:"Internal server error", 
            error:error.message
        });
    }
}

exports.createBook = [
    upload.single("cover"),
    async (req, res) => {
        logger.info(`Received POST request on /books`);
        try {
            const { genreIds, ...bookData } = req.body;

            const book = await Book.create({
                ...bookData,
                cover: req.file ? req.file.path : null,
            });

            if(genreIds && genreIds.length > 0) {
                const genres = await Genre.findAll({
                    where: {id: genreIds}
                });
                await book.addGenres(genres);
            }

            logger.info(`Book created succesfully with ID: ${book.id}`);
            res.status(201).json({
                message: "Book created succesfully!",
                data: book
            });
        } catch (error) {
            logger.error(`Error creating book: ${error.message}`, {stack: error.stack})
            res.status(400).json({
                message: "Bad Request", 
                error: error.message
            });
        }
    }
];

exports.updateBook = async (req, res) => {
    const bookId = parseInt(req.params.id);
    logger.info(`Received PUT request on /books/${bookId}`);

    try {        
        const {genreIds, bookData} = req.body;
        const [updatedCount] = await Book.update(bookData, {
            where: {id: bookId}
        });
        if(updatedCount > 0) {
            const book = await Book.findByPk(bookId);

            if (genreIds && genreIds.length > 0) {
                const genres = await Genre.findAll({
                    where: { id: genreIds }
                });
                await book.setGenres(genres);
            }
            
            logger.info(`Book updated successfully with ID: ${bookId}`)
            res.json({
                message: "Book updated successfully!"
            });
        } else{
            logger.warn(`Book not found with ID: ${bookId}`);
            res.status(404).json({
                message:"Book not found"
            });
        }
    } catch (error) {
        logger.error(`Error updating book with ID ${bookId}: ${error.message}`, {stack:error.stack});
        res.status(500).json({
            message: "Internal server error", 
            error: error.message
        });
    }
}

exports.deleteBook = async (req, res) => {
    const bookId = parseInt(req.params.id);
    logger.info(`Received DELETE request on /books/${bookId}`);

    try {        
        const deleted = await Book.destroy({
            where: { id: bookId },
        });
        if (deleted){
            logger.info(`Book deleted successfully with ID: ${bookId}`);
            res.status(204).json({
                message: "Book deleted succesfully!"
            });
        } else {
            logger.warn(`Book not found with ID: ${bookId}`);
            res.status(404).json({
                message:"Book not found"
            });
        }
    } catch (error) {
        logger.error(`Error deleting book with ID ${bookId}: ${error.message}`, {stack:error.stack});
        res.status(500).json({
            message:"Internal Server Error", 
            error: error.message
        });
    }
}