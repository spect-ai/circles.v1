import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import useERC20 from "@/app/services/Payment/useERC20";
import { Chain, CircleType, Registry } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import { addToken } from "@/app/services/Payment";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Loader from "@/app/common/components/Loader";
import queryClient from "@/app/common/utils/queryClient";

interface Props {
  chain: Chain | undefined;
}

export default function AddToken({ chain }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [loading, setLoading] = useState(false);
  const { symbol, name } = useERC20();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  return (
    <>
      <Box cursor="pointer" onClick={() => setIsOpen(true)}>
        <Tag hover label="Add">
          <Stack direction="horizontal" align="center" space="1">
            <Text>Custom Token</Text>
          </Stack>
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)} title="Add Token">
            <Box padding="8">
              {loading && <Loader loading text="Fetching" />}
              <Stack>
                <Input
                  label=""
                  placeholder="Token Address"
                  value={address}
                  onChange={async (e) => {
                    setAddress(e.target.value);
                    setLoading(true);
                    console.log({ chain });
                    try {
                      console.log(await symbol(e.target.value, chain?.chainId));
                      setTokenSymbol(
                        await symbol(e.target.value, chain?.chainId)
                      );
                      setTokenName(await name(e.target.value, chain?.chainId));
                    } catch (e) {
                      console.log(e);
                      setLoading(false);
                    }
                    setLoading(false);
                  }}
                />
                <Text weight="semiBold">{tokenSymbol}</Text>
                <Text weight="semiBold">{tokenName}</Text>
                <PrimaryButton
                  disabled={!tokenSymbol}
                  onClick={async () => {
                    const res = await addToken(circle?.id as string, {
                      chainId: chain?.chainId as string,
                      address,
                      symbol: tokenSymbol,
                      name: tokenName,
                    });
                    console.log({ res });
                    queryClient.setQueryData(["registry", cId], res);
                    res && setIsOpen(false);
                  }}
                >
                  Add
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
