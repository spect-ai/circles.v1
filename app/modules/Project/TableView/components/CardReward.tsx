import EditTag from "@/app/common/components/EditTag";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

import { Box, IconEth, Input, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import { CardType, Chain, Token, Registry } from "@/app/types";
import useCardService from "@/app/services/Card/useCardService";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

type CardProps = {
  id: string;
  card: Partial<CardType>;
};

function CardReward({ id, card }: CardProps) {
  const { updateProject } = useLocalProject();
  const { updateCard } = useCardService();
  const [value, setValue] = useState(card.reward?.value?.toString() as string);
  const [token, setToken] = useState(card.reward?.token as Token);
  const [chain, setChain] = useState(card.reward?.chain as Chain);
  const [modalOpen, setModalOpen] = useState(false);
  const { canTakeAction } = useRoleGate();
  const onCardUpdate = async () => {
    const payload = {
      reward: { chain: chain, value: parseFloat(value), token: token },
    };
    const res = await updateCard(payload, id);
    console.log(res);
    if (res?.id) updateProject(res.project);
  };

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  return (
    <EditTag
      tourId="create-card-modal-reward"
      name={value !== "0" ? `${value} ${token?.symbol}` : "No Reward"}
      modalTitle="Set Reward"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={<IconEth color="accent" size="5" />}
      disabled={!canTakeAction("cardReward")}
      handleClose={() => {
        if (
          parseFloat(value) !== card?.reward?.value ||
          token.symbol !== card?.reward.token.symbol ||
          chain.chainId !== card?.reward.chain.chainId
        ) {
          void onCardUpdate();
        }
        setModalOpen(false);
      }}
    >
      <Box height="96">
        <Box padding="8">
          <Stack>
            <Text size="extraLarge" weight="semiBold">
              Chain
            </Text>
            <Stack direction="horizontal" wrap>
              {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
                <Box
                  key={aChain.name}
                  onClick={() => {
                    setChain(aChain);
                    setToken({} as Token);
                  }}
                  cursor="pointer"
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
                </Box>
              ))}
            </Stack>
            <Text size="extraLarge" weight="semiBold">
              Token
            </Text>
            <Stack direction="horizontal" wrap>
              {getFlattenedCurrencies(registry as Registry, chain?.chainId).map(
                (aToken) => (
                  <Box
                    key={aToken.address}
                    onClick={() => {
                      setToken(aToken);
                    }}
                    cursor="pointer"
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
                  </Box>
                )
              )}
            </Stack>
            <Text size="extraLarge" weight="semiBold">
              Value
            </Text>
            <Input
              label=""
              units={token?.symbol}
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
