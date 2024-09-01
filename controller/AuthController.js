const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../model/Index");
const logger = require("../logger");

require("dotenv").config();

// register route
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            logger.error(`User with email: ${email} already exist`);
            return res.status(400).json({ message: "User already exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        user = await User.create({ email: email, password: hashedPass });
        logger.info(`User registered successfully!`);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        logger.error(`Error registering user: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// login route
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.error(`Login failed: Invalid email ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.error(`Login failed: Invalid password for email ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email,
            }
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        await user.update({ refreshToken: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "Successfully log in",
            accessToken,
        });
    } catch (error) {
        logger.error(`Server Error: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// refresh
exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.error("No refresh token provided in cookies.");
            return res.sendStatus(401);
        }

        const user = await User.findOne({ where: { refreshToken } });
        if (!user) {
            console.error("No user found with the provided refresh token.");
            return res.sendStatus(403);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification failed.", err);
                return res.sendStatus(403);
            }

            const userId = user.id;
            const userEmail = user.email;

            const accessToken = jwt.sign({ userId, userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            res.json({ accessToken });
        });
    } catch (error) {
        logger.error(`Server Error: ${error.message}`, {stack: error.stack});
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// logout
exports.logout = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}