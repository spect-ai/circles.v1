/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ExternalProvider } from "@/app/types";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import DistributorABI from "@/app/common/contracts/mumbai/distributor.json";

export async function biconomyPayment(
  userAddress: string,
  contractAddress: string,
  txnData: any
) {
  console.log({ contractAddress });
  const biconomy = new Biconomy(window.ethereum as ExternalProvider, {
    apiKey: "e10g_XQD-.ff5b071a-8e9a-444d-a08d-287f45ec0086",
    debug: true,
    contractAddresses: [contractAddress], // list of contract address you want to enable gasless on
  });

  const provider = await biconomy.provider;

  const contract = new ethers.Contract(
    contractAddress,
    DistributorABI,
    biconomy.ethersProvider
  );

  await biconomy?.init();

  const {
    filteredTokenAddresses,
    filteredRecipients,
    valuesInWei,
    id,
    overrides,
  } = txnData;
  console.log({ txnData });
  const data = await contract?.populateTransaction.distributeTokens(
    filteredTokenAddresses,
    filteredRecipients,
    valuesInWei,
    id,
    overrides
  );
  const txParams = {
    data: data.data,
    to: contractAddress,
    from: userAddress,
    signatureType: "EIP712_SIGN",
  };
  console.log({ txParams });
  // @ts-ignore
  await provider.send("eth_sendTransaction", [txParams]);
}
