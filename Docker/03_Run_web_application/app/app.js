const express = require('express');
const app = express();

app.get('/', (_, res) => {
  res.json({ status: 'ok', data: process.env });
});

// /greet?name=Joe
app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.json({ status: 'ok', data: name });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
