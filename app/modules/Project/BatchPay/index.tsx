import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CardType } from "@/app/types";
import { IconEth, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { PopoverOption } from "../../Card/ActionPopover";
import { useLocalProject } from "../Context/LocalProjectContext";
import ApproveToken from "./ApproveToken";
import {
  BatchPayContext,
  useProviderBatchPayContext,
} from "./context/batchPayContext";
import CurrencyPayment from "./CurrencyPayment";
import SelectCards from "./SelectCards";
import TokenPayment from "./TokenPayment";

interface Props {
  card?: CardType;
}

export default function BatchPay({ card }: Props) {
  const context = useProviderBatchPayContext();
  const { localProject } = useLocalProject();

  const {
    setIsOpen,
    isOpen,
    step,
    setStep,
    setTokenCards,
    setCurrencyCards,
    setBatchPayInfo,
  } = context;

  // function to distribute reward equally among the assignees and return the array of reward of values
  const distributeReward = (reward: number, assignees: string[]) => {
    const rewardArray: number[] = [];
    const rewardPerAssignee = reward / assignees.length;
    assignees.forEach((_) => {
      rewardArray.push(rewardPerAssignee);
    });
    return rewardArray;
  };

  useEffect(() => {
    // set token card and stuff and skip the step dependig on the card reward token address
    if (card && isOpen) {
      if (card.reward?.token.address === "0x0") {
        setCurrencyCards([card.id]);
        setBatchPayInfo({
          approval: {
            tokenAddresses: [],
            values: [],
          },
          currency: {
            userIds: card.assignee,
            values: distributeReward(card.reward.value, card.assignee),
          },
          tokens: {
            tokenAddresses: [],
            values: [],
            userIds: [],
          },
        });
        setStep(1);
      } else {
        setTokenCards([card.id]);
        setBatchPayInfo({
          approval: {
            tokenAddresses: [card.reward.token.address],
            values: distributeReward(card.reward.value, card.assignee),
          },
          currency: {
            userIds: [],
            values: [],
          },
          tokens: {
            tokenAddresses: [card.reward.token.address],
            values: distributeReward(card.reward.value, card.assignee),
            userIds: card.assignee,
          },
        });
        setStep(2);
      }
    }
  }, [isOpen]);

  return (
    <BatchPayContext.Provider value={context}>
      {card ? (
        <PrimaryButton onClick={() => setIsOpen(true)} icon={<IconEth />}>
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
      )}
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Batch Payment"
            handleClose={() => setIsOpen(false)}
            height="40rem"
            size="large"
          >
            {step === 0 && localProject && <SelectCards />}
            {step === 1 && <CurrencyPayment />}
            {step === 2 && <ApproveToken />}
            {step === 3 && <TokenPayment />}
          </Modal>
        )}
      </AnimatePresence>
    </BatchPayContext.Provider>
  );
}
