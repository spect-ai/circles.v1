/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Registry } from "@/app/types";
import { BigNumber, BigNumberish, ethers, Signer } from "ethers";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { erc20ABI, useSwitchNetwork } from "wagmi";
import { gnosisPayment } from "../Gnosis";
import {
  useSigner,
  useBalance,
  useNetwork,
  useAccount,
  useProvider,
} from "wagmi";
import { fetchSigner } from "@wagmi/core";
import { useGlobal } from "@/app/context/globalContext";

export default function useERC20() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const { signer } = useGlobal();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: address,
    chainId: chain?.id,
  });

  function isCurrency(address: string) {
    return address === "0x0";
  }

  function getERC20Contract(address: string) {
    // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    return new ethers.Contract(address, erc20ABI, signer);
  }

  function getERC20ContractWithCustomProvider(
    address: string,
    web3providerUrl: string
  ) {
    const provider = new ethers.providers.JsonRpcProvider(
      web3providerUrl,
      "any"
    );
    return new ethers.Contract(address, erc20ABI, provider);
  }

  async function getERC20ContractDynamicSigner(address: string) {
    const signer = await fetchSigner();
    return new ethers.Contract(address, erc20ABI, signer as unknown as Signer);
  }

  async function approve(
    chainId: string,
    erc20Address: string,
    circleRegistry?: Registry,
    safeAddress?: string,
    nonce?: number
  ) {
    const contract = getERC20Contract(erc20Address);
    if (!registry && !circleRegistry) return false;
    try {
      const gasEstimate = await contract.estimateGas.approve(
        circleRegistry && circleRegistry[chainId]
          ? circleRegistry[chainId].distributorAddress
          : registry && registry[chainId].distributorAddress,
        ethers.constants.MaxInt256
      );
      if (!gasEstimate) {
        console.error("gas estimation failed");
        return;
      }
      const overrides: any = {
        gasLimit: Math.ceil(gasEstimate.toNumber() * 1.2),
        nonce,
      };
      if (safeAddress) {
        const data = await contract.populateTransaction.approve(
          circleRegistry && circleRegistry[chainId]
            ? circleRegistry[chainId].distributorAddress
            : registry && registry[chainId].distributorAddress,
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
        circleRegistry
          ? circleRegistry[chainId].distributorAddress
          : registry && registry[chainId].distributorAddress,
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async function approveAll(
    chainId: string,
    erc20Addresses: string[],
    approveOnSafe?: boolean,
    safeAddress?: string
  ) {
    if (approveOnSafe && !safeAddress) {
      toast.error("Please connect your safe in circle settings");
    }
    if (approveOnSafe) {
      for (const erc20Address of erc20Addresses) {
        approve(chainId, erc20Address, {}, safeAddress)
          .then((res: any) => {
            console.log(res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    } else
      for (const erc20Address of erc20Addresses) {
        approve(chainId, erc20Address)
          .then((res: any) => {
            console.log(res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    return true;
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
    ethAddress: string,
    rpcNode?: string
  ) {
    if (isCurrency(erc20Address)) {
      return true;
    }
    let contract;
    if (rpcNode) {
      contract = getERC20ContractWithCustomProvider(erc20Address, rpcNode);
    } else contract = await getERC20ContractDynamicSigner(erc20Address);
    const numDecimals = await contract.decimals();
    const allowance = await contract.allowance(ethAddress, spenderAddress);
    if (!value) return false;
    const ceilVal = Math.ceil(value).toFixed();
    return (
      allowance >=
      //ethers.BigNumber.from((value * 10 ** numDecimals).toFixed(0).toString())
      ethers.BigNumber.from(ceilVal).mul(
        ethers.BigNumber.from(10).pow(numDecimals)
      )
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
      if ((value as number) > 0) {
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
    }
    return [uniqueTokenAddresses, aggregatedTokenValues];
  }

  // eslint-disable-next-line consistent-return
  async function hasBalance(
    erc20Address: string,
    value: number,
    ethAddress: string,
    rpcNode?: string
  ) {
    if (isCurrency(erc20Address)) {
      const formattedBalance = parseFloat(
        ethers.utils.formatEther(balance?.value?._hex as BigNumberish)
      );
      return formattedBalance >= value;
      // eslint-disable-next-line no-else-return
    } else {
      let contract;
      if (rpcNode) {
        contract = getERC20ContractWithCustomProvider(erc20Address, rpcNode);
      } else contract = await getERC20ContractDynamicSigner(erc20Address);

      const numDecimals = await contract.decimals();
      const balance = await contract.balanceOf(ethAddress);
      if (!value) return false;
      const ceilVal = Math.ceil(value).toFixed();
      return (
        balance >=
        //ethers.BigNumber.from((value * 10 ** numDecimals).toFixed(0).toString())
        ethers.BigNumber.from(ceilVal).mul(
          ethers.BigNumber.from(10).pow(numDecimals)
        )
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

  async function decimals(erc20Address: string, rpcNode?: string) {
    if (isCurrency(erc20Address)) {
      return 18;
    }
    console.log({ erc20Address });
    let contract;
    if (rpcNode) {
      contract = getERC20ContractWithCustomProvider(erc20Address, rpcNode);
    } else contract = await getERC20ContractDynamicSigner(erc20Address);
    // eslint-disable-next-line no-return-await
    return await contract.decimals();
  }

  async function symbol(
    erc20Address: string,
    networkVersion: string | undefined
  ) {
    if (!networkVersion || !registry) return null;
    if (isCurrency(erc20Address)) return null;

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
    if (isCurrency(erc20Address)) return null;
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
    approveAll,
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
