import Modal from "@/app/common/components/Modal";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { Registry, Token } from "@/app/types";
import { Box, Input, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  dataId: string;
  propertyName: string;
  handleClose: () => void;
};

function RewardComponent({ propertyName, dataId, handleClose }: Props) {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  const { localCollection: collection } = useLocalCollection();
  const reward = collection?.data[dataId][propertyName];

  const [chain, setChain] = useState(
    reward?.chain || (registry && registry["137"])
  );
  const [token, setToken] = useState(reward?.token);
  const [value, setValue] = useState(reward?.value.toString());

  return (
    // <EditTag
    //   tourId="create-card-modal-reward"
    //   name={
    //     reward?.value && reward?.value !== 0
    //       ? `${reward.value} ${reward.token.symbol}`
    //       : "Set Reward"
    //   }
    //   modalTitle="Set Reward"
    //   label=""
    //   modalOpen={modalOpen}
    //   setModalOpen={setModalOpen}
    //   icon={<IconEth color="accent" size="5" />}
    //   //   disabled={!canTakeAction("cardReward")}
    //   handleClose={() => {
    //     setModalOpen(false);
    //     setReward({
    //       chain,
    //       token,
    //       value: parseFloat(value),
    //     });
    //   }}
    // >
    <Modal handleClose={handleClose} title="Reward">
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
              {getFlattenedCurrencies(registry as Registry, chain.chainId).map(
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
                        token?.address === aToken.address
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
          </Stack>
        </Box>
      </Box>
    </Modal>
    // </EditTag>
  );
}

export default memo(RewardComponent);
