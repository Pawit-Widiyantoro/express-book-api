const { DataTypes } = require("sequelize");
const connection = require("../config/db");

const Book = connection.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cover: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports=Book;