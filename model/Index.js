const connection = require("../config/db");
const logger = require("../logger");

const Book = require("./Book");
const Genre = require("./Genre");
const User = require("./User");
const setupAssociations = require("./Association");

setupAssociations();

(async() => {
    try {
        await connection.sync({ alter: true });
        logger.info("Database synchronized!");
    } catch (error) {
        logger.error(`Error synchronizing database ${error}`);
    }
})();

module.exports = {
    Book,
    Genre,
    User,
};