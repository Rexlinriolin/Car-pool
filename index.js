const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to VIT Chennai Carpool API');
});

// Registration route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if email already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Insert new user into the users table
      const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [name, email, password], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to register user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verify if the email and password match
    const loginQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(loginQuery, [email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Successful login
      res.status(200).json({ message: 'Login successful', user: result[0] });
    });
});

// Create a new carpool
/*app.post('/carpools', (req, res) => {
    const { driver_id, destination, departure_time, seats_available } = req.body;

    const insertQuery = 'INSERT INTO carpools (driver_id, destination, departure_time, seats_available) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [driver_id, destination, departure_time, seats_available], (err, result) => {
        if (err) {
            console.log(err); // Log the error for debugging
            return res.status(500).json({ error: 'Failed to create carpool' });
        }
        res.status(201).json({ message: 'Carpool created successfully', carpoolId: result.insertId });
    });
});*/
// Create a new carpool
app.post('/carpools', (req, res) => {
    const { driver_id, destination, departure_time, seats_available } = req.body;

    // Convert the ISO string to MySQL datetime format
    const departureTime = new Date(departure_time).toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery = 'INSERT INTO carpools (driver_id, destination, departure_time, seats_available) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [driver_id, destination, departureTime, seats_available], (err, result) => {
        if (err) {
            console.log(err); // Log the error for debugging
            return res.status(500).json({ error: 'Failed to create carpool' });
        }
        res.status(201).json({ message: 'Carpool created successfully', carpoolId: result.insertId });
    });
});


// Get all carpools
app.get('/carpools', (req, res) => {
    const selectQuery = 'SELECT * FROM carpools';
    db.query(selectQuery, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch carpools' });
      }
      res.status(200).json(results);
    });
});

// Join a carpool
app.post('/carpools/:id/join', (req, res) => {
    const carpoolId = req.params.id;

    // First, check if seats are available
    const checkQuery = 'SELECT seats_available FROM carpools WHERE id = ?';
    db.query(checkQuery, [carpoolId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: 'Carpool not found' });
      }

      const seatsAvailable = results[0].seats_available;
      if (seatsAvailable <= 0) {
        return res.status(400).json({ error: 'No seats available' });
      }

      // Decrease the seats available
      const updateQuery = 'UPDATE carpools SET seats_available = seats_available - 1 WHERE id = ?';
      db.query(updateQuery, [carpoolId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to join carpool' });
        }
        res.status(200).json({ message: 'Successfully joined carpool' });
      });
    });
});
app.post('/offer', (req, res) => {
    const { from, to, date, seats } = req.body;
    
    // Add your own logic for the driver_id, e.g., from the logged-in user session.
    const driver_id = 1; // Replace with actual logic
    
    const insertQuery = 'INSERT INTO carpools (driver_id, destination, departure_time, seats_available) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [driver_id, to, date, seats], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to offer ride' });
        }
        res.status(201).json({ message: 'Ride offered successfully', carpoolId: result.insertId });
    });
});
app.get('/search', (req, res) => {
    const { from, to, date } = req.query;

    // Query to search for rides that match the specified criteria
    const searchQuery = `
        SELECT * FROM carpools 
        WHERE departure_location = ? AND destination = ? AND DATE(departure_time) = ?
    `;

    db.query(searchQuery, [from, to, date], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to search rides' });
        }

        res.status(200).json(results);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
