import Modal from "@/app/common/components/Modal";
import { Box, IconBookOpen, Stack } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import SocialMedia from "@/app/common/components/SocialMedia";
import { useAtom } from "jotai";
import { Scribes } from "@/app/common/utils/constants";
import { scribeOpenAtom, scribeUrlAtom } from "@/app/state/global";

type Props = {
  handleClose: () => void;
};

export default function FAQModal({ handleClose }: Props) {
  const [, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [, setScribeUrl] = useAtom(scribeUrlAtom);
  return (
    <Modal handleClose={handleClose} title="Spectopedia" size="small">
      <Box padding="8">
        <Stack>
          <PrimaryButton
            variant="transparent"
            icon={<IconBookOpen />}
            onClick={() => {
              handleClose();
              setIsScribeOpen(true);
              setScribeUrl(Scribes.grants.using);
            }}
          >
            Open Grants Workflow walkthrough
          </PrimaryButton>
          <PrimaryButton
            variant="transparent"
            icon={<IconBookOpen />}
            onClick={() => {
              handleClose();
              setIsScribeOpen(true);
              setScribeUrl(Scribes.onboarding.using);
            }}
          >
            Open Onboarding Workflow walkthrough
          </PrimaryButton>
          <PrimaryButton
            variant="transparent"
            icon={<IconBookOpen />}
            onClick={() => {
              handleClose();
              setIsScribeOpen(true);
              setScribeUrl(Scribes.kanban.using);
            }}
          >
            Open Kanban project walkthrough
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              window.open(
                "https://calendly.com/adityachakra16/outreach",
                "_blank"
              );
            }}
          >
            Book a Demo
          </PrimaryButton>
          <SocialMedia />
        </Stack>
      </Box>
    </Modal>
  );
}
