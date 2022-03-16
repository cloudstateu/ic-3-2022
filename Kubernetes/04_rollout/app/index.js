const express = require('express');

const app = express();
app.set('view engine', 'pug');

app.get('/', (_, res) => {
  const version = '3.0.0';

  res.setHeader('X-Version', version);
  res.render('index', { version });
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Application is listening on port ${port}...`));
