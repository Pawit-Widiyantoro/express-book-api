const express = require("express");
const { validationResult } = require("express-validator");
const authController = require("../controller/AuthController");
const { loginValidator, registerValidator } = require("../Validations/AuthValidation");
const router = express.Router();
const logger = require('../logger');

router.post("/register", registerValidator, (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        logger.error(`Validation error during registration: ${JSON.stringify(errors.array())}`);
        return res.status(400).json({ errors: errors.array() });
    }

    authController.register(req, res);
});

router.post("/login", loginValidator, (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        logger.error(`Validation error during login: ${JSON.stringify(errors.array())}`);
        res.status(400).json({ errors: errors.array() });
    }

    authController.login(req, res);
});

router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;