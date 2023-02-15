import SurveyABI from "@/app/common/contracts/local/SurveyHub.json";
import {
  getContract,
  getDecimals,
  hasAllowance,
  switchNetwork,
} from "../Paymentv2/utils";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { erc20ABI } from "wagmi";
import { readContract } from "@wagmi/core";

// const localAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const createSurvey = async (
  chainId: string,
  surveyHubAddress: string,
  tokenAddress: string,
  distributionType: number = 0,
  totalAmount: number,
  callerAddress: string,
  amountPerResponse?: number,
  minResponses?: number,
  minNumDays?: number
) => {
  try {
    console.log({ chainId, surveyHubAddress, tokenAddress });
    await switchNetwork(chainId);
    const surveyHub = await getContract(surveyHubAddress, SurveyABI.abi);
    let tx;
    if (totalAmount === 0) {
      toast.error("Please enter a total amount");
      return;
    }
    if (distributionType === 1) {
      if (!amountPerResponse) {
        toast.error("Please enter an amount per response");
        return;
      }
      minResponses = 0;
      minNumDays = 0;
    }

    if (distributionType === 0) {
      if (!minResponses && !minNumDays) {
        toast.error("Please enter a minimum number of responses or days");
        return;
      }
      amountPerResponse = 0;
    }

    console.log({
      surveyHub,
      distributionType,
      totalAmount,
      amountPerResponse,
      minResponses,
      minNumDays,
      tokenAddress,
    });
    if (tokenAddress === "0x0") {
      tx = await surveyHub.createSurveyWithEther(
        distributionType,
        ethers.utils.parseEther(amountPerResponse?.toString() || "0"),
        minResponses || 0,
        minNumDays || 0,
        {
          value: ethers.utils.parseEther(totalAmount.toString()),
        }
      );
    } else {
      console.log({
        totalAmount,
        amt: ethers.utils.parseEther(totalAmount.toString()),
      });
      const numDecimals = await getDecimals(tokenAddress);
      const amountInWei = ethers.utils
        .parseEther(totalAmount.toString())
        .div(ethers.BigNumber.from(10).pow(18 - numDecimals));
      console.log({ amountInWei });
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
      console.log({ data });
      if (data < amountInWei) {
        {
          const tokenContract = await getContract(tokenAddress, erc20ABI);
          const approveTx = await tokenContract.approve(
            surveyHubAddress,
            ethers.constants.MaxUint256
          );

          await approveTx.wait();
        }
      }
      console.log("creating survey ...");
      tx = await surveyHub.createSurveyWithToken(
        distributionType,
        tokenAddress,
        ethers.utils.parseEther(amountPerResponse?.toString() || "0"),
        minResponses || 0,
        minNumDays || 0,
        amountInWei
      );
      console.log("sdsds");
    }
    return await tx.wait();
  } catch (err) {
    console.log(err);
    toast.error("Error creating survey");
  }
};

export const getLastSurveyId = async (surveyHubAddress: string) => {
  const surveyHub = await getContract(surveyHubAddress, SurveyABI.abi);
  const count = await surveyHub.surveyCount();
  return parseInt(ethers.utils.formatUnits(count, 0));
};
