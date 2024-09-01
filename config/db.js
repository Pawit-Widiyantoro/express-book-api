const sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const connection = new sequelize.Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    }
);

// connection.authenticate()
//     .then(() => console.log("Connect to database!"))
//     .catch((err) => console.error("Unable to connect to databse", err));

module.exports=connection;