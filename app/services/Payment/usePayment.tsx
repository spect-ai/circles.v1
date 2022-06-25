import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import useDistributor from "./useDistributor";
import useERC20 from "./useERC20";

declare let window: any;

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

  async function executeBatchPay(
    type: string,
    chainId: string,
    userAddresses: string[],
    amounts: number[],
    tokenAddresses: string[]
  ) {
    let tx;
    if (type === "tokens") {
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

  async function batchPay(
    chainId: string,
    type: "tokens" | "currency",
    ethAddresses: Array<string>,
    tokenValues: Array<number>,
    tokenAddresses: Array<string>,
    cardIds?: string[],
    epochId?: string
  ) {
    try {
      if (activeChain?.id.toString() !== chainId) {
        switchNetworkAsync && (await switchNetworkAsync(parseInt(chainId)));
      }
      console.log({ ethAddresses, tokenValues, type, chainId });
      const tx = await executeBatchPay(
        type,
        chainId,
        ethAddresses,
        tokenValues,
        tokenAddresses
      );
      if (handleStatusUpdate) {
        await handleStatusUpdate(epochId || cardIds, tx.transactionHash);
      }
      // notify('Payment done succesfully!', 'success');
      toast("Payment done succesfully!", {
        theme: "dark",
      });
      return tx.transactionHash;
    } catch (err: any) {
      void handlePaymentError(err, chainId, tokenAddresses, tokenValues);
      console.log(err);
      toast.error(err.message, {
        theme: "dark",
      });
      return false;
    }
  }

  return {
    batchPay,
  };
}
