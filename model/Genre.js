const { DataTypes } = require("sequelize");
const connection = require("../config/db");

const Genre = connection.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports=Genre;