import Popover from "@/app/common/components/Popover";
import useCardService from "@/app/services/Card/useCardService";
import { CardType } from "@/app/types";
import { Box, IconDotsHorizontal, Text } from "degen";
import React, { useEffect, useState } from "react";
import { PopoverOption } from "../../Card/OptionPopover";
import { useLocalProject } from "../Context/LocalProjectContext";

type Props = {
  card: CardType;
  hover: boolean;
};

export default function QuickActions({ card, hover }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [validActions, setValidActions] = useState<string[]>([]);
  const { archiveCard, updateCard } = useCardService();
  const {
    projectCardActions,
    setBatchPayModalOpen,
    setSelectedCard,
    updateProject,
    setIsApplyModalOpen,
    setIsSubmitModalOpen,
  } = useLocalProject();

  useEffect(() => {
    if (projectCardActions && projectCardActions[card.id]) {
      // get call valid actions for this card
      const validActions = Object.keys(projectCardActions[card.id]).filter(
        (action: string) => (projectCardActions[card.id] as any)[action].valid
      );
      setValidActions(validActions);
    }
  }, [card.id, projectCardActions]);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      butttonComponent={
        <Box
          cursor="pointer"
          style={
            hover && validActions.length > 0 ? { opacity: 1 } : { opacity: 0 }
          }
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          padding="1"
          transitionDuration="300"
        >
          <Text variant="label">
            <IconDotsHorizontal size="5" />
          </Text>
        </Box>
      }
    >
      <Box
        backgroundColor="backgroundSecondary"
        borderRadius="2xLarge"
        borderWidth="0.5"
        maxHeight="72"
        overflow="auto"
      >
        {validActions.includes("close") && (
          <PopoverOption
            onClick={async (e) => {
              setIsOpen(false);
              e?.stopPropagation();
              const data = await updateCard(
                {
                  status: {
                    ...card.status,
                    active: false,
                  },
                },
                card.id
              );
              // if (data) {
              //   updateProject(data.project);
              // }
            }}
          >
            Close
          </PopoverOption>
        )}
        {validActions.includes("pay") && (
          <PopoverOption
            onClick={(e) => {
              setIsOpen(false);

              e?.stopPropagation();
              setSelectedCard(card);
              setBatchPayModalOpen(true);
            }}
          >
            Pay
          </PopoverOption>
        )}
        {validActions.includes("archive") && (
          <PopoverOption
            onClick={async (e) => {
              setIsOpen(false);
              e?.stopPropagation();
              const data = await archiveCard(card.id);
              if (data) {
                updateProject(data);
              }
            }}
          >
            Archive
          </PopoverOption>
        )}
        {validActions.includes("applyToBounty") && (
          <PopoverOption
            onClick={(e) => {
              setIsOpen(false);
              e?.stopPropagation();
              setSelectedCard(card);
              setIsApplyModalOpen(true);
            }}
          >
            Apply
          </PopoverOption>
        )}
        {validActions.includes("submit") && (
          <PopoverOption
            onClick={(e) => {
              setIsOpen(false);
              e?.stopPropagation();
              setSelectedCard(card);
              setIsSubmitModalOpen(true);
            }}
          >
            Submit
          </PopoverOption>
        )}
      </Box>
    </Popover>
  );
}
