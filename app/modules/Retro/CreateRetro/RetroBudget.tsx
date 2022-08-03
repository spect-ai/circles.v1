import { Box, IconArrowRight, Input, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "./RetroDetails";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Chain, CircleType, Registry, Token } from "@/app/types";

type Props = {
  setStep: (step: number) => void;
  setBudget: (budget: { chain: Chain; token: Token; value: string }) => void;
};

export default function RetroBudget({ setStep, setBudget }: Props) {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [chain, setChain] = useState(circle?.defaultPayment.chain);
  const [token, setToken] = useState(circle?.defaultPayment.token);
  const [value, setValue] = useState("0");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      transition={{ duration: 0.3 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        style={{
          height: "31rem",
        }}
      >
        <Stack>
          <Text variant="label">Budget</Text>
          <Text size="extraLarge" weight="semiBold">
            Chain
          </Text>
          <Stack direction="horizontal">
            {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
              <Box
                key={aChain.name}
                onClick={() => {
                  setChain(aChain);
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
          <Stack direction="horizontal">
            {getFlattenedCurrencies(
              registry as Registry,
              chain?.chainId as string
            ).map((aToken) => (
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
                    token?.address === aToken.address ? "accent" : "secondary"
                  }
                >
                  <Text
                    color={
                      token?.address === aToken.address ? "accent" : "inherit"
                    }
                  >
                    {aToken.symbol}
                  </Text>
                </Tag>
              </Box>
            ))}
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
            width="1/3"
          />
          {/* <Button width="full" size="small">
          Save
        </Button> */}
        </Stack>
        <Box flexGrow={2} />
        <Stack direction="horizontal">
          <Box width="full">
            <PrimaryButton
              onClick={() => setStep(0)}
              variant="tertiary"
              icon={
                <Box
                  style={{
                    transform: "rotate(180deg)",
                  }}
                >
                  <IconArrowRight />
                </Box>
              }
            >
              Back
            </PrimaryButton>
          </Box>
          <Box width="full">
            <PrimaryButton
              disabled={!chain || !token || !value}
              onClick={() => {
                if (chain && token) {
                  setBudget({
                    chain,
                    token,
                    value,
                  });
                  setStep(2);
                }
              }}
              suffix={<IconArrowRight />}
            >
              Continue
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}
