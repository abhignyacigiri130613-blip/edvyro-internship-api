const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database('./internships.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  stipend TEXT,
  category TEXT
)`);

app.get('/api/internships', (req, res) => {
  db.all(`SELECT * FROM internships`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'success', data: rows });
  });
});

app.post('/api/internships', (req, res) => {
  const { title, company, location, stipend, category } = req.body;
  const sql = `INSERT INTO internships (title, company, location, stipend, category) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [title, company, location, stipend, category], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'success', id: this.lastID });
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Automatically test the POST route right after starting!
  try {
    const response = await fetch(`http://localhost:${PORT}/api/internships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "Frontend Developer Intern",
        company: "EdVyro",
        location: "Remote",
        stipend: "$600/mo",
        category: "Frontend"
      })
    });
    const data = await response.json();
    console.log("AUTOMATED POST TEST SUCCESS:", data);
  } catch (e) {
    console.log("Test error:", e.message);
  }
});