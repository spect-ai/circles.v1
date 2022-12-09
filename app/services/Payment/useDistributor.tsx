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

export default function useDistributor() {
  const { isCurrency, decimals } = useERC20();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  const { signer } = useGlobal()

  function getDistributorContract(chainId: string, circleRegistry?: Registry) {
    if (!registry && !circleRegistry) return null;
    const addr = circleRegistry
      ? circleRegistry[chainId].distributorAddress
      : registry && registry[chainId].distributorAddress;
    return new ethers.Contract(
      addr as string,
      DistributorABI,
      signer
    );
  }

  function getPendingApprovals(
    addresses: string[],
    values: number[],
    chainId: string
  ) {
    if (isCurrency(addresses[0])) {
      return true;
    }
    const contract = getDistributorContract(chainId);
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
    const contract = getDistributorContract(chainId, circleRegistry);
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
    const overrides = {
      value: ethers.utils.parseEther(totalValue.toString()),
      nonce,
      gasLimit: chainId === '1' ? 21000 : 10000000,
    };
    const encoder = new AbiCoder();
    const id = encoder.encode(
      ["string", "string", "string", "string[]"],
      [callerId, circleId, type, cardIds]
    );
    if (paymentMethod === "gnosis") {
      const data = await contract?.populateTransaction.distributeEther(
        contributorsWithPositiveAllocation,
        valuesInWei,
        id,
        overrides
      );
      return data;
    } else if (paymentMethod === "gasless") {
      return {
        contributorsWithPositiveAllocation,
        valuesInWei,
        id,
        overrides,
      };
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
    const contract = getDistributorContract(chainId, circleRegistry);

    const overrides: any = {
      gasLimit: chainId == '1' ? 21000 : 10000000,
      nonce,
    };
    const encoder = new AbiCoder();
    const id = encoder.encode(
      ["string", "string", "string", "string[]"],
      [callerId, circleId, type, cardIds]
    );
    if (paymentMethod === "gnosis") {
      console.log(overrides.gasLimit);
      const data = await contract?.populateTransaction.distributeTokens(
        filteredTokenAddresses,
        filteredRecipients,
        valuesInWei,
        id,
        overrides
      );
      return data;
    } else if (paymentMethod === "gasless") {
      return {
        filteredTokenAddresses,
        filteredRecipients,
        valuesInWei,
        id,
        overrides,
      };
    }

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
