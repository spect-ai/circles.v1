import Modal from "@/app/common/components/Modal";
import { RetroType } from "@/app/types";
import { useEffect } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import {
  BatchPayContext,
  useProviderBatchPayContext,
} from "./context/batchPayContext";
import OneClickPayment from "./OneClickPay";
import SelectCards from "./SelectCards";

interface Props {
  retro?: RetroType;
  setIsOpen: (isOpen: boolean) => void;
}

export default function BatchPay({ retro, setIsOpen }: Props) {
  const context = useProviderBatchPayContext({ setIsOpen });
  const { localProject } = useLocalProject();

  const { step, setStep, setBatchPayInfo } = context;

  // function to distribute reward equally among the assignees and return the array of reward of values
  // const distributeReward = (reward: number, assignees: string[]) => {
  //   const rewardArray: number[] = [];
  //   const rewardPerAssignee = reward / assignees.length;
  //   assignees.forEach((_) => {
  //     rewardArray.push(rewardPerAssignee);
  //   });
  //   return rewardArray;
  // };

  useEffect(() => {
    // set token card and stuff and skip the step depending on the card reward token address.
    if (retro) {
      if (retro.reward.token.address === "0x0") {
        setBatchPayInfo({
          payCircle: false,
          retroId: retro.id,
          approval: {
            tokenAddresses: [],
            values: [],
          },
          currency: {
            userIds: retro.members,
            values: retro.members.map(
              (member) => retro.distribution[member] * retro.reward.value
            ),
          },
          tokens: {
            tokenAddresses: [],
            values: [],
            userIds: [],
          },
          chainId: retro.reward.chain.chainId,
          retro: retro,
        });
        setStep(1);
      } else {
        setBatchPayInfo({
          payCircle: false,
          retroId: retro.id,
          approval: {
            tokenAddresses: [retro.reward.token.address],
            values: [retro.reward.value],
          },
          currency: {
            userIds: [],
            values: [],
          },
          tokens: {
            tokenAddresses: retro.members.map(() => retro.reward.token.address),
            userIds: retro.members,
            values: retro.members.map((member) => retro.distribution[member]),
          },
          chainId: retro.reward.chain.chainId,
          retro: retro,
        });
        setStep(1);
      }
    } else {
      setStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BatchPayContext.Provider value={context}>
      {/* {card ? (
        <PrimaryButton
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          icon={<IconEth />}
        >
          Pay
        </PrimaryButton>
      ) : (
        <PopoverOption
          tourId="batch-pay-button"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Stack direction="horizontal" space="2">
            <IconEth />
            batch Pay
          </Stack>
        </PopoverOption>
      )} */}
      <Modal
        title="Batch Payment"
        handleClose={() => setIsOpen(false)}
        height="40rem"
        size="large"
      >
        {step === 0 && localProject && <SelectCards />}
        {/* {step === 1 && <CurrencyPayment />}
        {step === 2 && <ApproveToken />}
        {step === 3 && <TokenPayment />} */}
        {step === 1 && <OneClickPayment />}
      </Modal>
    </BatchPayContext.Provider>
  );
}
