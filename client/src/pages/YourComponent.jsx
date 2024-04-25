import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: 'https://crypto-market-prices.p.rapidapi.com/tokens',
        params: { base: 'USDT' },
        headers: {
          'X-RapidAPI-Key': '3b6b9c60b2mshef89cf1e6eaa609p1835d5jsn6f3ccbfcf3a9',
          'X-RapidAPI-Host': 'crypto-market-prices.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const filteredTokens = response.data.data.tokens.filter(
          token => token.symbol === 'BTC' || token.symbol === 'ETH'
        );
        setTokenData({ ...response.data, tokens: filteredTokens });
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <div className="text-red-500">Error: {error.message}</div>}
      {tokenData && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Token Data:</h2>
          <p className="mb-2"><span className="font-bold">Base:</span> {tokenData.base}</p>
          <p className="mb-2"><span className="font-bold">Total:</span> {tokenData.total}</p>
          <h3 className="text-lg font-bold mb-2">Tokens:</h3>
          <ul>
            {tokenData.tokens.map(token => (
              <li key={token.symbol} className="border-b border-gray-200 py-2">
                <p className="mb-1"><span className="font-bold">Symbol:</span> {token.symbol}</p>
                <p><span className="font-bold">Price:</span> {token.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YourComponent;
