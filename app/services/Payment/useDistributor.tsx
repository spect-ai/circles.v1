import { ethers, Signer } from "ethers";
import useERC20 from "./useERC20";
import DistributorABI from "@/app/common/contracts/mumbai/distributor.json";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import {
  DistributeEtherParams,
  DistributeTokenParams,
  Registry,
} from "@/app/types";
import { AbiCoder } from "ethers/lib/utils";
import { useGlobal } from "@/app/context/globalContext";
import { fetchSigner } from "@wagmi/core";

export default function useDistributor() {
  const { isCurrency, decimals } = useERC20();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  async function getDistributorContract(
    chainId: string,
    circleRegistry?: Registry
  ) {
    const signer = await fetchSigner();
    if (!signer) return null;
    if (!registry && !circleRegistry) return null;
    const addr = circleRegistry
      ? circleRegistry[chainId].distributorAddress
      : registry && registry[chainId].distributorAddress;
    return new ethers.Contract(addr as string, DistributorABI, signer);
  }

  async function getPendingApprovals(
    addresses: string[],
    values: number[],
    chainId: string
  ) {
    if (isCurrency(addresses[0])) {
      return true;
    }
    const contract = await getDistributorContract(chainId);
    const valuesInWei = values.map((v) =>
      ethers.utils.parseEther(v.toString())
    );
    return contract?.pendingApprovals(addresses, valuesInWei);
  }

  async function distributeEther({
    chainId,
    contributors,
    values,
    cardIds,
    circleId,
    type,
    paymentMethod,
    callerId,
    nonce,
    circleRegistry,
  }: DistributeEtherParams) {
    console.log({ contributors });
    const contract = await getDistributorContract(chainId, circleRegistry);
    const valuesInWei = [];
    const contributorsWithPositiveAllocation: any[] = [];
    let totalValue = 0;
    for (let i = 0; i < values.length; i += 1) {
      if (values[i] > 0) {
        valuesInWei.push(
          ethers.utils.parseEther(values[i].toFixed(5).toString())
        );
        contributorsWithPositiveAllocation.push(contributors[i]);
        totalValue += values[i];
      }
    }
    const encoder = new AbiCoder();
    const id = encoder.encode(
      ["string", "string", "string", "string[]"],
      [callerId, circleId, type, cardIds]
    );

    if (paymentMethod === "gnosis") {
      console.log("gnosis");
      const data = await contract?.populateTransaction.distributeEther(
        contributorsWithPositiveAllocation,
        valuesInWei,
        id
      );
      return data;
    } else if (paymentMethod === "gasless") {
      const overrides = {
        value: ethers.utils.parseEther(totalValue.toString()),
        nonce,
        gasLimit: chainId === "1" ? 21000 : 1000000,
      };
      const gasEstimate = await contract?.estimateGas.distributeEther(
        contributorsWithPositiveAllocation,
        valuesInWei,
        id,
        overrides
      );
      if (gasEstimate) {
        overrides.gasLimit = Math.ceil(gasEstimate.toNumber() * 1.2);
      }
      return {
        contributorsWithPositiveAllocation,
        valuesInWei,
        id,
        overrides,
      };
    }

    const overrides = {
      value: ethers.utils.parseEther(totalValue.toString()),
      nonce,
      gasLimit: chainId === "1" ? 21000 : 1000000,
    };
    const gasEstimate = await contract?.estimateGas.distributeEther(
      contributorsWithPositiveAllocation,
      valuesInWei,
      id,
      overrides
    );
    if (gasEstimate) {
      overrides.gasLimit = Math.ceil(gasEstimate.toNumber() * 1.2);
    }
    console.log({ contributorsWithPositiveAllocation, valuesInWei });
    const tx = await contract?.distributeEther(
      contributorsWithPositiveAllocation,
      valuesInWei,
      id,
      overrides
    );
    return tx.wait();
  }

  function filterInvalidValues(
    tokenAddresses: string[],
    recipients: string[],
    values: number[]
  ) {
    const filteredTokenAddresses: string[] = [];
    const filteredRecipients: string[] = [];
    const filteredValues: number[] = [];

    for (let i = 0; i < values.length; i += 1) {
      if (values[i] > 0) {
        filteredValues.push(values[i]);
        filteredRecipients.push(recipients[i]);
        filteredTokenAddresses.push(tokenAddresses[i]);
      }
    }

    return { filteredTokenAddresses, filteredRecipients, filteredValues };
  }

  async function getDecimals(tokenAddresses: string[]) {
    const numDecimals = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tokenAddress of tokenAddresses) {
      // eslint-disable-next-line no-await-in-loop
      numDecimals.push(await decimals(tokenAddress));
    }
    return numDecimals;
  }

  async function distributeTokens({
    chainId,
    values,
    tokenAddresses,
    contributors,
    paymentMethod,
    callerId,
    cardIds,
    circleId,
    type,
    nonce,
    circleRegistry,
  }: DistributeTokenParams) {
    const { filteredTokenAddresses, filteredRecipients, filteredValues } =
      filterInvalidValues(tokenAddresses, contributors, values);
    const numDecimals = (await getDecimals(filteredTokenAddresses)) as number[];
    //console.log((values[0] / values[0].toFixed()) * 10 ** numDecimals[0]);
    const valuesInWei = filteredValues.map((v, index) => {
      return ethers.BigNumber.from(v.toFixed())
        .mul(ethers.BigNumber.from(10).pow(numDecimals[index]))
        .add(
          ethers.BigNumber.from(
            ((v - Math.floor(v)) * 10 ** numDecimals[index])
              .toFixed()
              .toString()
          )
        );
    });
    const contract = await getDistributorContract(chainId, circleRegistry);

    const encoder = new AbiCoder();
    const id = encoder.encode(
      ["string", "string", "string", "string[]"],
      [callerId, circleId, type, cardIds]
    );

    if (paymentMethod === "gnosis") {
      const data = await contract?.populateTransaction.distributeTokens(
        filteredTokenAddresses,
        filteredRecipients,
        valuesInWei,
        id
      );
      return data;
    } else if (paymentMethod === "gasless") {
      const gasEstimate = await contract?.estimateGas.distributeTokens(
        filteredTokenAddresses,
        filteredRecipients,
        valuesInWei,
        id
      );

      const overrides: any = {
        gasLimit: 1000000,
        nonce,
      };
      console.log({ filteredTokenAddresses });
      return {
        filteredTokenAddresses,
        filteredRecipients,
        valuesInWei,
        id,
        overrides,
      };
    }
    const gasEstimate = await contract?.estimateGas.distributeTokens(
      filteredTokenAddresses,
      filteredRecipients,
      valuesInWei,
      id
    );
    if (!gasEstimate) {
      console.error("gas estimation failed");
      return;
    }
    const overrides: any = {
      gasLimit: Math.ceil(gasEstimate.toNumber() * 1.2),
      nonce,
    };
    const tx = await contract?.distributeTokens(
      filteredTokenAddresses,
      filteredRecipients,
      valuesInWei,
      id,
      overrides
    );
    return tx.wait();
  }

  return {
    getPendingApprovals,
    distributeEther,
    distributeTokens,
  };
}
