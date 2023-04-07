import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getFlattenedNetworks } from "@/app/common/utils/registry";
import { getUserSafes } from "@/app/services/Gnosis";
import { addSafe, removeSafe } from "@/app/services/UpdateCircle";
import { Registry } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { getAccount } from "@wagmi/core";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { OwnerResponse } from "@gnosis.pm/safe-service-client";
import { useCircle } from "../../CircleContext";

const ConnectGnosis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { circle, registry, fetchCircle } = useCircle();
  const [chain, setChain] = useState(
    Object.keys(circle?.safeAddresses || {})[0] ||
      (registry && Object.keys(registry)[0]) ||
      "1"
  );
  const [safes, setSafes] = useState<OptionType[]>([]);
  const [selectedSafe, setselectedSafe] = useState({
    label: circle?.safeAddresses
      ? circle?.safeAddresses[Object.keys(circle?.safeAddresses || {})[0]][0] ||
        ""
      : "",
    value: circle?.safeAddresses
      ? circle?.safeAddresses[Object.keys(circle?.safeAddresses || {})[0]][0] ||
        ""
      : "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { openConnectModal } = useConnectModal();

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await addSafe(
      {
        chainId: chain,
        address: selectedSafe.value,
      },
      circle?.id || ""
    );
    setIsLoading(false);
    if (res) {
      fetchCircle();
    }
  };

  const onDelete = async (chainId: string, address: string) => {
    setIsLoading(true);
    const res = await removeSafe(
      {
        chainId,
        address,
      },
      circle?.id || ""
    );
    setIsLoading(false);
    if (res) {
      fetchCircle();
    }
  };

  useEffect(() => {
    const getSafes = async () => {
      const safes2 = await getUserSafes(chain || "137");
      if (safes2) {
        setSafes(
          (safes2 as OwnerResponse).safes.map((safe) => ({
            label: safe,
            value: safe,
          }))
        );
        setselectedSafe({
          label: (safes2 as OwnerResponse).safes[0],
          value: (safes2 as OwnerResponse).safes[0],
        });
      }
    };
    if (isOpen) {
      getSafes();
    }
  }, [chain, isOpen]);

  if (circle) {
    return (
      <>
        <PrimaryButton
          variant={
            circle?.safeAddresses &&
            Object.entries(circle?.safeAddresses).some(
              ([, aSafes]) => aSafes?.length > 0
            )
              ? "tertiary"
              : "secondary"
          }
          onClick={() => {
            setIsOpen(true);
            try {
              const account = getAccount();
              if (!account?.isConnected) openConnectModal && openConnectModal();
            } catch (e) {
              console.error(e);
            }
          }}
        >
          {circle?.safeAddresses &&
          Object.entries(circle?.safeAddresses).some(
            ([, aSafes]) => aSafes?.length > 0
          )
            ? "Gnosis Safe Connected"
            : "Connect Gnosis Safe"}
        </PrimaryButton>
        <AnimatePresence>
          {isOpen && (
            <Modal handleClose={() => setIsOpen(false)} title="Connect Gnosis">
              <Box
                display="flex"
                flexDirection="column"
                padding={{
                  xs: "4",
                  md: "8",
                }}
                paddingBottom="0"
                gap="2"
              >
                <Text variant="label">Your Gnosis Safe addressses</Text>
                {Object.keys(circle?.safeAddresses || {}).map((aChain) => {
                  if (circle?.safeAddresses[aChain].length > 0) {
                    return (
                      <Box
                        key={aChain}
                        display="flex"
                        flexDirection="row"
                        gap="2"
                        alignItems="center"
                      >
                        <Button
                          shape="circle"
                          size="small"
                          variant="transparent"
                          onClick={async () => {
                            await onDelete(
                              aChain,
                              circle?.safeAddresses[aChain][0]
                            );
                          }}
                        >
                          <DeleteOutlined />
                        </Button>
                        <Box width="1/4">
                          <Text variant="small">
                            {registry?.[aChain]?.name}
                          </Text>
                        </Box>
                        <Stack direction="horizontal" wrap>
                          {circle?.safeAddresses[aChain].map((aSafe) => (
                            <Box key={aSafe}>
                              <Tag hover tone="accent">
                                <Text color="accent">{aSafe}</Text>
                              </Tag>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    );
                  }
                  return null;
                })}
                {!Object.keys(circle?.safeAddresses || {}).some(
                  (aChain) => circle?.safeAddresses[aChain].length > 0
                ) && (
                  <Box>
                    <Text variant="small">
                      You have not connected any Gnosis Safe addresses yet.
                    </Text>
                  </Box>
                )}
              </Box>
              <Box padding="8">
                <Stack>
                  <Text variant="label">Add a new safe address</Text>
                  <Text variant="small">Pick a Network</Text>
                  <Stack direction="horizontal">
                    {getFlattenedNetworks(registry as Registry)?.map(
                      (aChain) => {
                        if (
                          aChain.chainId !== "56" &&
                          aChain.chainId !== "43114" &&
                          aChain.chainId !== "100"
                        ) {
                          return (
                            <Box
                              cursor="pointer"
                              key={aChain.chainId}
                              onClick={() => {
                                setChain(aChain.chainId);
                              }}
                            >
                              <Tag
                                hover
                                tone={
                                  chain === aChain.chainId
                                    ? "accent"
                                    : "secondary"
                                }
                              >
                                <Text
                                  color={
                                    chain === aChain.chainId
                                      ? "accent"
                                      : "inherit"
                                  }
                                >
                                  {aChain.name}
                                </Text>
                              </Tag>
                            </Box>
                          );
                        }
                        return null;
                      }
                    )}
                  </Stack>
                  <Text variant="small">Address of your Safe</Text>
                  <Dropdown
                    options={safes}
                    selected={selectedSafe}
                    onChange={(value) => {
                      setselectedSafe(value);
                    }}
                    multiple={false}
                    portal
                  />
                  <PrimaryButton
                    shape="circle"
                    onClick={onSubmit}
                    loading={isLoading}
                    disabled={
                      circle.safeAddresses?.[chain]?.includes(
                        selectedSafe?.value
                      ) || !selectedSafe?.value
                    }
                  >
                    Save
                  </PrimaryButton>
                </Stack>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      </>
    );
  }
  return null;
};

export default ConnectGnosis;
