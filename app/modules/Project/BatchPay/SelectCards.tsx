import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import { BatchPayInfo, CardType } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAgregatedPaymentInfo } from "../../../services/BatchPay";

type Props = {
  setBatchPayInfo: (batchPayInfo: BatchPayInfo) => void;
  setIsOpen: (isOpen: boolean) => void;
  setStep: (step: number) => void;
};

export const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 30rem;
  overflow-y: auto;
`;

export default function SelectCards({
  setBatchPayInfo,
  setIsOpen,
  setStep,
}: Props) {
  const { localProject: project } = useLocalProject();

  const formatRows = (
    cards: {
      [key: string]: CardType;
    },
    cardIds: string[]
  ) => {
    // convert cards to string[][]
    const rows = cardIds.map((id) => {
      const card = cards[id];
      return [
        <Text key={id} variant="base" weight="semiBold">
          {card.title}
        </Text>,
        <Text key={id} variant="base" weight="semiBold">
          {`${card.reward.value} ${card.reward.token.symbol}`}
        </Text>,
      ];
    });
    return rows;
  };

  const [checked, setChecked] = useState<boolean[]>([]);
  const [column, setColumn] = useState({ label: "Done", value: "column-3" });
  const [rows, setRows] = useState<React.ReactNode[][]>(
    formatRows(project.cards, project.columnDetails[column.value].cards)
  );

  // get project columns in option format
  const columns = project?.columnOrder?.map((column) => ({
    label: project.columnDetails[column].name,
    value: column,
  }));

  useEffect(() => {
    if (project?.columnDetails) {
      setRows(
        formatRows(project.cards, project.columnDetails[column.value].cards)
      );
      setChecked(
        formatRows(
          project.cards,
          project.columnDetails[column.value].cards
        ).map(() => true)
      );
    }
  }, [project]);
  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
        <Text variant="extraLarge" weight="semiBold">
          Select Cards
        </Text>
        <Dropdown
          options={columns}
          selected={column}
          onChange={(option) => {
            setColumn(option);
            setRows(
              formatRows(
                project.cards,
                project.columnDetails[option.value].cards
              )
            );
            setChecked(
              formatRows(
                project.cards,
                project.columnDetails[option.value].cards
              ).map(() => true)
            );
          }}
        />
        <Box paddingY="4" />
        <Table
          columns={["Card Name", "Reward"]}
          rows={rows}
          showButton
          checked={checked}
          onClick={(checked) => {
            setChecked(checked);
          }}
        />
      </ScrollContainer>
      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            <PrimaryButton
              tone="red"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              onClick={async () => {
                // get selected cards
                const selectedCards = project.columnDetails[
                  column.value
                ].cards.filter((_, index) => checked[index]);
                console.log({ selectedCards });
                const res = await getAgregatedPaymentInfo(
                  selectedCards,
                  "80001" // to do change the network to the current network
                );
                console.log({ res });
                setBatchPayInfo(res as BatchPayInfo);
                setStep(1);
              }}
            >
              Continue
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
