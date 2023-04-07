import PrimaryButton from "@/app/common/components/PrimaryButton";
import { connectedUserAtom } from "@/app/state/global";
import { Registry } from "@/app/types";
import { Stack } from "degen";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { gnosisPayment } from "../Gnosis";
import useDistributor from "./useDistributor";
import useERC20 from "./useERC20";

declare let window: {
  open: (url: string, target: string) => void;
};
interface BatchPayParams {
  paymentType: string;
  batchPayType: string;
  chainId: string;
  userAddresses: string[];
  amounts: number[];
  tokenAddresses: string[];
  cardIds: string[];
  circleId: string;
  circleRegistry?: Registry;
}

interface PayUsingGnosisParams extends BatchPayParams {
  safeAddress: string;
  nonce?: number;
}

export default function usePaymentGateway(
  handleStatusUpdate?: (status: unknown, txHash: string) => Promise<void>
) {
  const { distributeEther, distributeTokens } = useDistributor();
  const { hasBalances } = useERC20();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [connectedUser] = useAtom(connectedUserAtom);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  async function handlePaymentError(
    err: unknown,
    expectedNetwork: string,
    tokenAddresses: Array<string>,
    tokenValues: Array<number>
  ) {
    if (!address) {
      return;
    }
    if (chain?.id.toString() !== expectedNetwork) {
      console.error("Wrong Network");
    } else {
      await hasBalances(tokenAddresses, tokenValues, address);
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
    circleRegistry,
  }: BatchPayParams) {
    let tx;
    if (paymentType === "tokens") {
      tx = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        tokenAddresses,
        paymentMethod: "wallet",
        callerId: connectedUser,
        type: batchPayType,
        cardIds,
        circleId,
        circleRegistry,
      });
    } else if (paymentType === "currency") {
      tx = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
        paymentMethod: "wallet",
        callerId: connectedUser,
        type: batchPayType,
        cardIds,
        circleId,
        circleRegistry,
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
    circleRegistry,
  }: BatchPayParams) {
    try {
      if (chain?.id.toString() !== chainId) {
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
        circleRegistry,
      });

      if (handleStatusUpdate) {
        await handleStatusUpdate(cardIds, tx.transactionHash);
      }
      // notify('Payment done succesfully!', 'success');
      toast(
        <Stack direction="horizontal">
          Transaction Successful
          <PrimaryButton
            onClick={() => {
              const url = circleRegistry
                ? `${circleRegistry[chainId].blockExplorer}tx/${tx.transactionHash}`
                : registry &&
                  `${registry[chainId].blockExplorer}tx/${tx.transactionHash}`;
              window.open(url || "", "_blank");
            }}
          >
            View Transaction
          </PrimaryButton>
        </Stack>,
        {
          theme: "dark",
        }
      );
      return tx.transactionHash;
    } catch (err: unknown) {
      handlePaymentError(err, chainId, tokenAddresses, amounts);
      console.warn(err);
      throw err;
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
    nonce,
  }: PayUsingGnosisParams): Promise<boolean | string> {
    if (paymentType === "tokens") {
      const data = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        paymentMethod: "gnosis",
        callerId: connectedUser,
        tokenAddresses,
        nonce,
      });
      const res = await gnosisPayment(safeAddress, data, chainId);
      if (res) {
        toast.success("Transaction sent to your safe", { theme: "dark" });
      } else {
        toast.error("Error Occurred while sending your transation to safe");
      }
      return res;
    }
    if (paymentType === "currency") {
      const contractdata = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        paymentMethod: "gnosis",
        callerId: connectedUser,
        nonce,
      });
      const res = await gnosisPayment(safeAddress, contractdata, chainId);
      if (res) {
        toast.success("Transaction sent to your safe", { theme: "dark" });
      } else {
        toast.error("Error Occurred while sending your transation to safe");
      }
      return res;
    }
    return false;
  }

  return {
    batchPay,
    payUsingGnosis,
  };
}
