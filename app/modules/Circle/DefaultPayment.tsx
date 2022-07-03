import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { useGlobalContext } from "@/app/context/globalContext";
import { updateCircle } from "@/app/services/UpdateCircle";
import { Chain, CircleType, Token } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Heading, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

export default function DefaultPayment() {
  const queryClient = useQueryClient();
  const { registry } = useGlobalContext();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [chain, setChain] = useState(circle?.defaultPayment.chain);
  const [token, setToken] = useState(circle?.defaultPayment.token);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await updateCircle(
      {
        defaultPayment: {
          chain: chain as Chain,
          token: token as Token,
        },
      },
      circle?.id as string
    );
    setIsLoading(false);
    if (res) {
      queryClient.setQueryData(["circle", cId], res);
    }
  };
  return (
    <Stack>
      <Box>
        <Heading>Default Payment</Heading>
        <Text>Set the default way that contributors get paid</Text>
      </Box>
      <Stack>
        <Text size="extraLarge">Chain</Text>
        <Stack direction="horizontal">
          {getFlattenedNetworks(registry).map((aChain) => (
            <motion.button
              key={aChain.chainId}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0rem",
              }}
              onClick={() => setChain(aChain)}
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
          {getFlattenedCurrencies(registry, chain?.chainId as string)?.map(
            (aToken) => (
              <motion.button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0rem",
                }}
                onClick={() => setToken(aToken)}
                key={aToken.symbol}
              >
                <Tag
                  hover
                  tone={
                    token?.address === aToken.address ? "accent" : "secondary"
                  }
                >
                  {aToken.symbol}
                </Tag>
              </motion.button>
            )
          )}
        </Stack>
        <Box width="1/3" marginTop="4">
          <PrimaryButton
            icon={<SaveOutlined />}
            onClick={onSubmit}
            loading={isLoading}
          >
            Save
          </PrimaryButton>
        </Box>
        <Stack>
          <Box>
            <Heading>Token Approvals</Heading>
            <Text>Set approvals for tokens you wish to use for payments</Text>
          </Box>
          <Text size="extraLarge">Approved Tokens</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
