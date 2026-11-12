const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./internships.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create table and insert seed data if empty
db.run(`CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  stipend TEXT,
  category TEXT
)`, (err) => {
  if (!err) {
    db.get(`SELECT COUNT(*) as count FROM internships`, (err, row) => {
      if (row && row.count === 0) {
        db.run(`INSERT INTO internships (title, company, location, stipend, category) VALUES (?, ?, ?, ?, ?)`,
          ['Software Engineering Intern', 'EdVyro', 'Remote', '$500/mo', 'Engineering']);
      }
    });
  }
});

// GET endpoint to list internships
app.get('/api/internships', (req, res) => {
  db.all(`SELECT * FROM internships`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'success', data: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Serve the main frontend page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
