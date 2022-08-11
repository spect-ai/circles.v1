import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Stack } from "degen";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import { massPayment } from "../Gnosis";
import useDistributor from "./useDistributor";
import useERC20 from "./useERC20";

declare let window: any;

type BatchPayParams = {
  chainId: string;
  type: "tokens" | "currency";
  ethAddresses: string[];
  tokenValues: number[];
  tokenAddresses: string[];
  cardIds?: string[];
  epochId?: string;
};

type ExecuteBatchPayParams = {
  type: string;
  chainId: string;
  userAddresses: string[];
  amounts: number[];
  tokenAddresses: string[];
};

type PayUsingGnosisParams = {
  type: string;
  chainId: string;
  userAddresses: string[];
  amounts: number[];
  tokenAddresses: string[];
  safeAddress: string;
  cardIds: string[];
};

export default function usePaymentGateway(
  handleStatusUpdate?: (status: any, txHash: string) => Promise<void>
) {
  const { distributeEther, distributeTokens } = useDistributor();
  const { hasBalances } = useERC20();
  const { data } = useAccount();
  const { activeChain, switchNetworkAsync } = useNetwork();
  async function handlePaymentError(
    err: any,
    expectedNetwork: string,
    tokenAddresses: Array<string>,
    tokenValues: Array<number>
  ) {
    const accounts = await window.ethereum?.request({
      method: "eth_accounts",
    });
    if (accounts?.length === 0) {
      // notify(`Cannot fetch account, wallet is most likely locked`, 'error');
      return;
    }
    if (window.ethereum?.networkVersion !== expectedNetwork) console.log("hi");
    // notify(
    //   `Please switch to ${registry[expectedNetwork]?.name} network`,
    //   'error'
    // );
    else {
      const [sufficientBalance, insufficientBalanceTokenAddress] =
        await hasBalances(tokenAddresses, tokenValues, data?.address as string);
      console.log(sufficientBalance, insufficientBalanceTokenAddress);
      if (!sufficientBalance) {
        // notify(
        //   `Insufficient balance of ${
        //     registry[expectedNetwork].tokens[
        //       insufficientBalanceTokenAddress as string
        //     ].name
        //   }`,
        //   'error'
        // );
      } else {
        // notify(`${err.message}`, 'error');
      }
    }
  }

  async function executeBatchPay({
    type,
    chainId,
    tokenAddresses,
    userAddresses,
    amounts,
  }: ExecuteBatchPayParams) {
    let tx;
    if (type === "tokens") {
      console.log({ amounts });
      tx = await distributeTokens(
        tokenAddresses,
        userAddresses,
        amounts,
        "",
        chainId
      );
    } else if (type === "currency") {
      tx = await distributeEther(userAddresses, amounts, "", chainId);
    }
    return tx;
  }

  async function batchPay({
    type,
    chainId,
    ethAddresses,
    tokenValues,
    tokenAddresses,
    cardIds,
    epochId,
  }: BatchPayParams) {
    try {
      console.log({
        ethAddresses,
        tokenValues,
        tokenAddresses,
        cardIds,
        epochId,
      });
      if (activeChain?.id.toString() !== chainId) {
        switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
      }
      console.log({ ethAddresses, tokenValues, type, chainId });
      const tx = await executeBatchPay({
        type,
        chainId,
        tokenAddresses,
        userAddresses: ethAddresses,
        amounts: tokenValues,
      });
      if (handleStatusUpdate) {
        await handleStatusUpdate(epochId || cardIds, tx.transactionHash);
      }
      // notify('Payment done succesfully!', 'success');
      toast(
        <Stack direction="horizontal">
          Transaction Successful
          <PrimaryButton>
            <Link
              href={`https://mumbai.polygonscan.com/tx/${tx.transactionHash}`}
            >
              View Transaction
            </Link>
          </PrimaryButton>
        </Stack>,
        {
          theme: "dark",
        }
      );
      return tx.transactionHash;
    } catch (err: any) {
      void handlePaymentError(err, chainId, tokenAddresses, tokenValues);
      console.log(err);
      // toast.error(err.message, {
      //   theme: "dark",
      // });
      throw err.message;
      return false;
    }
  }

  async function payUsingGnosis({
    type,
    chainId,
    amounts,
    userAddresses,
    tokenAddresses,
    safeAddress,
    cardIds,
  }: PayUsingGnosisParams) {
    console.log({ cardIds, safeAddress });
    if (type === "tokens") {
      console.log({ amounts });
      const data = await distributeTokens(
        tokenAddresses,
        userAddresses,
        amounts,
        cardIds.toString(),
        chainId,
        true
      );
      const res = await massPayment(safeAddress, data, chainId);
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
    } else if (type === "currency") {
      const data = await distributeEther(
        userAddresses,
        amounts,
        cardIds.toString(),
        chainId,
        true
      );
      console.log({ data });
      const res = await massPayment(safeAddress, data, chainId);
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
    }
  }

  return {
    batchPay,
    payUsingGnosis,
  };
}
