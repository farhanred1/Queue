const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const User = require('./models/user');

const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

const dbURI = 'mongodb://127.0.0.1:27017/Queue';

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

// In-memory storage for OTPs
const otpStorage = {};

// WebSocket connection handling
wss.on('connection', async (ws) => {
  console.log('WebSocket connection established');

  // Get the initial user count from the database
  const initialUserCount = await User.countDocuments();
  ws.send(JSON.stringify({ userCount: initialUserCount }));

  // Handle messages from clients
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Handle closing of the WebSocket connection
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// API endpoint to validate phone number and create a new user
app.post('/user/create', async (req, res) => {
  try {
    // Extract phone_no and otp from the request body
    const { phone_no, otp } = req.body;

    // Check if the phone number already exists in the collection
    const existingUser = await User.findOne({ phone_no });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Validate OTP
    const storedOtp = otpStorage[phone_no];
    if (!storedOtp || otp !== storedOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Create a new user instance
    const newUser = new User({
      phone_no: phone_no,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Remove the used OTP from storage
    delete otpStorage[phone_no];

    // Get the updated user count from the database
    const updatedUserCount = await User.countDocuments();

    // Broadcast the updated user count to all WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ userCount: updatedUserCount }));
      }
    });

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/posts', authenticateToken, (req, res) => {
  console.log(refreshTokens)
  res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
  })
}

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: user.name })
      res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', async (req, res) => {

  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
      return res.status(400).send('Cannot find user')
  }
  try {
      if (await bcrypt.compare(req.body.password, user.password)) {

          const accessToken = generateAccessToken({ name: user.name })
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
          refreshTokens.push(refreshToken)
          res.json({ accessToken: accessToken, refreshToken: refreshToken })

      } else {
          res.status(401).send('Invalid password')
      }
  } catch {
      res.status(500).send()
  }

})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}


// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
