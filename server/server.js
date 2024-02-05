const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const {initializeWebSocketServer} = require('./controllers/webSocketHandler');
const app = express();
const server = http.createServer(app);

const mainRouter = require('./routes/mainRouter');



const port = 8080;

// Middleware to parse JSON data
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON data
app.use(mainRouter); // Your existing route handling code

// Pass the server instance to initializeWebSocketServer
const webSocketServer = initializeWebSocketServer(server);

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


// Default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/data', (req, res) => {
    // Handle the request and send back data
    res.json({ message: 'Hello from the server!' });
});

/* app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
}); */
module.exports = { webSocketServer };