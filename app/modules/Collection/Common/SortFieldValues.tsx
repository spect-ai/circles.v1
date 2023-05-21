import {
  getMultipleCurrencyPrices,
  getMultipleTokenPrices,
} from "@/app/services/CoinGecko";
import { CollectionType, Property, Registry } from "@/app/types";

export function sortRewardBasedOnValue(
  data: any,
  propertyId: string,
  ascOrDesc: "asc" | "desc",
  sortOn = "value"
) {
  return data?.sort((a: any, b: any) => {
    const aVal = a?.[propertyId]?.[sortOn];
    const bVal = b?.[propertyId]?.[sortOn];
    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;
    if (ascOrDesc === "asc") {
      return parseFloat(aVal) - parseFloat(bVal);
    } else {
      return parseFloat(bVal) - parseFloat(aVal);
    }
  });
}

export async function getSortedRewardBasedOnTokenPriceValues(
  registry: Registry,
  data: any,
  propertyId: string,
  ascOrDesc: "asc" | "desc",
  uniqueTokens: any,
  chainsWithCurrencies: string[]
) {
  const tokenPrices = {} as {
    [chainId: string]: {
      [tokenAddress: string]: number;
    };
  };
  for (const [chainId, tokens] of Object.entries(uniqueTokens || {})) {
    const tokenString = (tokens as string[]).join(",");
    const platformId = registry?.[chainId]?.coinGeckoPlatformId;
    if (platformId) {
      const res = (await getMultipleTokenPrices(tokenString, platformId)) as {
        [tokenAddress: string]: {
          [currency: string]: number;
        };
      };
      for (const [tokenAddress, priceData] of Object.entries(res)) {
        if (!tokenPrices[chainId]) tokenPrices[chainId] = {};
        tokenPrices[chainId][tokenAddress] = priceData?.["usd"] || 0;
      }
    }
  }

  const currencyIds = chainsWithCurrencies.map(
    (chainId) => registry?.[chainId]?.coinGeckoCurrencyId
  );
  const res = await getMultipleCurrencyPrices(currencyIds.join(","));
  if (res) {
    for (const chainId of chainsWithCurrencies) {
      const value = res[registry?.[chainId]?.coinGeckoCurrencyId]?.["usd"];
      console.log({ value });
      tokenPrices[chainId] = {
        ...(tokenPrices[chainId] || {}),
        ["0x0"]: value,
      };
    }
  }

  const rewardData = data?.map((d: any) => {
    const chainId = d?.[propertyId]?.chain?.value;
    const tokenAddress = d?.[propertyId]?.token?.value;
    const tokenPrice = tokenPrices?.[chainId]?.[tokenAddress];
    const value = d?.[propertyId]?.value;
    const reward = tokenPrice ? tokenPrice * value : value;

    return {
      ...d,
      [propertyId]: {
        ...d?.[propertyId],
        totalPrice: reward,
      },
    };
  });

  console.log({ rewardData });
  return sortRewardBasedOnValue(
    rewardData,
    propertyId,
    ascOrDesc,
    "totalPrice"
  );
}

export async function sortFieldValues(
  data: any,
  collection: CollectionType,
  propertyId: string,
  ascOrDesc: "asc" | "desc",
  registry?: Registry
) {
  const property = collection.properties[propertyId];
  switch (property.type) {
    case "shortText":
    case "longText":
      return data?.sort((a: any, b: any) => {
        const aVal = a?.[propertyId];
        const bVal = b?.[propertyId];
        console.log({ aVal, bVal });
        if ((!aVal || a?.length === 0) && (!bVal || b?.length === 0)) return 0;
        if (!aVal || a?.length === 0) return 1;
        if (!bVal || b?.length === 0) return -1;
        if (ascOrDesc === "asc") {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      });
    case "number":
    case "slider":
      return data?.sort((a: any, b: any) => {
        const aVal = a?.[propertyId];
        const bVal = b?.[propertyId];
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        if (ascOrDesc === "asc") {
          return parseFloat(aVal) - parseFloat(bVal);
        } else {
          return parseFloat(bVal) - parseFloat(aVal);
        }
      });
    case "singleSelect":
      const optionIndexes = collection.properties[propertyId].options?.reduce(
        (acc: any, option: any, index: number) => {
          acc[option.value] = index;
          return acc;
        },
        {}
      );
      return data.sort((a: any, b: any) => {
        const aVal = optionIndexes[a?.[propertyId]?.value];
        const bVal = optionIndexes[b?.[propertyId]?.value];
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        if (ascOrDesc === "asc") {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
    case "date":
      return data?.sort((a: any, b: any) => {
        const aVal = a?.[propertyId];
        const bVal = b?.[propertyId];
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        if (ascOrDesc === "asc") {
          return new Date(aVal).getTime() - new Date(bVal).getTime();
        } else {
          return new Date(bVal).getTime() - new Date(aVal).getTime();
        }
      });

    case "reward":
      if (!registry) return sortRewardBasedOnValue(data, propertyId, ascOrDesc);
      let totalUniqueTokens = 0;
      const chainsWithCurrencies = [] as string[];
      const uniqueTokens = Object.values(data || {})?.reduce(
        (acc: any, val: any) => {
          if (val?.[propertyId]?.value) {
            const chainId = val?.[propertyId]?.chain?.value;
            const tokenAddress = val?.[propertyId]?.token?.value;
            if (chainId && tokenAddress) {
              if (!acc[chainId]) {
                acc[chainId] = [];
              }
              if (tokenAddress === "0x0") {
                chainsWithCurrencies.push(chainId);
                totalUniqueTokens += 1;
              } else if (!acc[chainId].includes(tokenAddress)) {
                acc[chainId].push(tokenAddress);
                totalUniqueTokens += 1;
              }
            }
          }
          return acc;
        },
        {}
      );

      if (totalUniqueTokens === 0)
        return sortRewardBasedOnValue(data, propertyId, ascOrDesc);

      try {
        const res = await getSortedRewardBasedOnTokenPriceValues(
          registry,
          data,
          propertyId,
          ascOrDesc,
          uniqueTokens,
          chainsWithCurrencies
        );
        return res;
      } catch (err) {
        console.log({ err });
        return sortRewardBasedOnValue(data, propertyId, ascOrDesc);
      }
    default:
      return data;
  }
}
