import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getFlattenedNetworks } from "@/app/common/utils/registry";
import { getUserSafes } from "@/app/services/Gnosis";
import { updateCircle } from "@/app/services/UpdateCircle";
import { Registry } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";

export default function ConnectGnosis() {
  const [isOpen, setIsOpen] = useState(false);
  const { circle, registry, setCircleData } = useCircle();
  const [chain, setChain] = useState(
    Object.keys(circle?.safeAddresses || {})[0]
  );
  const [safes, setSafes] = useState<OptionType[]>([]);
  const [selectedSafe, setselectedSafe] = useState({
    label:
      circle?.safeAddresses[Object.keys(circle?.safeAddresses || {})[0]][0] ||
      "",
    value:
      circle?.safeAddresses[Object.keys(circle?.safeAddresses || {})[0]][0] ||
      "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await updateCircle(
      {
        safeAddresses: {
          [chain]: [selectedSafe.value],
        },
      },
      circle?.id as string
    );
    console.log({ res });
    setIsLoading(false);
    if (res) {
      setCircleData(res);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const getSafes = async () => {
      const safes = await getUserSafes(chain || "137");
      console.log({ safes });
      setSafes(
        safes.safes.map((safe) => ({
          label: safe,
          value: safe,
        }))
      );
    };
    if (isOpen) {
      void getSafes();
    }
  }, [chain, isOpen]);

  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>
        {circle?.safeAddresses[Object.keys(circle?.safeAddresses || {})[0]]
          ? "Safe Connected"
          : "Connect Gnosis"}
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)} title="Connect Gnosis">
            <Box padding="8">
              <Stack>
                <Text size="extraLarge">Chain</Text>
                <Stack direction="horizontal">
                  {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
                    <Box
                      cursor="pointer"
                      key={aChain.chainId}
                      onClick={() => {
                        setChain(aChain.chainId);
                      }}
                    >
                      <Tag
                        hover
                        tone={chain === aChain.chainId ? "accent" : "secondary"}
                      >
                        <Text
                          color={
                            chain === aChain.chainId ? "accent" : "inherit"
                          }
                        >
                          {aChain.name}
                        </Text>
                      </Tag>
                    </Box>
                  ))}
                </Stack>
                <Text>Choose your safe</Text>
                <Dropdown
                  options={safes}
                  selected={selectedSafe}
                  onChange={(value) => {
                    setselectedSafe(value);
                  }}
                />
                <PrimaryButton
                  shape="circle"
                  onClick={onSubmit}
                  loading={isLoading}
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
