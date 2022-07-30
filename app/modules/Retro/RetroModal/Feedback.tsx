import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { giveFeedback } from "@/app/services/Retro";
import { RetroType } from "@/app/types";
import { Box, Stack, Tag, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { MemberDetails } from ".";

type Props = {
  retroId: string;
  memberDetails: MemberDetails;
  feedbackGiven: { [key: string]: string };
  setRetro: (retro: RetroType) => void;
};

export default function Feedback({
  retroId,
  memberDetails,
  feedbackGiven,
  setRetro,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState(
    feedbackGiven && feedbackGiven[memberDetails.owner]
  );
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Box
        cursor="pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Tag
          hover
          tone={
            feedbackGiven && feedbackGiven[memberDetails.owner]
              ? "secondary"
              : "accent"
          }
        >
          {feedbackGiven && feedbackGiven[memberDetails.owner]
            ? "Feedback Given"
            : "Give Feedback"}
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Feedback" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Textarea
                  label="Feedback"
                  placeholder="A pretty decent work done, however following areas can be improved...."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
                <PrimaryButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const res = await giveFeedback(retroId, {
                      feedback: {
                        [memberDetails.owner]: feedbackContent,
                      },
                    });
                    setLoading(false);
                    // setRetro(res);
                    if (res) {
                      setIsOpen(false);
                    }
                  }}
                >
                  Submit
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
