const axios = require('axios');
const { Client } = require('pg');
const { DateTime } = require('luxon');

(async () => {
  const client = new Client({
    ssl: true,
    statement_timeout: 5000,
    query_timeout: 5000,
    connectionTimeoutMillis: 5000,
    idle_in_transaction_session_timeout: 5000
  });

  try {
    const response = await axios.get('http://api.nbp.pl/api/exchangerates/tables/c?format=json');
    const data = response.data[0];
    const rates = data.rates || [];

    const query =
      'INSERT INTO exchangerates(currency_from, currency_to, buy, sell, effective_date) VALUES ($1, $2, $3, $4, $5);';

    await client.connect();

    for (let exchangeRate of rates) {
      await client.query(query, [
        'PLN',
        exchangeRate.code,
        exchangeRate.bid,
        exchangeRate.ask,
        DateTime.fromISO(data.effectiveDate)
      ]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
})();
