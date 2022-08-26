import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import { BatchPayInfo, CardType } from "@/app/types";
import { QuestionCircleFilled } from "@ant-design/icons";
import { Box, Button, Stack, Text, useTheme } from "degen";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import { getAgregatedPaymentInfo } from "../../../services/Payment";
import { useBatchPayContext } from "./context/batchPayContext";

export const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 30rem;
  overflow-y: auto;
`;

export default function SelectCards() {
  const { localProject: project } = useLocalProject();
  const {
    setIsOpen,
    setBatchPayInfo,
    setCurrencyCards,
    setTokenCards,
    setStep,
  } = useBatchPayContext();

  const formatRows = (
    cards: {
      [key: string]: CardType;
    },
    cardIds: string[]
  ) => {
    // convert cards to string[][]
    const rows = cardIds
      ?.filter((id) => cards[id])
      .map((id) => {
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
  const [column, setColumn] = useState({
    value: project.columnOrder[project.columnOrder.length - 1],
    label:
      project.columnDetails[project.columnOrder[project.columnOrder.length - 1]]
        .name,
  });
  const [rows, setRows] = useState<React.ReactNode[][]>(
    formatRows(project.cards, project.columnDetails[column.value]?.cards)
  );
  const [filteredCards, setFilteredCards] = useState<string[]>(
    project.columnDetails[column.value]?.cards
  );

  // get project columns in option format
  const columns = project?.columnOrder?.map((column) => ({
    label: project.columnDetails[column].name,
    value: column,
  }));

  const { mode } = useTheme();

  // useEffect(() => {
  //   setColumn({
  //     value: project.columnOrder[project.columnOrder.length - 1],
  //     label:
  //       project.columnDetails[
  //         project.columnOrder[project.columnOrder.length - 1]
  //       ].name,
  //   });
  // }, []);

  useEffect(() => {
    if (project?.columnDetails) {
      // filter the project cards to show only the cards with assignee and reward
      const cards = project.columnDetails[column.value]?.cards.filter(
        (card) => {
          return (
            project.cards[card]?.assignee.length > 0 &&
            project.cards[card]?.assignee[0] !== "" &&
            project.cards[card]?.reward.value > 0 &&
            project.cards[card]?.status.paid === false
          );
        }
      );
      setFilteredCards(cards);
      setRows(formatRows(project.cards, cards));
      setChecked(formatRows(project.cards, cards)?.map(() => true));
    }
  }, [project, column.value]);
  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
        <Stack direction="horizontal" space="1" align="center">
          <Text variant="extraLarge" weight="semiBold">
            Select Cards
          </Text>
          <Tooltip
            html={<Text>Select the cards you want to batch pay for</Text>}
            theme={mode}
          >
            <Button shape="circle" size="small" variant="transparent">
              <QuestionCircleFilled style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
        </Stack>
        <Dropdown
          options={columns}
          selected={column}
          onChange={(option) => {
            setColumn(option);
          }}
        />
        <Box paddingY="4" />
        {rows?.length > 0 && (
          <Table
            columns={[`Cards (${rows.length})`, "Reward"]}
            rows={rows}
            showButton
            checked={checked}
            onClick={(checked) => {
              setChecked(checked);
            }}
          />
        )}
        {(rows?.length === 0 || !rows) && (
          <Stack space="1">
            <Text variant="base" weight="semiBold">
              {`For cards to show up here, they must have a reward value and at least one assignee. No such cards were found in ${column.label} column.`}
            </Text>
            {/* <Text variant="base" weight="semiBold">
              Card needs to have an assignee and reward
            </Text> */}
          </Stack>
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
              disabled={!checked?.filter((c) => c === true)?.length}
              onClick={async () => {
                // get selected cards
                const selectedCards = filteredCards?.filter(
                  (_, index) => checked[index]
                );
                const res = await getAgregatedPaymentInfo(
                  selectedCards,
                  project.cards[filteredCards[0]].reward.chain.chainId
                );
                console.log({ res });
                // cards with token address 0x0
                const currencyCards = selectedCards?.filter(
                  (card) => project.cards[card].reward.token.address === "0x0"
                );
                // cards with token address not 0x0
                const tokenCards = selectedCards?.filter(
                  (card) => project.cards[card].reward.token.address !== "0x0"
                );
                setCurrencyCards(currencyCards);
                setTokenCards(tokenCards);
                setBatchPayInfo(res as BatchPayInfo);
                if (res?.currency && res.currency.userIds.length > 0) {
                  setStep(1);
                } else {
                  setStep(2);
                }
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
