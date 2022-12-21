/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ExternalProvider } from "@/app/types";
import { Biconomy } from "@biconomy/mexa";
import { ethers, Signer } from "ethers";
import DistributorABI from "@/app/common/contracts/mumbai/distributor.json";
import { toast } from "react-toastify";

export const biconomyPayment = async (
  userAddress: string,
  contractAddress: string,
  txnData: any
) => {
  const biconomy = new Biconomy(window.ethereum as ExternalProvider, {
    apiKey: process.env.BICONOMY_API_KEY || "",
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

  // @ts-ignore
  await provider.send("eth_sendTransaction", [txParams]);

  biconomy.on(
    "txMined",
    (data: { msg: string; id: string; hash: string; receipt: string }) => {
      console.log(data);
      toast.success("Transaction Successful");
      return data;
    }
  );
};
