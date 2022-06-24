import Modal from "@/app/common/components/Modal";
import Table from "@/app/common/components/Table";
import { CardType } from "@/app/types";
import { Box, Button, IconEth } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";

export default function BatchPay() {
  const [isOpen, setIsOpen] = useState(false);
  const { localProject: project } = useLocalProject();
  const [checked, setChecked] = useState([true, true]);

  const formatRows = (
    cards: {
      [key: string]: CardType;
    },
    cardIds: string[]
  ) => {
    // convert cards to string[][]
    const rows = cardIds.map((id) => {
      const card = cards[id];
      return [card.title, `${card.reward.value} ${card.reward.token.symbol}`];
    });
    return rows;
  };

  return (
    <>
      <Button
        size="small"
        variant="transparent"
        shape="circle"
        onClick={(e) => {
          setIsOpen(true);
        }}
      >
        <IconEth />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Batch Payment"
            handleClose={() => setIsOpen(false)}
            height="30rem"
          >
            <Box padding="8">
              <Table
                columns={["Card Name", "Reward"]}
                rows={formatRows(
                  project.cards,
                  project.columnDetails[project.columnOrder[1]].cards
                )}
                showButton
                checked={checked}
                onClick={(checked) => {
                  setChecked(checked);
                }}
              />
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
