import Modal from "@/app/common/components/Modal";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { CircleType, Registry } from "@/app/types";
import { Box, IconPlusSmall, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";

export default function ApproveToken() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [chain, setChain] = useState(circle?.defaultPayment.chain);
  const [token, setToken] = useState(circle?.defaultPayment.token);

  return (
    <>
      {/* <ClickableTag
        name="Add Token"
        icon={<IconPlusSmall color="accent" />}
        onClick={() => {
          setIsOpen(true);
        }}
      /> */}
      <Box cursor="pointer" onClick={() => setIsOpen(true)}>
        <Tag tone="accent" hover>
          <Stack direction="horizontal" align="center" space="0.5">
            <IconPlusSmall />
            <Text color="inherit">Add Token</Text>
          </Stack>
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && circle && (
          <Modal
            handleClose={() => {
              setIsOpen(false);
            }}
            title="Approve Token"
          >
            <Box padding="8">
              <Stack>
                <Text size="extraLarge">Chain</Text>
                <Stack direction="horizontal">
                  {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
                    <Box
                      cursor="pointer"
                      key={aChain.chainId}
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
                          chain?.chainId === aChain.chainId
                            ? "accent"
                            : "secondary"
                        }
                      >
                        {aChain.name}
                      </Tag>
                    </Box>
                  ))}
                </Stack>
                <Text size="extraLarge">Token</Text>
                <Stack direction="horizontal">
                  {getFlattenedCurrencies(
                    circle?.localRegistry,
                    chain?.chainId as string
                  )?.map((aToken) => (
                    <Box
                      cursor="pointer"
                      onClick={() => {
                        setToken(aToken);
                      }}
                      key={aToken.symbol}
                    >
                      <Tag
                        hover
                        tone={
                          token?.address === aToken.address
                            ? "accent"
                            : "secondary"
                        }
                      >
                        {aToken.symbol}
                      </Tag>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
