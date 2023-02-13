import SurveyABI from "@/app/common/contracts/local/SurveyHub.json";
import { getContract } from "../Paymentv2/utils";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const localAddress = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";

export const createSurvey = async (
  tokenAddress: string,
  distributionType: number = 0,
  totalAmount: number,
  amountPerResponse?: number,
  minResponses?: number,
  minNumDays?: number
) => {
  try {
    const surveyHub = await getContract(localAddress, SurveyABI.abi);
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
      tx = await surveyHub.createSurveyWithToken(
        distributionType,
        tokenAddress,
        amountPerResponse || 0,
        minResponses || 0,
        minNumDays || 0
      );
    }
    return await tx.wait();
  } catch (err) {
    console.log(err);
    toast.error("Error creating survey");
  }
};

export const getLastSurveyId = async () => {
  const surveyHub = await getContract(localAddress, SurveyABI.abi);
  return (await surveyHub.surveyCount()) - 1;
};
