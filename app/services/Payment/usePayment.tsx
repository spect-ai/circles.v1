import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { Registry } from "@/app/types";
import { Stack } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import { gnosisPayment } from "../Gnosis";
import useDistributor from "./useDistributor";
import useERC20 from "./useERC20";

declare let window: any;

interface BatchPayParams {
  paymentType: string;
  batchPayType: "card" | "retro";
  chainId: string;
  userAddresses: string[];
  amounts: number[];
  tokenAddresses: string[];
  cardIds: string[];
  circleId: string;
}

interface PayUsingGnosisParams extends BatchPayParams {
  safeAddress: string;
}

export default function usePaymentGateway(
  handleStatusUpdate?: (status: any, txHash: string) => Promise<void>
) {
  const { distributeEther, distributeTokens } = useDistributor();
  const { hasBalances } = useERC20();
  const { data: account } = useAccount();
  const { activeChain, switchNetworkAsync } = useNetwork();
  const { connectedUser } = useGlobal();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
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
        await hasBalances(
          tokenAddresses,
          tokenValues,
          account?.address as string
        );
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
    paymentType,
    chainId,
    tokenAddresses,
    userAddresses,
    amounts,
    cardIds,
    circleId,
    batchPayType,
  }: BatchPayParams) {
    let tx;
    if (paymentType === "tokens") {
      console.log({ amounts });
      tx = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        tokenAddresses,
        gnosis: false,
        callerId: connectedUser,
        type: batchPayType,
        cardIds,
        circleId,
      });
    } else if (paymentType === "currency") {
      tx = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
        gnosis: false,
        callerId: connectedUser,
        type: batchPayType,
        cardIds,
        circleId,
      });
    }
    return tx;
  }

  async function batchPay({
    paymentType,
    chainId,
    tokenAddresses,
    userAddresses,
    amounts,
    cardIds,
    circleId,
    batchPayType,
  }: BatchPayParams) {
    try {
      if (activeChain?.id.toString() !== chainId) {
        switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
      }
      const tx = await executeBatchPay({
        paymentType,
        chainId,
        tokenAddresses,
        userAddresses,
        amounts,
        cardIds,
        circleId,
        batchPayType,
      });
      if (handleStatusUpdate) {
        await handleStatusUpdate(cardIds, tx.transactionHash);
      }
      // notify('Payment done succesfully!', 'success');
      toast(
        <Stack direction="horizontal">
          Transaction Successful
          <PrimaryButton>
            <Link
              href={`${registry && registry[chainId].blockExplorer}/tx/${
                tx.transactionHash
              }`}
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
      void handlePaymentError(err, chainId, tokenAddresses, amounts);
      console.log(err);
      // toast.error(err.message, {
      //   theme: "dark",
      // });
      throw err.message;
      return false;
    }
  }

  async function payUsingGnosis({
    paymentType,
    batchPayType,
    chainId,
    amounts,
    userAddresses,
    tokenAddresses,
    safeAddress,
    cardIds,
    circleId,
  }: PayUsingGnosisParams) {
    console.log({ cardIds, safeAddress });
    if (paymentType === "tokens") {
      console.log({ amounts });
      const data = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        gnosis: true,
        callerId: connectedUser,
        tokenAddresses,
      });
      const res = await gnosisPayment(safeAddress, data, chainId);
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
    } else if (paymentType === "currency") {
      const contractdata = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        gnosis: true,
        callerId: connectedUser,
      });
      const res = await gnosisPayment(safeAddress, contractdata, chainId);
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
