import { MemberDetails, PaymentDetails, Registry } from "@/app/types";
import {
  fetchSigner,
  fetchBalance,
  ReadContractConfig,
  readContracts,
  switchNetwork as switchNet,
  getNetwork,
} from "@wagmi/core";
import { BigNumber, ethers, Signer } from "ethers";
import { erc20ABI } from "wagmi";
import DistributorABI from "@/app/common/contracts/mumbai/distributor.json";

type WagmiBalanceObject = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: BigNumber;
};

export const getUniqueNetworks = (
  pendingPayments: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails }
) => {
  const networks = pendingPayments.reduce((acc, paymentId) => {
    const network = paymentDetails[paymentId].chain?.value;
    if (network && paymentDetails[paymentId].value) {
      acc.add(network);
    }
    return acc;
  }, new Set<string>());
  return Array.from(networks);
};

export const findPendingPaymentsByNetwork = (
  chainId: string,
  pendingPayments: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails }
) => {
  return pendingPayments.filter(
    (p) => paymentDetails[p].chain?.value === chainId
  );
};

export const getUniqueTokens = (
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails }
) => {
  const tokens = paymentIds.reduce((acc, paymentId) => {
    const token = paymentDetails[paymentId].token?.value;
    if (token && paymentDetails[paymentId].value) {
      acc.add(token);
    }
    return acc;
  }, new Set<string>());
  return Array.from(tokens);
};

export const findAggregatedAmountForEachUser = (
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails },
  memberDetails: MemberDetails
) => {
  const aggregatedAmounts = {} as { [ethAddress: string]: number };

  paymentIds.forEach((paymentId) => {
    if (paymentDetails[paymentId].value) {
      paymentDetails[paymentId].paidTo.forEach((p) => {
        let ethAddress = "";
        if (p.propertyType === "user") {
          ethAddress = memberDetails.memberDetails[p.value].ethAddress;
        } else if (p.propertyType === "address") {
          ethAddress = p.value;
        }
        if (aggregatedAmounts[ethAddress]) {
          aggregatedAmounts[ethAddress] += paymentDetails[paymentId].value;
        } else aggregatedAmounts[ethAddress] = paymentDetails[paymentId].value;
      });
    }
  });

  return aggregatedAmounts;
};

export const findAggregatedAmountForEachUserByToken = (
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails },
  memberDetails: MemberDetails
) => {
  const aggregatedAmounts = {} as {
    [ethAddress: string]: { [token: string]: number };
  };

  paymentIds.forEach((paymentId) => {
    paymentDetails[paymentId].paidTo.forEach((p) => {
      let ethAddress = "";
      if (p.propertyType === "user") {
        ethAddress = memberDetails.memberDetails[p.value].ethAddress;
      } else if (p.propertyType === "address") {
        ethAddress = p.value;
      }
      if (p.reward?.value)
        if (aggregatedAmounts[ethAddress]) {
          if (aggregatedAmounts[ethAddress][p.reward.token.value]) {
            aggregatedAmounts[ethAddress][p.reward.token.value] +=
              p.reward.value;
          } else {
            aggregatedAmounts[ethAddress][p.reward.token.value] =
              p.reward.value;
          }
        } else {
          aggregatedAmounts[ethAddress] = {
            [p.reward.token.value]: p.reward.value,
          };
        }
    });
  });

  return aggregatedAmounts;
};

export const flattenAmountByEachUniqueTokenAndUser = (
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails },
  memberDetails: MemberDetails
) => {
  const aggregatedAmountForEachUserByToken =
    findAggregatedAmountForEachUserByToken(
      paymentIds,
      paymentDetails,
      memberDetails
    );
  const flattenedAmounts = [] as {
    ethAddress: string;
    token: string;
    amount: number;
  }[];

  Object.keys(aggregatedAmountForEachUserByToken).forEach((ethAddress) => {
    Object.keys(aggregatedAmountForEachUserByToken[ethAddress]).forEach(
      (token) => {
        flattenedAmounts.push({
          ethAddress,
          token,
          amount: aggregatedAmountForEachUserByToken[ethAddress][token],
        });
      }
    );
  });

  return flattenedAmounts;
};

export const filterTokenPayments = (
  amounts: { ethAddress: string; token: string; amount: number }[]
) => {
  return amounts.filter((a) => a.token !== "0x0");
};

export const filterCurrencyPayments = (
  amounts: { ethAddress: string; token: string; amount: number }[]
) => {
  return amounts.filter((a) => a.token === "0x0");
};

export const findAggregatedAmountForEachToken = (
  amounts: { ethAddress: string; token: string; amount: number }[]
) => {
  const aggregatedAmounts = {} as { [token: string]: number };

  amounts.forEach((a) => {
    if (aggregatedAmounts[a.token]) {
      aggregatedAmounts[a.token] += a.amount;
    } else aggregatedAmounts[a.token] = a.amount;
  });

  return aggregatedAmounts;
};

export const hasBalances = (
  chainId: string,
  callerAddress: string,
  aggregatedAmounts: { [tokenAddress: string]: number }
) => {
  const hasBalance = {} as { [tokenAddress: string]: boolean };
  Object.keys(aggregatedAmounts).map(async (tokenAddress) => {
    let balanceObj: WagmiBalanceObject;
    if (tokenAddress === "0x0") {
      balanceObj = await fetchBalance({
        addressOrName: callerAddress,
        chainId: parseInt(chainId),
      });
    } else {
      balanceObj = await fetchBalance({
        addressOrName: callerAddress,
        token: tokenAddress,
        chainId: parseInt(chainId),
      });
    }
    hasBalance[tokenAddress] = ethers.BigNumber.from(
      Math.ceil(aggregatedAmounts[tokenAddress])
    )
      .mul(ethers.BigNumber.from(10).pow(balanceObj.decimals))
      .lte(balanceObj.value);
  });
  return hasBalance;
};

export const filterTokensByAllowanceOrBalance = (
  chainId: string,
  hasAllowanceOrBalance: {
    [tokenAddress: string]: boolean;
  },
  registry: Registry,
  getTrueValues = true
) => {
  const tokens = [] as { tokenAddress: string; symbol: string }[];
  Object.keys(hasAllowanceOrBalance).map((tokenAddress) => {
    if (
      getTrueValues
        ? hasAllowanceOrBalance[tokenAddress]
        : !hasAllowanceOrBalance[tokenAddress]
    ) {
      if (tokenAddress !== "0x0")
        tokens.push({
          tokenAddress,
          symbol: registry[chainId].tokenDetails[tokenAddress].symbol,
        });
      else
        tokens.push({
          tokenAddress,
          symbol: registry[chainId].nativeCurrency,
        });
    }
  });
  return tokens;
};

export const hasAllowance = async (
  registry: Registry,
  chainId: string,
  callerAddress: string,
  allowancesRequired: { [tokenAddress: string]: number }
) => {
  const hasAllowance = {} as { [tokenAddress: string]: boolean };
  const reads = [] as ReadContractConfig[];
  console.log({ allowancesRequired });
  Object.keys(allowancesRequired).map((tokenAddress) => {
    if (tokenAddress !== "0x0")
      reads.push({
        chainId: parseInt(chainId),
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: "allowance",
        args: [callerAddress, registry[chainId].distributorAddress],
      });
  });
  try {
    const data = await readContracts({
      contracts: reads,
    });
    console.log({ data });

    Object.keys(allowancesRequired).map((tokenAddress, index) => {
      if (tokenAddress === "0x0") {
        hasAllowance[tokenAddress] = true;
      } else {
        hasAllowance[tokenAddress] = ethers.BigNumber.from(
          Math.ceil(allowancesRequired[tokenAddress])
        ).lte(data[index]);
      }
    });
    console.log({ hasAllowance });

    return hasAllowance;
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const switchNetwork = async (chainId: string) => {
  const network = getNetwork();
  console.log({ id: network.chain?.id, chainId });
  if (parseInt(chainId) !== network.chain?.id)
    await switchNet({
      chainId: parseInt(chainId),
    });
};

async function getContract(address: string, abi: any) {
  const signer = await fetchSigner();
  return new ethers.Contract(address, abi, signer as unknown as Signer);
}

export const getDecimals = async (tokenAddress: string) => {
  const tokenContract = await getContract(tokenAddress, erc20ABI);
  return tokenContract.decimals();
};

export const approveUsingEOA = async (
  chainId: string,
  tokenAddresses: string[],
  registry: Registry
) => {
  // tokenAddresses.forEach(async (tokenAddress) => {
  //   if (tokenAddress !== "0x0") {
  //     const tokenContract = await getContract(tokenAddress, erc20ABI);
  //     await tokenContract.approve(
  //       registry[chainId].distributorAddress,
  //       ethers.constants.MaxUint256
  //     );
  //   }
  // });

  for (const tokenAddress of tokenAddresses) {
    if (tokenAddress !== "0x0") {
      const tokenContract = await getContract(tokenAddress, erc20ABI);
      await tokenContract.approve(
        registry[chainId].distributorAddress,
        ethers.constants.MaxUint256
      );
    }
  }
};

export const approveUsingGnosis = async (
  chainId: string,
  callerAddress: string
) => {};

export const payUsingGnosis = async (
  chainId: string,
  callerAddress: string,
  aggregatedAmounts: { [tokenAddress: string]: number }
) => {};

export const covertToWei = async (
  amounts: { ethAddress: string; token: string; amount: number }[]
) => {
  // const valuesInWei = amounts.map(async (v, index) => {
  //   const numDecimals = await getDecimals(amounts[index].token);

  //   return ethers.BigNumber.from(v?.amount.toFixed())
  //     .mul(ethers.BigNumber.from(10).pow(numDecimals))
  //     .add(
  //       ethers.BigNumber.from(
  //         ((v.amount - Math.floor(v.amount)) * 10 ** numDecimals[index])
  //           .toFixed()
  //           .toString()
  //       )
  //     );
  // });
  const valuesInWei = [] as ethers.BigNumber[];
  for (const amt of amounts) {
    const numDecimals = await getDecimals(amt.token);

    valuesInWei.push(
      ethers.BigNumber.from(amt?.amount.toFixed())
        .mul(ethers.BigNumber.from(10).pow(numDecimals))
        .add(
          ethers.BigNumber.from(
            ((amt.amount - Math.floor(amt.amount)) * 10 ** numDecimals)
              .toFixed()
              .toString()
          )
        )
    );
  }
  const values = amounts.map((v, index) => {
    return {
      ethAddress: v.ethAddress,
      token: v.token,
      valueInWei: valuesInWei[index],
    };
  });
  return values;
};

export const payUsingEOA = async (
  chainId: string,
  amounts: { ethAddress: string; token: string; amount: number }[],
  tokensWithoutAllowance: string[],
  tokensWithoutBalance: string[],
  registry: Registry
) => {
  const valuesInWei = await covertToWei(amounts);
  const distributorContract = await getContract(
    registry[chainId].distributorAddress as string,
    DistributorABI
  );
  const tokenAmounts = valuesInWei.filter(
    (a) =>
      a.token !== "0x0" &&
      !tokensWithoutAllowance.includes(a.token) &&
      !tokensWithoutBalance.includes(a.token)
  );

  console.log({ distributorContract });
  // Distribute tokens
  if (tokenAmounts.length > 0) {
    await distributorContract.distributeTokens(
      valuesInWei.map((v) => v.token),
      valuesInWei.map((v) => v.ethAddress),
      valuesInWei.map((v) => v.valueInWei),
      ""
    );
  }

  const currencyAmounts = amounts.filter((a) => a.token === "0x0");
};

export const payUsingGasless = async (
  chainId: string,
  callerAddress: string,
  aggregatedAmounts: { [tokenAddress: string]: number }
) => {};
