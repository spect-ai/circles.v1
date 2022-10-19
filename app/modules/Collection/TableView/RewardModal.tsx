import Modal from "@/app/common/components/Modal";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { Registry, Reward, Token } from "@/app/types";
import { Box, Input, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { useQuery } from "react-query";

type Props = {
  form: any;
  dataId?: string;
  propertyName: string;
  handleClose: (reward: Reward, dataId: string, propertyName: string) => void;
};

function RewardModal({ propertyName, dataId, handleClose, form }: Props) {
  const { data: registry } = useQuery<Registry>(
    ["registry", form.parents[0].slug],
    {
      enabled: false,
    }
  );

  const reward = dataId ? form?.data[dataId][propertyName] : undefined;

  const [chain, setChain] = useState(
    reward?.chain || (registry && registry["137"])
  );
  const [token, setToken] = useState(reward?.token);
  const [value, setValue] = useState(reward?.value.toString());

  return (
    <Modal
      handleClose={() => {
        handleClose(
          {
            chain,
            token,
            value: parseFloat(value),
          },
          dataId || "",
          propertyName
        );
      }}
      title="Reward"
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

export default memo(RewardModal);
