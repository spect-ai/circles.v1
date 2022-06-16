import { Registry, Token } from "@/app/types";
import { Chain } from "wagmi";

export const labelsMapping = {
  Design: "rgb(46, 93, 170, 0.4)",
  Coding: "rgb(240, 98, 146, 0.4)",
  Quality: "rgb(255, 193, 7, 0.4)",
  Github: "rgb(255, 152, 0, 0.4)",
  POC: "rgb(102, 187, 106, 0.4)",
  Bug: "rgb(255,0,0,0.4)",
  Idea: "rgb(190, 234, 134,0.4)",
  Feature: "rgb(71, 69, 179,0.4)",
  Enhancement: "rgb(8, 213, 215,0.4)",
  Integration: "rgb(255, 255, 255,0.4)",
  Marketing: "rgb(116, 166, 214,0.4)",
  Documentation: "rgb(255, 255, 155,0.4)",
  Deployment: "rgb(192, 31, 98,0.4)",
  Testing: "rgb(254, 254, 254,0.4)",
};

export const reorder = (
  list: string[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// export function formatTime(date: Date) {
//   let hours = date.getHours();
//   let minutes = date.getMinutes();
//   const ampm = hours >= 12 ? "pm" : "am";
//   hours %= 12;
//   hours = hours || 12; // the hour '0' should be '12'
//   minutes = `0${minutes}`.slice(-2);
//   const strTime = `${hours}:${minutes} ${ampm}`;
//   return strTime;
// }

// export function getFlattenedNetworks(registry: Registry) {
//   const networks: Array<Chain> = [];

//   for (const networkId of Object.keys(registry)) {
//     networks.push({
//       name: registry[networkId].name,
//       chainId: networkId,
//     } as Chain);
//   }
//   return networks;
// }

export function getFlattenedTokens(registry: Registry, chainId: string) {
  const tokens: Array<Token> = [];
  if (registry[chainId]?.tokenAddresses) {
    for (const tokenAddress of registry[chainId].tokenAddresses) {
      tokens.push({
        address: tokenAddress,
        symbol: registry[chainId].tokens[tokenAddress].symbol,
      });
    }
  }
  return tokens;
}

export function getFlattenedCurrencies(registry: Registry, chainId: string) {
  const currencies = getFlattenedTokens(registry, chainId);
  // currencies = [...currencies, { symbol: registry[chainId].nativeCurrency }];
  return currencies;
}

export function downloadCSV(content: Array<Array<any>>, filename: string) {
  const csvContent = `data:text/csv;charset=utf-8,${content
    .map((e) => e.join(","))
    .join("\n")}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();
}
