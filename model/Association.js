const Book = require("./Book");
const Genre = require("./Genre");

const setupAssociations = () => {
    Book.belongsToMany(Genre, {through: "BookGenres", foreignKey: "bookId"});
    Genre.belongsToMany(Book, {through: "BookGenres", foreignKey: "genreId"})
};

module.exports = setupAssociations;
