const express = require("express");
const logger = require("./logger");
const bookRoutes = require("./routes/bookRouter");
const genreRoutes = require("./routes/genreRouter");
const authRoutes = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoutes);
app.use("/books", bookRoutes);
app.use("/genres", genreRoutes);

app.listen(PORT, () => {
    logger.info(`Server started at port ${PORT}`);
});