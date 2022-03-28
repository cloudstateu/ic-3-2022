const os = require("os");
const express = require('express');
const axios = require("axios");
const app = express();

app.use(express.json());
const BACKEND_ENDPOINT_URL = process.env.BACKEND_ENDPOINT_URL; // ENV VAR zawiera wartość <svc-name>.<namespace>/info; ENV VAR ustawiany przez Config Map

app.get('/', async (req, res) => {
  const response = await axios.get(BACKEND_ENDPOINT_URL)
  res.json({
    status: "ok",
    data: response.data,
    hostname: os.hostname()
  });
});
const port = 8080;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
