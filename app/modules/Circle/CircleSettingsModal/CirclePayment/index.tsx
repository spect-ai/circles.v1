import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import { updateCircle } from "@/app/services/UpdateCircle";
import { Registry } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Heading, IconTrash, Input, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../CircleContext";
import AddToken from "./AddToken";
import AddAddress from "./AddAddress";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: 30rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

export default function DefaultPayment() {
  const { circle, registry, setCircleData } = useCircle();

  const [chain, setChain] = useState(circle?.defaultPayment.chain);
  const [token, setToken] = useState(circle?.defaultPayment.token);

  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  const [circleAddress, setCircleAddress] = useState(
    circle?.paymentAddress || ""
  );

  const onSubmit = async () => {
    // validate if circle address is a valid ethereum address
    if (circleAddress && !circleAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Invalid Payment Address");
      return;
    }

    setIsLoading(true);
    if (!chain || !token) {
      toast.error("Please select a chain and token");
      setIsLoading(false);
      return;
    }
    const res = await updateCircle(
      {
        defaultPayment: {
          chain: chain,
          token: token,
        },
        paymentAddress: circleAddress,
      },
      circle?.id || ""
    );
    setIsDirty(false);
    setIsLoading(false);
    if (res) {
      setCircleData(res);
    }
  };

  const { canDo } = useRoleGate();

  return (
    <Container>
      <Stack space="4">
        <Box>
          <Text variant="extraLarge" weight="bold">
            Payments
          </Text>
          <Text variant="label">Add your whitelisted tokens and address</Text>
        </Box>
        <Stack>
          <Text weight="semiBold">Chain</Text>
          <Stack direction="horizontal" wrap>
            {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
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
          <Text weight="semiBold">Whitelisted Tokens</Text>
          <Stack direction="horizontal" wrap>
            {getFlattenedCurrencies(
              registry as Registry,
              chain?.chainId || ""
            )?.map((aToken) => (
              <Box
                cursor="pointer"
                key={aToken.address}
                onClick={() => {
                  setIsDirty(true);
                  setToken(aToken);
                }}
              >
                <Tag hover>
                  <Text>{aToken.symbol}</Text>
                </Tag>
              </Box>
            ))}
            <Box cursor="pointer" onClick={() => setIsAddTokenModalOpen(true)}>
              <Tag hover label="Add">
                <Stack direction="horizontal" align="center" space="1">
                  <Text>Custom Token</Text>
                </Stack>
              </Tag>
            </Box>
            <AnimatePresence>
              {isAddTokenModalOpen && (
                <AddToken
                  chainId={chain?.chainId || ""}
                  chainName={chain?.name || ""}
                  handleClose={() => setIsAddTokenModalOpen(false)}
                />
              )}
              {isAddAddressOpen && (
                <AddAddress
                  chainId={chain?.chainId || ""}
                  chainName={chain?.name || ""}
                  handleClose={() => setIsAddAddressOpen(false)}
                />
              )}
            </AnimatePresence>
          </Stack>
          <Text weight="semiBold">Whitelisted Addresses</Text>
          <Stack direction="horizontal" wrap>
            {circle?.whitelistedAddresses?.[chain?.chainId || ""]?.map(
              (address) => (
                <Box cursor="pointer">
                  <Tag>
                    <Text>{address}</Text>
                    <Box
                      onClick={() => {
                        updateCircle(
                          {
                            whitelistedAddresses: {
                              [chain?.chainId || ""]:
                                circle?.whitelistedAddresses?.[
                                  chain?.chainId || ""
                                ].filter((a) => a !== address),
                            },
                          },
                          circle?.id || ""
                        ).then((res) => {
                          if (res) {
                            setCircleData(res);
                          }
                        });
                      }}
                    >
                      <Tag hover tone="red">
                        <IconTrash size="4" />
                      </Tag>
                    </Box>
                  </Tag>
                </Box>
              )
            )}
            <Box
              cursor="pointer"
              onClick={() => {
                if (!canDo("managePaymentOptions")) {
                  toast.error(
                    "You don't have permission to do this, your role needs to have permission to manage payment options"
                  );
                  return;
                }
                setIsAddAddressOpen(true);
              }}
            >
              <Tag hover label="Add">
                <Stack direction="horizontal" align="center" space="1">
                  <Text>Address</Text>
                </Stack>
              </Tag>
            </Box>
          </Stack>
        </Stack>
        <Box marginTop="4" />
        {/* <Box>
          <Heading>Circle Address</Heading>
          <Text>
            Set ethereum address where circle should receieve the payments.
            Please ensure that the ethereum address added is NOT a gnosis safe
            address.
          </Text>
        </Box>
        <Stack>
          <Input
            label=""
            placeholder="Address"
            width={{
              xs: "full",
              md: "1/2",
            }}
            value={circleAddress}
            onChange={(e) => {
              setIsDirty(true);
              setCircleAddress(e.target.value);
            }}
          />
        </Stack> */}
        {/* <Box width="1/3" marginTop="2" paddingLeft="1">
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
        </Box> */}
      </Stack>
    </Container>
  );
}
