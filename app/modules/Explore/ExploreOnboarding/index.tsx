import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useExploreOnboarding from "@/app/services/Onboarding/useExploreOnboarding";
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
import { useState } from "react";
import tourConfig from "./tourConfig";

const Tour = dynamic(() => import("reactour"), {
  ssr: false,
});

const Onboarding = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { finishOnboarding } = useExploreOnboarding();

  return (
    <>
      {/* <Button onClick={() => setIsTourOpen(true)}>open</Button> */}
      <AnimatePresence>
        {isOpen && (
          <Modal title="Onboarding" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack space="2">
                <Text size="large" weight="semiBold">
                  Welcome fren!
                </Text>
                <Text size="large" weight="semiBold">
                  Looks like you are new, would you like to take our onboarding
                  guide?
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
                        setIsTourOpen(true);
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
        accentColor="rgb(191, 90, 242, 0.66)"
        steps={tourConfig}
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
};

export default Onboarding;
