import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { Registry } from "@/app/types";
import { Stack } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { biconomyPayment } from "../Biconomy";
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
  nonce?: number;
}

export default function usePaymentGateway(
  handleStatusUpdate?: (status: any, txHash: string) => Promise<void>
) {
  const { distributeEther, distributeTokens } = useDistributor();
  const { hasBalances } = useERC20();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
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
      return;
    }
    if (window.ethereum?.networkVersion !== expectedNetwork)
      console.log("Wrong Network");
    else {
      const [sufficientBalance, insufficientBalanceTokenAddress] =
        await hasBalances(tokenAddresses, tokenValues, address as string);
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
      });
    } else if (paymentType === "currency") {
      console.log({ userAddresses });
      tx = await distributeEther({
        contributors: userAddresses,
        values: amounts,
        chainId,
        paymentMethod: "wallet",
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
      console.log({ userAddresses, amounts });
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
              target="_blank"
              rel="noopener noreferrer"
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
    nonce,
  }: PayUsingGnosisParams): Promise<boolean> {
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
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
      return res;
    } else if (paymentType === "currency") {
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
      if (res)
        toast.success("Transaction sent to your safe", { theme: "dark" });
      else toast.error("Error Occurred while sending your transation to safe");
      return res;
    }
    return false;
  }

  async function payGasless({
    paymentType,
    batchPayType,
    chainId,
    amounts,
    userAddresses,
    tokenAddresses,
    cardIds,
    circleId,
  }: BatchPayParams): Promise<boolean> {
    if (paymentType === "tokens" && registry) {
      const {
        filteredTokenAddresses,
        filteredRecipients,
        valuesInWei,
        id,
        overrides,
      } = await distributeTokens({
        contributors: userAddresses,
        values: amounts,
        chainId,
        type: batchPayType,
        cardIds,
        circleId,
        paymentMethod: "gasless",
        callerId: connectedUser,
        tokenAddresses,
      });
      await biconomyPayment(
        address || "",
        registry[chainId].distributorAddress as string,
        {
          filteredTokenAddresses,
          filteredRecipients,
          valuesInWei,
          id,
          overrides,
        }
      );
      toast.success("Transaction sent");
    }
    return false;
  }

  return {
    batchPay,
    payUsingGnosis,
    payGasless,
  };
}
