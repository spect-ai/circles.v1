import { MemberDetails, PaymentDetails, Registry } from "@/app/types";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  fetchSigner,
  fetchBalance,
  ReadContractConfig,
  readContracts,
  switchNetwork as switchNet,
  getNetwork,
} from "@wagmi/core";
import {
  BigNumber,
  BigNumberish,
  ContractInterface,
  ethers,
  Signer,
} from "ethers";
import { erc20ABI } from "wagmi";
import DistributorABI from "@/app/common/contracts/mumbai/distributor.json";
import { toast } from "react-toastify";
import { updateMultiplePayments } from ".";
import { gnosisPayment } from "../Gnosis";

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
) => pendingPayments.filter((p) => paymentDetails[p].chain?.value === chainId);

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
        ethAddress = memberDetails.memberDetails[p.value?.value].ethAddress;
      } else if (p.propertyType === "ethAddress") {
        ethAddress = p.value;
      }
      if (p.reward?.value) {
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
) => amounts.filter((a) => a.token !== "0x0");

export const filterCurrencyPayments = (
  amounts: { ethAddress: string; token: string; amount: number }[]
) => amounts.filter((a) => a.token === "0x0");

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

export const hasBalances = async (
  chainId: string,
  callerAddress: string,
  aggregatedAmounts: { [tokenAddress: string]: number }
) => {
  const hasBalance = {} as { [tokenAddress: string]: boolean };
  Object.entries(aggregatedAmounts).forEach(async ([tokenAddress, amount]) => {
    let balanceObj: WagmiBalanceObject;
    if (tokenAddress === "0x0") {
      balanceObj = await fetchBalance({
        address: callerAddress as `0x${string}`,
        chainId: parseInt(chainId),
        formatUnits: "ether",
      });
    } else {
      balanceObj = await fetchBalance({
        address: callerAddress as `0x${string}`,
        token: tokenAddress as `0x${string}`,
        chainId: parseInt(chainId),
        formatUnits: "ether",
      });
    }
    let balance = parseFloat(balanceObj.formatted);
    if (balanceObj.decimals !== 18) balance *= 10 ** (18 - balanceObj.decimals);
    hasBalance[tokenAddress] = balance >= amount;
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
      if (tokenAddress !== "0x0") {
        tokens.push({
          tokenAddress,
          symbol: registry[chainId].tokenDetails[tokenAddress].symbol,
        });
      } else {
        tokens.push({
          tokenAddress,
          symbol: registry[chainId].nativeCurrency,
        });
      }
    }
    return null;
  });
  return tokens;
};

export const hasAllowance = async (
  registry: Registry,
  chainId: string,
  callerAddress: string,
  allowancesRequired: { [tokenAddress: string]: number }
) => {
  const hasAllow = {} as { [tokenAddress: string]: boolean };
  const reads = [] as ReadContractConfig[];
  Object.keys(allowancesRequired).map((tokenAddress) => {
    if (tokenAddress !== "0x0") {
      reads.push({
        chainId: parseInt(chainId),
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [callerAddress, registry[chainId].distributorAddress],
      });
    }
    return null;
  });
  try {
    const data = (await readContracts({
      contracts: reads,
    })) as BigNumberish[];
    let idx = 0;
    Object.keys(allowancesRequired).map((tokenAddress) => {
      if (tokenAddress === "0x0") {
        hasAllow[tokenAddress] = true;
      } else {
        hasAllow[tokenAddress] = ethers.BigNumber.from(
          Math.ceil(allowancesRequired[tokenAddress])
        ).lte(data[idx]);
        idx += 1;
      }
      return null;
    });
    return hasAllowance;
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const switchNetwork = async (chainId: string) => {
  const network = getNetwork();
  if (parseInt(chainId) !== network.chain?.id) {
    await switchNet({
      chainId: parseInt(chainId),
    });
  }
};

export async function getContract(address: string, abi: ContractInterface) {
  const signer = await fetchSigner();
  return new ethers.Contract(address, abi, signer as unknown as Signer);
}

export const getDecimals = async (tokenAddress: string) => {
  const tokenContract = await getContract(tokenAddress, erc20ABI);
  return tokenContract.decimals();
};

export const approveOneTokenUsingEOA = async (
  chainId: string,
  tokenAddress: string,
  registry: Registry
) => {
  const tokenContract = await getContract(tokenAddress, erc20ABI);
  try {
    const tx = await tokenContract.approve(
      registry[chainId].distributorAddress,
      ethers.constants.MaxUint256
    );
    return tx.wait();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const approveUsingEOA = async (
  chainId: string,
  tokenAddresses: string[],
  registry: Registry
) => {
  const tokensApproved = [] as string[];
  tokenAddresses.forEach(async (tokenAddress) => {
    if (tokenAddress !== "0x0") {
      await toast.promise(
        approveOneTokenUsingEOA(chainId, tokenAddress, registry).then(() =>
          tokensApproved.push(tokenAddress)
        ),
        {
          pending: `Approving ${
            (registry && registry[chainId]?.tokenDetails[tokenAddress]?.name) ||
            "Token"
          }`,
        },
        {
          position: "top-center",
        }
      );
    }
  });

  return tokensApproved;
};

export const approveOneUsingGnosis = async (
  chainId: string,
  tokenAddress: string,
  registry: Registry,
  nonce: number,
  gnosisSafeAddress: string
) => {
  const overrides = {
    nonce,
  };
  const tokenContract = await getContract(tokenAddress, erc20ABI);
  const data = await tokenContract.populateTransaction.approve(
    registry[chainId].distributorAddress,
    ethers.constants.MaxInt256,
    overrides
  );
  const res = await gnosisPayment(gnosisSafeAddress, data, chainId);
  if (res) toast.success("Transaction sent to your safe", { theme: "dark" });
  else toast.error("Error Occurred while sending your transation to safe");
};

export const approveUsingGnosis = async (
  chainId: string,
  tokenAddresses: string[],
  registry: Registry,
  startNonce: number,
  gnosisSafeAddress: string
) => {
  const tokensApproved = [] as string[];
  let nonce = startNonce;
  tokenAddresses.forEach(async (tokenAddress) => {
    if (tokenAddress !== "0x0") {
      await toast.promise(
        approveOneUsingGnosis(
          chainId,
          tokenAddress,
          registry,
          nonce,
          gnosisSafeAddress
        ).then(() => {
          tokensApproved.push(tokenAddress);
          nonce += 1;
        }),
        {
          pending: `Approving ${
            (registry && registry[chainId]?.tokenDetails[tokenAddress]?.name) ||
            "Token"
          }`,
        },
        {
          position: "top-center",
        }
      );
    }
  });

  return { tokensApproved, nonce };
};

export const convertToWei = async (
  amounts: { ethAddress: string; token: string; amount: number }[]
) => {
  const valuesInWei = [] as ethers.BigNumber[];
  amounts.forEach(async (amt) => {
    const numDecimals = amt.token === "0x0" ? 18 : await getDecimals(amt.token);
    const wei = ethers.utils
      .parseEther(amt.amount.toString())
      .div(ethers.BigNumber.from(10).pow(18 - numDecimals));
    valuesInWei.push(wei);
  });
  const values = amounts.map((v, index) => ({
    ethAddress: v.ethAddress,
    token: v.token,
    valueInWei: valuesInWei[index],
  }));
  return values;
};

export const distributeTokensUsingGnosis = async (
  chainId: string,
  valuesInWei: {
    ethAddress: string;
    token: string;
    valueInWei: ethers.BigNumber;
  }[],
  registry: Registry,
  safeAddress: string,
  nonce: number,
  id: string
) => {
  const distributorContract = await getContract(
    registry[chainId].distributorAddress as string,
    DistributorABI
  );
  const tokenAddressesArr = valuesInWei.map((v) => v.token);

  const ethAddressesArr = valuesInWei.map((v) => v.ethAddress);
  const valuesInWeiArr = valuesInWei.map((v) => v.valueInWei);

  const data = await distributorContract?.populateTransaction.distributeTokens(
    tokenAddressesArr,
    ethAddressesArr,
    valuesInWeiArr,
    id,
    {
      nonce,
    }
  );
  const res = await gnosisPayment(safeAddress, data, chainId);
  return res;
};

export const distributeCurrencyUsingGnosis = async (
  chainId: string,
  valuesInWei: {
    ethAddress: string;
    token: string;
    valueInWei: ethers.BigNumber;
  }[],
  registry: Registry,
  safeAddress: string,
  nonce: number,
  id: string
) => {
  const distributorContract = await getContract(
    registry[chainId].distributorAddress as string,
    DistributorABI
  );
  const ethAddressesArr = valuesInWei.map((v) => v.ethAddress);
  const valuesInWeiArr = valuesInWei.map((v) => v.valueInWei);
  const totalValue = valuesInWei.reduce(
    (acc, v) => acc.add(v.valueInWei),
    ethers.BigNumber.from(0)
  );
  const data = await distributorContract?.populateTransaction.distributeEther(
    ethAddressesArr,
    valuesInWeiArr,
    id,
    {
      value: totalValue,
      nonce,
    }
  );
  const res = await gnosisPayment(safeAddress, data, chainId);

  return res;
};

export const payUsingGnosis = async (
  chainId: string,
  amounts: {
    ethAddress: string;
    token: string;
    amount: number;
  }[],
  tokensWithoutAllowance: string[],
  tokensWithoutBalance: string[],
  registry: Registry,
  startNonce: number,
  gnosisSafeAddress: string,
  id: { [key: string]: string }
) => {
  const valuesInWei = await convertToWei(amounts);

  const tokenAmounts = valuesInWei.filter(
    (a) =>
      a.token !== "0x0" &&
      !tokensWithoutAllowance.includes(a.token) &&
      !tokensWithoutBalance.includes(a.token)
  );

  let tokensDistributed = [] as string[];
  let nonce = startNonce;
  const txHash = {} as { [key: string]: string };
  // Distribute tokens
  if (tokenAmounts.length > 0) {
    await toast.promise(
      distributeTokensUsingGnosis(
        chainId,
        tokenAmounts,
        registry,
        gnosisSafeAddress,
        nonce,
        id.token
      ).then((res) => {
        if (res) {
          tokensDistributed = [
            ...tokensDistributed,
            ...tokenAmounts.map((a) => a.token),
          ];
          nonce += 1;
          if (res) txHash.tokens = res;
        }
      }),
      {
        pending: `Distributing ${
          registry[chainId]?.tokenDetails[tokenAmounts[0].token]?.name
        }`,
      },
      {
        position: "top-center",
      }
    );
  }

  const currencyAmounts = valuesInWei.filter(
    (a) => a.token === "0x0" && !tokensWithoutBalance.includes(a.token)
  );
  if (currencyAmounts.length > 0) {
    await toast.promise(
      distributeCurrencyUsingGnosis(
        chainId,
        currencyAmounts,
        registry,
        gnosisSafeAddress,
        nonce,
        id.currency
      ).then((res) => {
        if (res) {
          tokensDistributed = [...tokensDistributed, "0x0"];
          nonce += 1;
          if (res) txHash.currency = res;
        }
      }),
      {
        pending: `Distributing ${registry[chainId]?.nativeCurrency}`,
      },
      {
        position: "top-center",
      }
    );
  }
  return { tokensDistributed, txHash };
};

export const distributeCurrencyUsingEOA = async (
  chainId: string,
  valuesInWei: {
    ethAddress: string;
    token: string;
    valueInWei: ethers.BigNumber;
  }[],
  registry: Registry,
  id: string
) => {
  const distributorContract = await getContract(
    registry[chainId].distributorAddress as string,
    DistributorABI
  );
  const ethAddressesArr = valuesInWei.map((v) => v.ethAddress);
  const valuesInWeiArr = valuesInWei.map((v) => v.valueInWei);
  const totalValue = valuesInWei.reduce(
    (acc, v) => acc.add(v.valueInWei),
    ethers.BigNumber.from(0)
  );
  const gasEstimate = await distributorContract.estimateGas.distributeEther(
    ethAddressesArr,
    valuesInWeiArr,
    id,
    {
      value: totalValue,
    }
  );
  const tx = await distributorContract.distributeEther(
    ethAddressesArr,
    valuesInWeiArr,
    id,
    {
      gasLimit: Math.ceil(gasEstimate.toNumber() * 1.2),
      value: totalValue,
    }
  );
  return tx.wait();
};

export const distributeTokensUsingEOA = async (
  chainId: string,
  valuesInWei: {
    ethAddress: string;
    token: string;
    valueInWei: ethers.BigNumber;
  }[],
  registry: Registry,
  id: string
) => {
  const distributorContract = await getContract(
    registry[chainId].distributorAddress as string,
    DistributorABI
  );
  const tokenAddressesArr = valuesInWei.map((v) => v.token);
  const ethAddressesArr = valuesInWei.map((v) => v.ethAddress);
  const valuesInWeiArr = valuesInWei.map((v) => v.valueInWei);
  const gasEstimate = await distributorContract.estimateGas.distributeTokens(
    tokenAddressesArr,
    ethAddressesArr,
    valuesInWeiArr,
    id
  );

  const overrides = {
    gasLimit: Math.ceil(gasEstimate.toNumber() * 1.2),
  };
  const tx = await distributorContract.distributeTokens(
    tokenAddressesArr,
    ethAddressesArr,
    valuesInWeiArr,
    id,
    overrides
  );
  return tx.wait();
};

export const payUsingEOA = async (
  chainId: string,
  amounts: {
    ethAddress: string;
    token: string;
    amount: number;
  }[],
  tokensWithoutAllowance: string[],
  tokensWithoutBalance: string[],
  registry: Registry,
  id: { [key: string]: string }
) => {
  const valuesInWei = await convertToWei(amounts);

  const tokenAmounts = valuesInWei.filter(
    (a) =>
      a.token !== "0x0" &&
      !tokensWithoutAllowance.includes(a.token) &&
      !tokensWithoutBalance.includes(a.token)
  );

  let tokensDistributed = [] as string[];
  // Distribute tokens
  const txHash = {} as { [key: string]: string };

  if (tokenAmounts.length > 0) {
    await toast.promise(
      distributeTokensUsingEOA(chainId, tokenAmounts, registry, id.token).then(
        (res: { transactionHash: string }) => {
          tokensDistributed = [
            ...tokensDistributed,
            ...tokenAmounts.map((a) => a.token),
          ];
          txHash.tokens = res?.transactionHash;
        }
      ),
      {
        pending: `Distributing ${
          registry[chainId]?.tokenDetails[tokenAmounts[0].token]?.name
        }`,
      },
      {
        position: "top-center",
      }
    );
  }

  const currencyAmounts = valuesInWei.filter(
    (a) => a.token === "0x0" && !tokensWithoutBalance.includes(a.token)
  );
  if (currencyAmounts.length > 0) {
    await toast.promise(
      distributeCurrencyUsingEOA(
        chainId,
        currencyAmounts,
        registry,
        id.currency
      ).then((res) => {
        tokensDistributed = [...tokensDistributed, "0x0"];
        txHash.currency = res?.transactionHash;
      }),
      {
        pending: `Distributing ${registry[chainId]?.nativeCurrency}`,
      },
      {
        position: "top-center",
      }
    );
  }
  return { tokensDistributed, txHash };
};

export const findPaymentIdsByTokenAndChain = (
  chainId: string,
  tokenAddresses: string[],
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails }
) => {
  let filteredPaymentIds = [] as string[];
  tokenAddresses.forEach((tokenAddress) => {
    filteredPaymentIds = [
      ...paymentIds.filter(
        (p) =>
          paymentDetails[p].token.value === tokenAddress &&
          paymentDetails[p].chain.value === chainId
      ),
      ...filteredPaymentIds,
    ];
  });
  return filteredPaymentIds;
};

export const findAndUpdateCompletedPaymentIds = async (
  circleId: string,
  chainId: string,
  tokenAddresses: string[],
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails },
  transactionHash: { [key: string]: string }
) => {
  let filteredPaymentIds = [] as string[];
  if (!["100", "56", "43114", "43113"].includes(chainId)) return false;
  if (transactionHash.tokens) {
    filteredPaymentIds = findPaymentIdsByTokenAndChain(
      chainId,
      tokenAddresses.filter((t) => t !== "0x0"),
      paymentIds,
      paymentDetails
    );
    if (filteredPaymentIds.length === 0) {
      return false;
    }

    await updateMultiplePayments(circleId, {
      paymentIds: filteredPaymentIds,
      transactionHash: transactionHash.tokens,
      status: "Completed",
    });
  }
  if (transactionHash.currency) {
    filteredPaymentIds = findPaymentIdsByTokenAndChain(
      chainId,
      ["0x0"],
      paymentIds,
      paymentDetails
    );
    if (filteredPaymentIds.length === 0) {
      return false;
    }

    await updateMultiplePayments(circleId, {
      paymentIds: filteredPaymentIds,
      transactionHash: transactionHash.currency,
      status: "Completed",
      paidOn: new Date(),
    });
  }

  return true;
};

export const findAndUpdatePaymentIdsPendingSignature = async (
  circleId: string,
  chainId: string,
  tokenAddresses: string[],
  paymentIds: string[],
  paymentDetails: { [paymentId: string]: PaymentDetails },
  transactionHash: { [key: string]: string }
) => {
  let filteredPaymentIds = [] as string[];

  if (transactionHash.tokens) {
    filteredPaymentIds = findPaymentIdsByTokenAndChain(
      chainId,
      tokenAddresses.filter((t) => t !== "0x0"),
      paymentIds,
      paymentDetails
    );
    if (filteredPaymentIds.length === 0) {
      return false;
    }
    await updateMultiplePayments(circleId, {
      paymentIds: filteredPaymentIds,
      safeTransactionHash: transactionHash.tokens,
      status: "Pending Signature",
    });
  }
  if (transactionHash.currency) {
    filteredPaymentIds = findPaymentIdsByTokenAndChain(
      chainId,
      ["0x0"],
      paymentIds,
      paymentDetails
    );
    if (filteredPaymentIds.length === 0) {
      return false;
    }
    await updateMultiplePayments(circleId, {
      paymentIds: filteredPaymentIds,
      safeTransactionHash: transactionHash.currency,
      status: "Pending Signature",
    });
  }

  return true;
};
