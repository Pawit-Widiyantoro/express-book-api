const jwt = require("jsonwebtoken");

require("dotenv").config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const auth = (req, res, next) => {
    const accessToken = req.header('Authorization').replace('Bearer ', '');
    if (!accessToken) {
        return res.status(401).json({
            message: "No token, authorization denied",
        });
    }

    try {
        const decoded = jwt.verify(accessToken, accessTokenSecret);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
}

module.exports = auth;