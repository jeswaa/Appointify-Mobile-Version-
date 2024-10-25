const express = require('express');
const route = express.Router();
const database = require('../connection'); // Importing the MySQL connection

// Route for testing the API
route.get('/', (req, res) => {
  res.send('API is working'); // Simple response to verify if the backend is working
});

// Route to handle user login
route.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query to check if the user exists and fetch the hashed password
  const query = 'SELECT username, password FROM tblsignup WHERE username = ?';
  
  database.query(query, [username], (error, results) => {
    if (error) {
      console.error('Database Error:', error.message);
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }

    if (results.length > 0) {
      // User exists, now check the password
      const hashedPassword = results[0].password;

      // Compare the provided password with the hashed password
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err.message);
          return res.status(500).json({ success: false, message: 'Server error', error: err.message });
        }

        if (isMatch) {
          // Passwords match, redirect to homepage
          res.redirect('/homepage'); // Change '/homepage' to your actual homepage route
        } else {
          res.status(401).json({ success: false, message: 'Invalid password.' });
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username.' });
    }
  });
});

// Route to handle user signup
route.post('/signup', (req, res) => {
  const { fullname, username, password, address, phonenumber, email, gender, google_id, uploadimage } = req.body;

  // Hash the password before storing it
  // Assuming bcrypt is still imported and used for hashing passwords
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO tblsignup (fullname, username, password, address, phonenumber, email, gender, google_id, uploadimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  database.query(query, [fullname, username, hashedPassword, address, phonenumber, email, gender, google_id, uploadimage], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Database insertion failed.' });
    }
    res.status(200).json({ message: 'Signup successful!' });
  });
});

// Route to fetch all users (optional)
route.get('/users', (req, res) => {
  const query = 'SELECT * FROM tblsignup';

  database.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users.' });
    }
    res.status(200).json(results);
  });
});

module.exports = route;
