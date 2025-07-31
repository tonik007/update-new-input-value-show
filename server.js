const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let dataFile = 'data.json';

// Submit new user
app.post('/submit', (req, res) => {
  const { name, email, phone } = req.body;
  const newUser = { name, email, phone };
  let users = [];

  try {
    users = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    users = [];
  }

  users.push(newUser);
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  res.json({ success: true, message: "সফলভাবে জমা হয়েছে!" });
});

// Get all users
app.get('/get-data', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.json([]);
  }
});

// ✅ Delete a user by email
app.post('/delete-user', (req, res) => {
  const { email } = req.body;

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    return res.json({ success: false, message: "ডেটা পড়া যায়নি।" });
  }

  const updatedUsers = users.filter(user => user.email !== email);
  fs.writeFileSync(dataFile, JSON.stringify(updatedUsers, null, 2));

  res.json({ success: true, message: "ডিলিট সফল হয়েছে।" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
