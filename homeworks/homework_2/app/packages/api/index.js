const express = require('express');
const cors = require('cors');
const axios = require('axios');
const os = require('os');
const { Client } = require('pg');

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
    const data = await getExchangeRates();
    const exchangeRates = data.map((o) => {
      return {
        from: o.currency_from,
        to: o.currency_to,
        buy: o.buy,
        sell: o.sell,
        flag: FLAGS.find((f) => f.code === o.currency_to).url
      };
    });

    const updated = data[0].effective_date;

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

app.get('/health', (_, res) => {
  res.sendStatus(200);
});

app.get('/ready', async (_, res) => {
  try {
    const result = await execute('SELECT NOW()');

    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
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

async function getExchangeRates() {
  const query = `WITH newest_rates AS (
      SELECT
        currency_from, currency_to, MAX(created_on) as created_on
      FROM exchangerates
      GROUP BY currency_from, currency_to
    )
    SELECT er.currency_from, er.currency_to, er.buy, er.sell, er.effective_date
    FROM exchangerates er
      JOIN newest_rates nr on
        nr.currency_from = er.currency_from
        AND nr.currency_to = er.currency_to
        AND nr.created_on = er.created_on
    WHERE er.currency_to in ('USD', 'EUR', 'GBP', 'CHF');`;

  return execute(query);
}

async function execute(query, values = []) {
  const client = new Client({
    ssl: true,
    statement_timeout: 5000,
    query_timeout: 5000,
    connectionTimeoutMillis: 5000,
    idle_in_transaction_session_timeout: 5000
  });

  try {
    await client.connect();

    const result = await client.query(query, values);

    return result.rows;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await client.end();
  }
}

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Application is listening on port ${port}...`));
