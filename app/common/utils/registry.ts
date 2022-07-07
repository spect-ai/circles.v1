import { Chain, Registry, Token } from "@/app/types";

export function getFlattenedNetworks(registry: Registry) {
  const networks: Array<Chain> = [];
  for (const networkId of Object.keys(registry)) {
    networks.push({
      name: registry[networkId].name,
      chainId: networkId,
    } as Chain);
  }
  return networks;
}

// export function getFlattenedTokens(registry: Registry, chainId: string) {
//   const tokens: Array<Token> = [];
//     for (const tokenAddress of Object.keys(registry[chainId].tokenDetails)) {
//       console.log({ tokenAddress });
//       tokens.push({
//         address: tokenAddress,
//         symbol: registry[chainId].tokenDetails[tokenAddress].symbol,
//         name: registry[chainId].tokenDetails[tokenAddress].name,
//       });
//     }
//   }
//   return tokens;
// }

export function getFlattenedCurrencies(registry: Registry, chainId: string) {
  if (!chainId) {
    return [];
  }
  //   const currencies = getFlattenedTokens(registry, chainId);
  const currencies = Object.values(registry[chainId].tokenDetails);
  // currencies = [...currencies, { symbol: registry[chainId].nativeCurrency }];
  return currencies;
}
