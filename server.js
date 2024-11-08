const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Samsungs23!',
  database: 'car_pool'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware to parse JSON requests
app.use(express.json());

// Basic route to get all users
app.get('/users', (req, res) => {
  console.log('Received GET request on /users');
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).send('Server error');
      return;
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Route to add a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  console.log('Received POST request on /users with data:', req.body);
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).send('Server error');
      return;
    }
    console.log('Inserted user with ID:', result.insertId);
    res.json({ id: result.insertId, name, email });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

