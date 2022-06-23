import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { useGlobalContext } from "@/app/context/globalContext";
import { Chain, CircleType, ProjectType, Token } from "@/app/types";
import { Box, Heading, Input, Stack, Tag, Text } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function DefaultPayment() {
  const { registry } = useGlobalContext();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [chain, setChain] = useState({} as Chain);
  const [token, setToken] = useState({} as Token);

  useEffect(() => {
    if (circle?.id) {
      setChain(circle.defaultPayment.chain);
      setToken(circle.defaultPayment.token);
    }
  }, [circle]);

  return (
    <Stack>
      <Heading>Default Payment</Heading>
      <Text>Set the default way of getting paid for cards</Text>
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
                tone={chain.chainId === aChain.chainId ? "accent" : "secondary"}
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
                tone={token.address === aToken.address ? "accent" : "secondary"}
              >
                {aToken.symbol}
              </Tag>
            </motion.button>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
