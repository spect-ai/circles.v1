/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Registry } from "@/app/types";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { erc20ABI } from "wagmi";
import { gnosisPayment } from "../Gnosis";

export default function useERC20() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  function isCurrency(address: string) {
    return address === "0x0";
  }

  function getERC20Contract(address: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    return new ethers.Contract(address, erc20ABI, provider.getSigner());
  }

  function getERC20ContractWithCustomProvider(
    address: string,
    web3providerUrl: string
  ) {
    const provider = new ethers.providers.JsonRpcProvider(web3providerUrl);
    return new ethers.Contract(address, erc20ABI, provider);
  }

  async function approve(
    chainId: string,
    erc20Address: string,
    safeAddress?: string
  ) {
    const contract = getERC20Contract(erc20Address);
    if (!registry) return false;
    try {
      if (safeAddress) {
        const data = await contract.populateTransaction.approve(
          registry[chainId].distributorAddress,
          ethers.constants.MaxInt256
        );
        const res = await gnosisPayment(safeAddress, data, chainId);
        if (res)
          toast.success("Transaction sent to your safe", { theme: "dark" });
        else
          toast.error("Error Occurred while sending your transation to safe");

        return;
      }
      const tx = await contract.approve(
        registry[chainId].distributorAddress,
        ethers.constants.MaxInt256
      );
      await tx.wait();
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message, {
        theme: "dark",
      });
      return false;
    }
  }

  function aggregateBalances(
    erc20Addresses: Array<string>,
    values: Array<number>
  ) {
    const addressToValue: any = {};
    if (!erc20Addresses || !values) return addressToValue;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < erc20Addresses.length; i++) {
      if (!(erc20Addresses[i] in addressToValue)) {
        addressToValue[erc20Addresses[i]] = values[i];
      } else {
        addressToValue[erc20Addresses[i]] += values[i];
      }
    }
    return addressToValue;
  }

  async function isApproved(
    erc20Address: string,
    spenderAddress: string,
    value: number,
    ethAddress: string
  ) {
    if (isCurrency(erc20Address)) {
      return true;
    }
    const contract = getERC20Contract(erc20Address);
    const numDecimals = await contract.decimals();
    const allowance = await contract.allowance(ethAddress, spenderAddress);
    return (
      allowance >=
      ethers.BigNumber.from((value * 10 ** numDecimals).toFixed(0).toString())
    );
  }

  async function areApproved(
    erc20Addresses: string[],
    spenderAddress: string,
    values: number[],
    ethAddress: string
  ) {
    const aggregateValues = aggregateBalances(erc20Addresses, values);
    const uniqueTokenAddresses = [];
    const aggregatedTokenValues = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [erc20Address, value] of Object.entries(aggregateValues)) {
      // eslint-disable-next-line no-await-in-loop
      const tokenIsApproved = await isApproved(
        erc20Address,
        spenderAddress,
        value as number,
        ethAddress
      );
      if (!tokenIsApproved) {
        uniqueTokenAddresses.push(erc20Address);
        aggregatedTokenValues.push(value);
      }
    }
    return [uniqueTokenAddresses, aggregatedTokenValues];
  }

  // eslint-disable-next-line consistent-return
  async function hasBalance(
    erc20Address: string,
    value: number,
    ethAddress: string
  ) {
    if (isCurrency(erc20Address)) {
      const balance = await window.ethereum?.request({
        // @ts-ignore
        method: "eth_getBalance",
        // @ts-ignore
        params: [ethAddress],
      });
      return parseFloat(ethers.utils.formatEther(balance as any)) >= value;
      // eslint-disable-next-line no-else-return
    } else {
      const contract = getERC20Contract(erc20Address);

      const numDecimals = await contract.decimals();

      const balance = await contract.balanceOf(ethAddress);

      return (
        balance >=
        ethers.BigNumber.from((value * 10 ** numDecimals).toFixed(0).toString())
      );
    }
  }

  async function hasBalances(
    erc20Addresses: Array<string>,
    values: Array<number>,
    ethAddress: string
  ) {
    const aggregateValues = aggregateBalances(erc20Addresses, values);
    // eslint-disable-next-line no-plusplus
    // eslint-disable-next-line no-restricted-syntax
    for (const [erc20Address, value] of Object.entries(aggregateValues)) {
      // eslint-disable-next-line no-await-in-loop
      const sufficientBalance = await hasBalance(
        erc20Address,
        value as number,
        ethAddress
      );
      if (!sufficientBalance) return [false, erc20Address];
    }
    return [true, null];
  }

  async function decimals(erc20Address: string) {
    if (isCurrency(erc20Address)) {
      return 18;
    }
    console.log({ erc20Address });
    const contract = getERC20Contract(erc20Address);
    console.log({ contract });
    // eslint-disable-next-line no-return-await
    return await contract.decimals();
  }

  async function symbol(
    erc20Address: string,
    networkVersion: string | undefined
  ) {
    if (!networkVersion || !registry) return null;
    try {
      const contract = getERC20ContractWithCustomProvider(
        erc20Address,
        registry[networkVersion].provider
      );
      return await contract.symbol();
    } catch (err) {
      console.error(err);
      return null;
    }
    // eslint-disable-next-line no-return-await
  }

  async function name(
    erc20Address: string,
    networkVersion: string | undefined
  ) {
    if (!networkVersion || !registry) return null;
    try {
      const contract = getERC20ContractWithCustomProvider(
        erc20Address,
        registry[networkVersion].provider
      );
      // eslint-disable-next-line no-return-await
      return await contract.name();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function balanceOf(erc20Address: string, ethAddress: string) {
    const contract = getERC20Contract(erc20Address);
    // eslint-disable-next-line no-return-await
    return await contract.balanceOf(ethAddress);
  }

  return {
    approve,
    isApproved,
    areApproved,
    isCurrency,
    hasBalance,
    hasBalances,
    decimals,
    symbol,
    name,
    balanceOf,
  };
}
