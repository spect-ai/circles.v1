import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Box,
  Button,
  Heading,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  Stack,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Tour from "reactour";
import { tourConfig } from "./tourConfig";

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  return (
    <>
      <PrimaryButton onClick={() => setIsTourOpen(true)}>Show</PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Onboarding" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Heading>
                  Would you like to take our onboarding guide fren?
                </Heading>
                <PrimaryButton
                  onClick={() => {
                    setIsOpen(false);
                    setIsTourOpen(true);
                  }}
                >
                  Fk yeah!
                </PrimaryButton>
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
