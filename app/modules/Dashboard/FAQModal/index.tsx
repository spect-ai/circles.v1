import Modal from "@/app/common/components/Modal";
import { Box } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import SocialMedia from "@/app/common/components/SocialMedia";

type Props = {
  handleClose: () => void;
};

export default function FAQModal({ handleClose }: Props) {
  return (
    <Modal handleClose={handleClose} title="Spectopedia" size="small">
      <Box display={"flex"} flexDirection="column" gap="4" padding="3">
        <PrimaryButton
          variant="transparent"
          onClick={() => {
            window.open("https://docs.spect.network/spect-docs/faq", "_blank");
          }}
        >
          FAQ
        </PrimaryButton>
        <PrimaryButton
          variant="transparent"
          onClick={() => {
            window.open(
              "https://calendly.com/adityachakra16/outreach",
              "_blank"
            );
          }}
        >
          Explore Docs
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
      </Box>
    </Modal>
  );
}
