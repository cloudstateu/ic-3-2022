const express = require('express');
const cors = require('cors');
const axios = require('axios');
const os = require('os');

const app = express();
app.use(cors());

const FLAGS = [
  {
    code: 'USD',
    url:
      'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/440px-Flag_of_the_United_States.svg.png'
  },
  {
    code: 'EUR',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/250px-Flag_of_Europe.svg.png'
  },
  {
    code: 'GBP',
    url:
      'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/250px-Flag_of_the_United_Kingdom.svg.png'
  },
  {
    code: 'CHF',
    url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Civil_Ensign_of_Switzerland.svg/2560px-Civil_Ensign_of_Switzerland.svg.png'
  }
];

app.get('/prices/main', setLocals, async (_, res, next) => {
  try {
    const response = await axios.get('http://api.nbp.pl/api/exchangerates/tables/c?format=json');
    const data = response.data[0];
    const exchangeRates = data.rates
      .filter((o) => o.code === 'USD' || o.code === 'EUR' || o.code === 'GBP' || o.code === 'CHF')
      .map((o) => {
        return {
          from: 'PLN',
          to: o.code,
          buy: o.bid,
          sell: o.ask,
          flag: FLAGS.find((f) => f.code === o.code).url
        };
      });

    const updated = data.effectiveDate;

    res.json({
      ...res.locals,
      data: {
        prices: exchangeRates,
        updated
      }
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.get('/info', setLocals, (_, res) => {
  res.json({
    ...res.locals,
    data: null
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    status: 'error',
    data: {
      error: {
        message: error.message,
        stack: error.stack
      }
    },
    timestamp: new Date(),
    hostname: os.hostname()
  });
});

function setLocals(_, res, next) {
  res.locals = {
    status: 'ok',
    timestamp: new Date(),
    hostname: os.hostname()
  };
  next();
}

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Application is listening on port ${port}...`));
