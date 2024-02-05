require('dotenv').config()
const jwt = require('jsonwebtoken');
const ActiveToken = require('../models/active_token');

const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        // Check if the token is still active in your database
        ActiveToken.findOne({ token: token })
            .then((activeToken) => {
                if (!activeToken) {
                    return res.sendStatus(401); // Unauthorized if the token is not found or expired
                }
                // Token is valid and active, proceed with the request
                req.user = decodedToken; // Attach the user information to the request if needed
                next();
            })
            .catch((error) => {
                console.error(error);
                res.sendStatus(500); // Internal Server Error
            });
    });
};

module.exports = { validateToken };