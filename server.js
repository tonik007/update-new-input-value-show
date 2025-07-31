const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Form submission handler
app.post('/submit', (req, res) => {
  const { name, email, phone } = req.body;

  const newUser = { name, email, phone };
  let users = [];

  try {
    const data = fs.readFileSync('data.json', 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    users = [];
  }

  users.push(newUser);
  fs.writeFileSync('data.json', JSON.stringify(users, null, 2));

  res.redirect('/data.html');
});

// API route for data.html to fetch users
app.get('/get-data', (req, res) => {
  try {
    const data = fs.readFileSync('data.json', 'utf8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (err) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
