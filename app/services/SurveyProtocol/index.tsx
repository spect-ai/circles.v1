/* eslint-disable no-param-reassign */
import SurveyABI from "@/app/common/contracts/local/SurveyHub.json";
import { BigNumberish, ethers } from "ethers";
import { toast } from "react-toastify";
import { erc20ABI } from "wagmi";
// eslint-disable-next-line import/no-extraneous-dependencies
import { readContract } from "@wagmi/core";
import { ConditionInfo, DistributionInfo } from "@/app/types";
import { getContract, getDecimals, switchNetwork } from "../Paymentv2/utils";
import getPredictedGas from "../GasPrediction";

// const localAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const createSurvey = async (
  chainId: string,
  surveyHubAddress: string,
  tokenAddress: string,
  totalAmount: number,
  callerAddress: string,
  distributionType = 0,
  amountPerResponse?: number,
  minResponses?: number,
  minNumDays?: number
) => {
  try {
    await switchNetwork(chainId);
    const surveyHub = await getContract(surveyHubAddress, SurveyABI.abi);
    let tx;
    if (totalAmount === 0) {
      toast.error("Please enter a total amount");
      return false;
    }
    if (distributionType === 1) {
      if (!amountPerResponse) {
        toast.error("Please enter an amount per response");
        return false;
      }
      minResponses = 0;
      minNumDays = 0;
    }

    if (distributionType === 0) {
      if (!minResponses && !minNumDays) {
        toast.error("Please enter a minimum number of responses or days");
        return false;
      }
      amountPerResponse = 0;
    }

    let maxFeePerGas = ethers.BigNumber.from(65670415053); // fallback to 66 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    if (["137"].includes(chainId)) {
      const feeEstimate = await getPredictedGas(chainId);
      maxFeePerGas = ethers.utils.parseUnits(
        `${Math.ceil(feeEstimate.maxFee)}`,
        "gwei"
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        `${Math.ceil(feeEstimate.maxPriorityFee)}`,
        "gwei"
      );
    }
    if (tokenAddress === "0x0") {
      const estimatedGas = await surveyHub.estimateGas.createSurveyWithEther(
        distributionType,
        ethers.utils.parseEther(amountPerResponse?.toString() || "0"),
        minResponses || 0,
        minNumDays || 0,
        {
          value: ethers.utils.parseEther(totalAmount.toString()),
          maxFeePerGas,
          maxPriorityFeePerGas,
        }
      );
      tx = await surveyHub.createSurveyWithEther(
        distributionType,
        ethers.utils.parseEther(amountPerResponse?.toString() || "0"),
        minResponses || 0,
        minNumDays || 0,
        {
          value: ethers.utils.parseEther(totalAmount.toString()),
          maxFeePerGas,
          maxPriorityFeePerGas,
          gasLimit: Math.ceil(estimatedGas.toNumber() * 1.2),
        }
      );
    } else {
      const numDecimals = await getDecimals(tokenAddress);
      const amountInWei = ethers.utils
        .parseEther(totalAmount.toString())
        .div(ethers.BigNumber.from(10).pow(18 - numDecimals));
      const data = await readContract({
        chainId: parseInt(chainId),
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [
          callerAddress as `0x${string}`,
          surveyHubAddress as `0x${string}`,
        ],
      });
      if (data < amountInWei) {
        const tokenContract = await getContract(tokenAddress, erc20ABI);
        const gasEstimate = await tokenContract.estimateGas.approve(
          surveyHubAddress,
          ethers.constants.MaxUint256
        );
        const approveTx = await tokenContract.approve(
          surveyHubAddress,
          ethers.constants.MaxUint256,
          {
            gasLimit: Math.ceil(gasEstimate.toNumber() * 1.2),
            maxFeePerGas,
            maxPriorityFeePerGas,
          }
        );

        await approveTx.wait();
      }
      const gasEstimate = await surveyHub.estimateGas.createSurveyWithToken(
        distributionType,
        tokenAddress,
        ethers.utils.parseEther(amountPerResponse?.toString() || "0"),
        minResponses || 0,
        minNumDays || 0,
        amountInWei,
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        }
      );
      tx = await surveyHub.createSurveyWithToken(
        distributionType,
        tokenAddress,
        ethers.utils.parseEther(amountPerResponse?.toString() || "0"),
        minResponses || 0,
        minNumDays || 0,
        amountInWei,
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
          gasLimit: Math.ceil(gasEstimate.toNumber() * 1.2),
        }
      );
    }
    return tx.wait();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      console.error(err.message);
      if (err.message.includes("Invalid transaction params")) {
        toast.error(
          "Please switch to another network & switch back to the current network. If this error persists, please report it to us."
        );
      } else if (err.message.includes("Try again after some time")) {
        toast.error(
          "Sometimes, all you need is a second try, please click the button again 🙏. If this error persists, please report it to us."
        );
      } else toast.error("Error creating survey");
    }
  }
  return false;
};

export const getLastSurveyId = async (
  surveyHubAddress: string,
  chainId: string
) => {
  const count = await readContract({
    address: surveyHubAddress as `0x${string}`,
    abi: SurveyABI.abi,
    functionName: "surveyCount",
    chainId: parseInt(chainId),
  });
  return parseInt(ethers.utils.formatUnits(count as BigNumberish, 0)) - 1;
};

export const getSurveyDistributionInfo = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number
) => {
  const res = await readContract({
    address: surveyHubAddress as `0x${string}`,
    abi: SurveyABI.abi,
    functionName: "distributionInfo",
    args: [surveyId],
    chainId: parseInt(chainId),
  });
  return res as DistributionInfo;
};

export const getSurveyConditionInfo = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number
) => {
  const res = await readContract({
    address: surveyHubAddress as `0x${string}`,
    abi: SurveyABI.abi,
    functionName: "conditionInfo",
    args: [surveyId],
    chainId: parseInt(chainId),
  });
  return res as ConditionInfo;
};

export const hasClaimedSurveyReceipt = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number,
  callerAddress: string
) => {
  try {
    const res = await readContract({
      address: surveyHubAddress as `0x${string}`,
      abi: SurveyABI.abi,
      functionName: "hasResponded",
      args: [surveyId, callerAddress],
      chainId: parseInt(chainId),
    });
    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const hasClaimedSurveyToken = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number,
  callerAddress: string
) => {
  try {
    const res = await readContract({
      address: surveyHubAddress as `0x${string}`,
      abi: SurveyABI.abi,
      functionName: "hasReceivedPayment",
      args: [surveyId, callerAddress],
      chainId: parseInt(chainId),
    });
    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const hasWonLottery = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number,
  callerAddress: string
) => {
  const res = await readContract({
    address: surveyHubAddress as `0x${string}`,
    abi: SurveyABI.abi,
    functionName: "findLotteryWinner",
    args: [surveyId],
    chainId: parseInt(chainId),
  });

  if (callerAddress === res) {
    return true;
  }
  return false;
};

export const getEscrowBalance = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number
) => {
  const res = await readContract({
    address: surveyHubAddress as `0x${string}`,
    abi: SurveyABI.abi,
    functionName: "escrowBalance",
    args: [surveyId],
    chainId: parseInt(chainId),
  });
  return res;
};

export const isEligibleToClaimSurveyToken = async (
  chainId: string,
  surveyHubAddress: string,
  surveyId: number,
  callerAddress: string,
  distributionInfo?: {
    distributionType: 0 | 1 | null;
    requestId: BigNumberish;
  },
  hasClaimedSurveyTokens?: boolean
) => {
  let distrInfo = distributionInfo;
  if (!distrInfo) {
    distrInfo = (await getSurveyDistributionInfo(
      chainId,
      surveyHubAddress,
      surveyId
    )) as {
      distributionType: 0 | 1 | null;
      requestId: BigNumberish;
    };
  }
  let hasClaimed;

  if (hasClaimedSurveyTokens === undefined) {
    hasClaimed = await hasClaimedSurveyToken(
      chainId,
      surveyHubAddress,
      surveyId,
      callerAddress
    );
  } else hasClaimed = hasClaimedSurveyTokens;
  if (hasClaimed) return false;
  if (distributionInfo?.distributionType === 0) {
    if (distributionInfo.requestId.toString() === "0") return false;
    return hasWonLottery(chainId, surveyHubAddress, surveyId, callerAddress);
  }
  const res = await hasClaimedSurveyReceipt(
    chainId,
    surveyHubAddress,
    surveyId,
    callerAddress
  );
  return res;
};
