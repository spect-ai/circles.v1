export const getCurrencyPrice = async (token: string) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
  );
  const data = await response.json();
  return data[token]?.usd;
};

export const getPlatformTokenPrice = async (
  tokenAddress: string,
  platformId: string,
) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
  );
  const data = await response.json();
  return data[tokenAddress.toLowerCase()]?.usd;
};
