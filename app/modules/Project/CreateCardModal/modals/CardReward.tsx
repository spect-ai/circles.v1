import EditTag from "@/app/common/components/EditTag";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Registry } from "@/app/types";
import { Box, IconEth, Input, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import { useLocalCard } from "../hooks/LocalCardContext";

function CardReward() {
  const [modalOpen, setModalOpen] = useState(false);
  const { chain, setChain, token, setToken, value, setValue, onCardUpdate } =
    useLocalCard();
  const { canTakeAction } = useRoleGate();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  return (
    <EditTag
      tourId="create-card-modal-reward"
      name={value !== "0" ? `${value} ${token.symbol}` : "No Reward"}
      modalTitle="Set Reward"
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
              {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
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
                    <Text
                      color={
                        chain?.chainId === aChain.chainId ? "accent" : "inherit"
                      }
                    >
                      {aChain.name}
                    </Text>
                  </Tag>
                </motion.button>
              ))}
            </Stack>
            <Text size="extraLarge">Token</Text>
            <Stack direction="horizontal">
              {getFlattenedCurrencies(registry as Registry, chain.chainId).map(
                (aToken) => (
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
                        token.address === aToken.address
                          ? "accent"
                          : "secondary"
                      }
                    >
                      <Text
                        color={
                          token?.address === aToken.address
                            ? "accent"
                            : "inherit"
                        }
                      >
                        {aToken.symbol}
                      </Text>
                    </Tag>
                  </motion.button>
                )
              )}
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
