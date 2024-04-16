const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./config/db');
const route = require('./routes');
const { convertArrayToObjects } = require('./util/toObject');

const app = express();
const port = 3001;

// Custom CORS middleware
app.use(function (req, res, next) {
    // Allow requests from all origins
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Allow specific headers
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

    // Allow credentials (cookies, authorization headers)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Handle preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond with 200 OK for OPTIONS requests
    }

    // Pass control to the next middleware
    next();
});


// HTTP logger
app.use(morgan('dev'));

// Connect to Oracle database (user C##DOANDU)
db.connect();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Initialize routes
route(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
