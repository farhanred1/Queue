require('dotenv').config()
const cors = require('cors');
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ActiveToken = require('./models/active_token');
const Admin = require('./models/admin');
const connectDb = require('./config/db');


const app = express()
app.use(cors());
connectDb();
app.use(express.json())


app.delete('/logout', async (req, res) => {
    try {
        await ActiveToken.deleteOne({ token: req.body.token });
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        // Handle error
        res.status(500).send('Internal Server Error');
    }
});


app.post('/api2/login', async (req, res) => {
    console.log(req.body)
    const user = await Admin.findOne({ username: req.body.username });

    if (user == null) {
        console.log("[/api2/login] cannot find user")
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken({ _id: user._id });
            const activeToken = new ActiveToken({
                token: accessToken,
                userId: user._id,
            });

            activeToken.save();
            console.log("success")
            res.json({ token: accessToken });
        } else {
            res.status(401).send('Invalid password');
        }
    } catch {
        res.status(500).send();
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

app.listen(8082)