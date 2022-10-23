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
import RewardField from "../../PublicForm/RewardField";

type Props = {
  form: any;
  dataId?: string;
  propertyName: string;
  handleClose: (reward: Reward, dataId: string, propertyName: string) => void;
};

function RewardModal({ propertyName, dataId, handleClose, form }: Props) {
  const [data, setData] = useState(dataId ? form?.data[dataId] : undefined);

  console.log({ data });
  return (
    <Modal
      handleClose={() => {
        handleClose(
          {
            chain: data[propertyName].chain,
            token: data[propertyName].token,
            value: parseFloat(data[propertyName].value),
          },
          dataId || "",
          propertyName
        );
      }}
      title="Reward"
    >
      <Box padding="8">
        <RewardField
          form={form}
          propertyName={propertyName}
          data={data}
          updateData={(reward: Reward) => {
            setData({
              ...data,
              [propertyName]: reward,
            });
          }}
        />
      </Box>
      {/* <Box height="96">
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
              units={token?.label}
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
      </Box> */}
    </Modal>
    // </EditTag>
  );
}

export default memo(RewardModal);
