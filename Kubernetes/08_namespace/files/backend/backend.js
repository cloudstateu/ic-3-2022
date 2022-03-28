const os = require("os");
const express = require('express');
const app = express();

app.use(express.json());
app.get('/info', (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    hostname: os.hostname()
  })
});

const port = 8080;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});