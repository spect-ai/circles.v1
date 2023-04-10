/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Registry } from "@/app/types";
import { BigNumberish, ethers, Signer } from "ethers";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { erc20ABI, useSigner, useBalance, useNetwork, useAccount } from "wagmi";
import { fetchSigner } from "@wagmi/core";
import { gnosisPayment } from "../Gnosis";

export default function useERC20() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: chain?.id,
  });

  function isCurrency(addr: string) {
    return addr === "0x0";
  }

  function getERC20Contract(addr: string) {
    if (signer) {
      return new ethers.Contract(addr, erc20ABI, signer);
    }
    return null;
  }

  function getERC20ContractWithCustomProvider(
    addr: string,
    web3providerUrl: string
  ) {
    const provider = new ethers.providers.JsonRpcProvider(
      web3providerUrl,
      "any"
    );
    return new ethers.Contract(addr, erc20ABI, provider);
  }

  async function getERC20ContractDynamicSigner(addr: string) {
    const cSigner = await fetchSigner();
    return new ethers.Contract(addr, erc20ABI, cSigner as unknown as Signer);
  }

  async function approve(
    chainId: string,
    erc20Address: string,
    circleRegistry?: Registry,
    safeAddress?: string
  ) {
    const contract = getERC20Contract(erc20Address);
    if (!registry && !circleRegistry) return false;
    try {
      const gasEstimate = await contract?.estimateGas.approve(
        circleRegistry && circleRegistry[chainId]
          ? circleRegistry[chainId].distributorAddress
          : registry && registry[chainId].distributorAddress,
        ethers.constants.MaxInt256
      );
      if (!gasEstimate) {
        console.error("gas estimation failed");
        return false;
      }
      if (safeAddress) {
        const data = await contract?.populateTransaction.approve(
          circleRegistry && circleRegistry[chainId]
            ? circleRegistry[chainId].distributorAddress
            : registry && registry[chainId].distributorAddress,
          ethers.constants.MaxInt256
        );
        const res = await gnosisPayment(safeAddress, data, chainId);
        if (res) {
          toast.success("Transaction sent to your safe", { theme: "dark" });
        } else {
          toast.error("Error Occurred while sending your transation to safe");
        }

        return res;
      }

      const tx = await contract?.approve(
        circleRegistry
          ? circleRegistry[chainId].distributorAddress
          : registry && registry[chainId].distributorAddress,
        ethers.constants.MaxInt256
      );
      await tx.wait();
      return true;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message, {
          theme: "dark",
        });
      }
      return false;
    }
  }

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
      erc20Addresses.forEach((erc20Address) => {
        approve(chainId, erc20Address, {}, safeAddress)
          .then((res: unknown) => {
            console.warn(res);
          })
          .catch((err: unknown) => {
            console.error(err);
          });
      });
    } else {
      erc20Addresses.forEach((erc20Address) => {
        approve(chainId, erc20Address)
          .then((res: unknown) => {
            console.warn(res);
          })
          .catch((err: unknown) => {
            console.error(err);
          });
      });
    }
    return true;
  }

  function aggregateBalances(
    erc20Addresses: Array<string>,
    values: Array<number>
  ) {
    const addressToValue: {
      [key: string]: number;
    } = {};
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
      // ethers.BigNumber.from((value * 10 ** numDecimals).toFixed(0).toString())
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
    const uniqueTokenAddresses: string[] = [];
    const aggregatedTokenValues: number[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const [erc20Address, value] of Object.entries(aggregateValues)) {
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
        // eslint-disable-next-line no-underscore-dangle
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
      const cBalance = await contract.balanceOf(ethAddress);
      if (!value) return false;
      const ceilVal = Math.ceil(value).toFixed();
      return (
        cBalance >=
        // ethers.BigNumber.from((value * 10 ** numDecimals).toFixed(0).toString())
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
    let contract;
    if (rpcNode) {
      contract = getERC20ContractWithCustomProvider(erc20Address, rpcNode);
    } else contract = await getERC20ContractDynamicSigner(erc20Address);
    // eslint-disable-next-line no-return-await
    return contract.decimals();
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
      return contract.symbol();
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
      return contract.name();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function balanceOf(erc20Address: string, ethAddress: string) {
    const contract = getERC20Contract(erc20Address);
    return contract?.balanceOf(ethAddress);
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
