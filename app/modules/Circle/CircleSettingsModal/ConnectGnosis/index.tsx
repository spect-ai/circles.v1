import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getFlattenedNetworks } from "@/app/common/utils/registry";
import { getUserSafes, massPayment } from "@/app/services/Gnosis";
import { Registry } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";

export default function ConnectGnosis() {
  const [isOpen, setisOpen] = useState(false);
  const { circle, registry, setCircleData } = useCircle();
  const [chain, setChain] = useState(circle?.defaultPayment.chain);
  const [safes, setSafes] = useState<OptionType[]>([]);
  const [selectedSafe, setselectedSafe] = useState({
    label: "",
    value: "",
  });

  useEffect(() => {
    const getSafes = async () => {
      const safes = await getUserSafes(chain?.chainId || "137");
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
  }, [chain?.chainId, isOpen]);

  return (
    <>
      <PrimaryButton onClick={() => setisOpen(true)}>
        Connect Gnosis
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setisOpen(false)} title="Connect Gnosis">
            <Box padding="8">
              <Stack>
                <Text size="extraLarge">Chain</Text>
                <Stack direction="horizontal">
                  {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
                    <Box
                      cursor="pointer"
                      key={aChain.chainId}
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
                        <Text
                          color={
                            chain?.chainId === aChain.chainId
                              ? "accent"
                              : "inherit"
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
                  onClick={async () => {
                    const res = await massPayment(
                      selectedSafe.value,
                      chain?.chainId || "137"
                    );
                  }}
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
