import { ExternalProvider } from "@/app/types";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import DistributorABI from "@/app/common/contracts/mumbai/distributor.json";

export async function biconomyPayment(
  userAddress: string,
  contractAddress: string,
  type: "currency" | "token",
  txnData: any
) {
  console.log({ contractAddress });
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);

  const biconomy = new Biconomy(window.ethereum as ExternalProvider, {
    apiKey: "e10g_XQD-.ff5b071a-8e9a-444d-a08d-287f45ec0086",
    debug: true,
    contractAddresses: [contractAddress], // list of contract address you want to enable gasless on
  });

  await biconomy?.init();
  const contract = new ethers.Contract(
    contractAddress,
    DistributorABI,
    biconomy.ethersProvider
  );

  if (type === "currency") {
    const { contributorsWithPositiveAllocation, valuesInWei, id, overrides } =
      txnData;
    console.log({ overrides });
    const data = await contract?.populateTransaction.distributeEther(
      contributorsWithPositiveAllocation,
      valuesInWei,
      id,
      overrides
    );
    data.from = userAddress;
    console.log({ data });
    const gasLimit = await biconomy.ethersProvider.estimateGas(data);
    console.log({ gasLimit });
    console.log({ gasLimit: Number(gasLimit.toNumber().toString()) });
    (data as any).value = Number(data.value?.toString());
    (data as any).gasLimit = Number(data.gasLimit?.toNumber().toString());

    console.log({ data });
    const bicoprovider = biconomy.provider;
    // const signer = bicoprovider.getSigner();
    // await signer.sendTransaction(data);
    const res =
      bicoprovider.request &&
      bicoprovider.request({
        method: "eth_sendTransaction",
        params: [data],
      });
  } else if (type === "token") {
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
      to: data.to,
      from: userAddress,
      signatureType: "EIP712_SIGN",
    };
    data.from = userAddress;
    const bicoprovider = biconomy.provider;
    const res =
      bicoprovider.request &&
      bicoprovider.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });
  }

  biconomy.on("txMined", (data: any) => {
    // Event emitter to monitor when a transaction is mined
    console.log("transaction mined iguess", data);
  });
}
