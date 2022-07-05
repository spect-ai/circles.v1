import PrimaryButton from "@/app/common/components/PrimaryButton";
import queryClient from "@/app/common/utils/queryClient";
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
import { useQuery } from "react-query";
import styled from "styled-components";
import ApproveToken from "./ApproveToken";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: 30rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

export default function DefaultPayment() {
  const { registry } = useGlobalContext();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [chain, setChain] = useState(circle?.defaultPayment.chain);
  const [token, setToken] = useState(circle?.defaultPayment.token);

  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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
    setIsDirty(false);
    setIsLoading(false);
    if (res) {
      queryClient.setQueryData(["circle", cId], res);
    }
  };

  return (
    <Container>
      <Stack space="4">
        {/* <Stack>
          <Box>
            <Heading>Token Approvals</Heading>
            <Text>Set approvals for tokens you wish to use for payments</Text>
          </Box>
          <Text size="extraLarge">Approved Tokens</Text>
          <ApproveToken />
        </Stack> */}
        <Box>
          <Heading>Default Payment</Heading>
          <Text>Set the default way that contributors get paid</Text>
        </Box>
        <Stack>
          <Text size="extraLarge">Chain</Text>
          <Stack direction="horizontal">
            {getFlattenedNetworks(registry).map((aChain) => (
              <Box
                cursor="pointer"
                key={aChain.chainId}
                onClick={() => {
                  setIsDirty(true);
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
              </Box>
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
                  onClick={() => {
                    setIsDirty(true);
                    setToken(aToken);
                  }}
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
          <Box width="1/3" marginTop="2" paddingLeft="1">
            {isDirty && (
              <PrimaryButton
                icon={<SaveOutlined />}
                onClick={onSubmit}
                loading={isLoading}
                animation="fade"
              >
                Save
              </PrimaryButton>
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
