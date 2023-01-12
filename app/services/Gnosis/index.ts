/* eslint-disable @typescript-eslint/no-explicit-any */
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { fetchSigner } from "@wagmi/core";

export async function getUserSafes(chainId: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const safeOwner = provider.getSigner(0);
  console.log(safeOwner);
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
    console.log(e);
    toast.error("Failed to fetch safes on the provided chain");
  }
}

export async function gnosisPayment(
  safeAddress: string,
  data: any,
  chainId: string
) {
  try {
    console.log(safeAddress);
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const safeOwner = provider.getSigner(0);
    const senderAddress = await safeOwner.getAddress();
    console.log(safeOwner);
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner,
    });

    const safeService = new SafeServiceClient({
      txServiceUrl: getSafeServiceUrl(chainId),
      ethAdapter,
    });

    console.log({ data });

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeAddress,
    });
    console.log(parseInt(data.value?.toBigInt().toString() as string));
    //   data.value = parseFloat(
    //     ethers.utils.formatEther(data.value as BigNumberish)
    //   ) as any;
    const transaction: SafeTransactionDataPartial = data;

    console.log(transaction);
    if (!data.value) (transaction as any).value = 0;

    const safeTransaction = await safeSdk.createTransaction(transaction);

    //   await safeSdk.signTransaction(safeTransaction);
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    console.log(data.value);

    if (data.value) {
      (safeTransaction.data as any).value = parseInt(
        data.value?.toBigInt().toString() as string
      );
    }

    const baseTxn = {
      ...data,
      value: data.value
        ? parseInt(data.value?.toBigInt().toString() as string)
        : 0,
      operation: 0,
    };

    console.log({ baseTxn });

    // const { safeTxGas } = await safeService.estimateSafeTransaction(
    //   safeAddress,
    //   baseTxn
    // );
    // console.log({ safeTxGas });
    // console.log({ safeTransaction });

    // (safeTransaction.data as any).safeTxGas = safeTxGas;

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
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const safeOwner = provider.getSigner(0);
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner,
  });

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress,
  });
  return await safeSdk.getNonce();
}

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
