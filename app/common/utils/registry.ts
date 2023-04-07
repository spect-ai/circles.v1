import { Chain, Registry } from "@/app/types";

export function getFlattenedNetworks(registry: Registry) {
  if (!registry) return null;
  const networks: Array<Chain> = [];
  Object.keys(registry).forEach((networkId) => {
    networks.push({
      name: registry[networkId].name,
      chainId: networkId,
    } as Chain);
  });
  return networks;
}

export function getFlattenedCurrencies(registry: Registry, chainId: string) {
  if (!chainId || !registry) {
    return [];
  }
  //   const currencies = getFlattenedTokens(registry, chainId);
  const currencies = Object.values(registry[chainId].tokenDetails);
  // currencies = [...currencies, { symbol: registry[chainId].nativeCurrency }];
  return currencies;
}
