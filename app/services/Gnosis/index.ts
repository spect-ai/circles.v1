import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe, { SafeFactory } from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { BigNumberish, ethers } from "ethers";

import distributorABI from "@/app/common/contracts/polygon/distributor.json";
import distributorAddress from "@/app/common/contracts/polygon/distributor-address.json";

export async function getUserSafes(chainId: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const safeOwner = provider.getSigner(0);
  console.log(safeOwner);
  const address = await safeOwner.getAddress();
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
}

export async function massPayment(safeAddress: string, chainId: string) {
  console.log(safeAddress);
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
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

  const contract = new ethers.Contract(
    distributorAddress.Distributor,
    distributorABI.abi,
    provider.getSigner()
  );
  const data = await contract.populateTransaction.distributeEther(
    ["0x6304CE63F2EBf8C0Cc76b60d34Cc52a84aBB6057"],
    [ethers.utils.parseEther("0.0000001")],
    2,
    { value: ethers.utils.parseEther("0.1") }
  );
  console.log({ data });

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress,
  });
  console.log(parseInt(data.value?.toBigInt().toString() as string));
  //   data.value = parseFloat(
  //     ethers.utils.formatEther(data.value as BigNumberish)
  //   ) as any;
  const transaction: SafeTransactionDataPartial = data as any;

  console.log(transaction);

  const safeTransaction = await safeSdk.createTransaction(transaction);
  console.log(safeTransaction);
  //   await safeSdk.signTransaction(safeTransaction);
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
  console.log(safeTxHash);
  (safeTransaction.data as any).value = parseInt(
    data.value?.toBigInt().toString() as string
  );

  await safeService.proposeTransaction({
    safeAddress: safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: ethers.utils.getAddress(senderAddress),
    senderSignature: senderSignature.data,
    origin: "Spect Circles",
  });
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
