import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import { BatchPayInfo, CardType } from "@/app/types";
import {
  QuestionCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Box, Button, Heading, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tippy";
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
    const rows = cardIds?.map((id) => {
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
    formatRows(project.cards, project.columnDetails[column.value]?.cards)
  );

  // get project columns in option format
  const columns = project?.columnOrder?.map((column) => ({
    label: project.columnDetails[column].name,
    value: column,
  }));

  useEffect(() => {
    if (project?.columnDetails) {
      // filter the project cards to show only the cards with assignee and reward
      const cards = project.columnDetails[column.value]?.cards.filter(
        (card) =>
          project.cards[card].assignee && project.cards[card].reward.value > 0
      );
      setRows(formatRows(project.cards, cards));
      setChecked(formatRows(project.cards, cards)?.map(() => true));
    }
  }, [project]);
  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
        <Stack direction="horizontal" space="1" align="center">
          <Text variant="extraLarge" weight="semiBold">
            Select Cards
          </Text>
          <Tooltip html={<Text>Batch Pay</Text>}>
            <Button shape="circle" size="small" variant="transparent">
              <QuestionCircleFilled style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
        </Stack>
        <Dropdown
          options={columns}
          selected={column}
          onChange={(option) => {
            console.log({ option });
            setColumn(option);
            const cards = project.columnDetails[option.value].cards.filter(
              (card) =>
                project.cards[card].assignee &&
                project.cards[card].reward.value > 0
            );
            setRows(formatRows(project.cards, cards));
            setChecked(formatRows(project.cards, cards).map(() => true));
          }}
        />
        <Box paddingY="4" />
        {rows && (
          <Table
            columns={["Card Name", "Reward"]}
            rows={rows}
            showButton
            checked={checked}
            onClick={(checked) => {
              setChecked(checked);
            }}
          />
        )}
        {!rows && (
          <Text variant="base" weight="semiBold">
            No cards found
          </Text>
        )}
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
                  project.parents[0].defaultPayment.chain.chainId
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
