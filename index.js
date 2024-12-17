const express = require('express');
const app = express();
const PORT = 4000;

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

app.get('/', (req, res) => {
  res.status(200).json('Welcome Home');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;