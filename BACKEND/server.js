const express = require('express');
const database = require('./connection'); // Import MySQL connection
const app = express();
const PORT = 3000; // Use port 3000

// Middleware to parse JSON data from requests
app.use(express.json());

// Import and use the routes from the 'api' file
const REST = require('./routes/api');
app.use('/api', REST);

// Connect to the MySQL database
database.connect((err) => {
  if (err) {
    console.error('-> DATABASE NOT CONNECTED:', err.message);
  } else {
    console.log('-> DATABASE CONNECTED');
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`-> SERVER RUNNING ON http://localhost:${PORT}`);
});
