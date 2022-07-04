import EditTag from "@/app/common/components/EditTag";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { useGlobalContext } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconEth, Input, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React, { memo, useState } from "react";
import { useLocalCard } from "../hooks/LocalCardContext";

function CardReward() {
  const [modalOpen, setModalOpen] = useState(false);
  const { registry } = useGlobalContext();
  const { chain, setChain, token, setToken, value, setValue, onCardUpdate } =
    useLocalCard();
  const { canTakeAction } = useRoleGate();

  return (
    <EditTag
      tourId="create-card-modal-reward"
      name={value !== "0" ? `${value} ${token.symbol}` : "No Reward"}
      modalTitle="Select Deadline"
      label="Reward"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={<IconEth color="accent" size="5" />}
      disabled={!canTakeAction("cardReward")}
      handleClose={() => {
        void onCardUpdate();
        setModalOpen(false);
      }}
    >
      <Box height="96">
        <Box padding="8">
          <Stack>
            <Text size="extraLarge">Chain</Text>
            <Stack direction="horizontal">
              {getFlattenedNetworks(registry).map((aChain) => (
                <motion.button
                  key={aChain.name}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0rem",
                  }}
                  onClick={() => {
                    setChain(aChain);
                  }}
                >
                  <Tag
                    hover
                    tone={
                      chain?.chainId === aChain.chainId ? "accent" : "secondary"
                    }
                  >
                    {aChain.name}
                  </Tag>
                </motion.button>
              ))}
            </Stack>
            <Text size="extraLarge">Token</Text>
            <Stack direction="horizontal">
              {getFlattenedCurrencies(registry, chain.chainId).map((aToken) => (
                <motion.button
                  key={chain.chainId}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0rem",
                  }}
                  onClick={() => {
                    setToken(aToken);
                  }}
                >
                  <Tag
                    hover
                    tone={
                      token.address === aToken.address ? "accent" : "secondary"
                    }
                  >
                    {aToken.symbol}
                  </Tag>
                </motion.button>
              ))}
            </Stack>
            <Text size="extraLarge">Value</Text>
            <Input
              label=""
              units={token.symbol}
              min={0}
              placeholder="10"
              type="number"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            {/* <Button width="full" size="small">
          Save
        </Button> */}
          </Stack>
        </Box>
      </Box>
    </EditTag>
  );
}

export default memo(CardReward);
