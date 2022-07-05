import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  Stack,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { tourConfig } from "./tourConfig";

const Tour = dynamic(() => import("reactour"), {
  ssr: false,
});

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const { setIsSidebarExpanded } = useGlobal();
  const { finishOnboarding } = useCircleOnboarding();

  return (
    <>
      {/* <PrimaryButton onClick={() => setIsTourOpen(true)}>Show</PrimaryButton> */}
      <AnimatePresence>
        {isOpen && (
          <Modal title="Onboarding" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Text size="large" weight="semiBold">
                  Welcome fren!
                </Text>
                <Text size="large" weight="semiBold">
                  Wanna go through circle onboarding?
                </Text>
                <Box marginTop="4" />
                <Stack direction="horizontal">
                  <Box width="full">
                    <PrimaryButton
                      variant="tertiary"
                      onClick={() => {
                        setIsOpen(false);
                        finishOnboarding();
                      }}
                      icon={
                        <CloseCircleOutlined
                          style={{
                            fontSize: "1.2rem",
                          }}
                        />
                      }
                    >
                      Nahh
                    </PrimaryButton>
                  </Box>
                  <Box width="full">
                    <PrimaryButton
                      onClick={() => {
                        setIsOpen(false);
                        setIsSidebarExpanded(true);
                        setTimeout(() => {
                          setIsTourOpen(true);
                        }, 500);
                      }}
                      icon={<IconCheck />}
                    >
                      Yesss
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
      <Tour
        accentColor="rgb(191, 90, 242, 0.6)"
        steps={tourConfig as any}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false);
        }}
        onBeforeClose={() => {
          finishOnboarding();
        }}
        rounded={30}
        prevButton={
          <Button shape="circle" size="small" variant="transparent">
            <IconChevronLeft />
          </Button>
        }
        nextButton={
          <Button shape="circle" size="small" variant="transparent">
            <IconChevronRight />
          </Button>
        }
        lastStepNextButton={
          <Button shape="circle" size="small" variant="tertiary">
            <IconCheck />
          </Button>
        }
      />
    </>
  );
}
