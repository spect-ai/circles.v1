/* eslint-disable @typescript-eslint/no-explicit-any */
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { fetchSigner } from "@wagmi/core";

export function getSafeServiceUrl(chainId: string) {
  switch (chainId) {
    case "1":
      return "https://safe-transaction.gnosis.io";
    case "4":
      return "https://safe-transaction.rinkeby.gnosis.io";
    case "100":
      return "https://safe-transaction.xdai.gnosis.io";
    case "137":
      return "https://safe-transaction.polygon.gnosis.io";
    case "41337":
      return "https://safe-transaction.avalanche.gnosis.io";
    case "10":
      return "https://safe-transaction.optimism.gnosis.io";
    case "42161":
      return "https://safe-transaction.arbitrum.gnosis.io";
    default:
      return "https://safe-transaction.rinkeby.gnosis.io";
  }
}

export async function getUserSafes(chainId: string) {
  const safeOwner = await fetchSigner();
  if (!safeOwner) throw new Error("No signer found");
  const address = await safeOwner.getAddress();
  try {
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner,
    });

    const safeService = new SafeServiceClient({
      txServiceUrl: getSafeServiceUrl(chainId),
      ethAdapter,
    });
    const safes = await safeService.getSafesByOwner(
      ethers.utils.getAddress(address)
    );
    return safes;
  } catch (e) {
    console.error(e);
    toast.error("Failed to fetch safes on the provided chain");
    return [];
  }
}

export async function gnosisPayment(
  safeAddress: string,
  data: any,
  chainId: string
) {
  try {
    const safeOwner = await fetchSigner();
    if (!safeOwner) throw new Error("No signer found");
    const senderAddress = await safeOwner.getAddress();
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner,
    });

    const safeService = new SafeServiceClient({
      txServiceUrl: getSafeServiceUrl(chainId),
      ethAdapter,
    });

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
    });
    //   data.value = parseFloat(
    //     ethers.utils.formatEther(data.value as BigNumberish)
    //   ) as any;
    const transaction: SafeTransactionDataPartial = data;
    if (!data.value) (transaction as any).value = 0;

    const safeTransaction = await safeSdk.createTransaction(transaction);

    //   await safeSdk.signTransaction(safeTransaction);
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    if (data.value) {
      (safeTransaction.data as any).value = parseInt(
        data.value?.toBigInt().toString() as string
      );
    }
    await safeService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: ethers.utils.getAddress(senderAddress),
      senderSignature: senderSignature.data,
      origin: "Spect Circles",
    });
    return safeTxHash;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getNonce(safeAddress: string) {
  const safeOwner = await fetchSigner();
  if (!safeOwner) throw new Error("No signer found");
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner,
  });

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
  });
  return safeSdk.getNonce();
}
