import React, { useState, useEffect, FunctionComponent } from 'react';
import { Row, Col, Skeleton } from 'antd';
import config from '../config';

const CurrencyPricesPage = () => {
  const [ prices, setPrices ] = useState(null);
  const [ updated, setUpdated ] = useState(null);

  useEffect(() => {
    const getPrices = async () => {
      try {
        const response = await fetch(`${config.BACKEND_URL}/prices/main`);
        const json = await response.json();
        setPrices(json.data.prices);
        setUpdated(json.data.updated);
      } catch (err) {
        console.log(err);
      }
    };

    getPrices();
  }, []);

  return (
    <React.Fragment>
      <h1>Kursy walut</h1>
      <CurrencyPricesList loading={!prices} prices={prices} />
      <Skeleton loading={!prices} paragraph={false}>
        <span className="small">Ostatnia aktualizacja cen: {updated}</span>
      </Skeleton>
    </React.Fragment>
  );
};

const CurrencyPricesList: FunctionComponent<SkeletonProps & { prices: CurrencyPriceProps[] | null }> = ({
  loading,
  prices
}) => {
  let elements = [
    <CurrencyPrice loading={true} price={null}/>,
    <CurrencyPrice loading={true} price={null}/>,
    <CurrencyPrice loading={true} price={null}/>,
    <CurrencyPrice loading={true} price={null}/>
  ];

  if (prices) {
    elements = prices.map((price) => {
      return <CurrencyPrice loading={loading} price={price} key={price.to} />;
    });
  }

  return (
    <Row style={{ display: 'flex', flexDirection: 'row', margin: '50px 0' }}>
      {elements}
    </Row>
  );
};

type SkeletonProps = {
  loading: boolean;
};

type CurrencyPriceProps = {
  from: string;
  to: string;
  buy: number;
  sell: number;
  flag: string;
};

const CurrencyPrice: FunctionComponent<SkeletonProps & { price: CurrencyPriceProps | null }> = ({ loading, price }) => {
  return (
    <Col
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 25px'
      }}
    >
      <Skeleton loading={loading}>
        <img src={price?.flag} style={{ width: 100, height: 66, backgroundColor: '#aaa', marginBottom: 20 }} alt={price?.to} />
        <h3>
          {price?.to.toUpperCase()}/{price?.from.toUpperCase()}
        </h3>
        <div>
          <p>Bank kupuje:</p>
          <p>{price?.buy}</p>
          <p>Bank sprzedaje:</p>
          <p>{price?.sell}</p>
        </div>
      </Skeleton>
    </Col>
  );
};

export default CurrencyPricesPage;
