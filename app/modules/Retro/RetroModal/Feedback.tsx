import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { giveFeedback } from "@/app/services/Retro";
import { Box, Stack, Tag, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";

type Props = {
  retroId: string;
  member: string;
  feedback: string;
};

export default function Feedback({ retroId, member, feedback }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState(feedback);
  const [loading, setLoading] = useState(false);
  const { retro, setRetroData } = useCircle();

  useEffect(() => {
    setFeedbackContent(feedback);
  }, [feedback]);

  if (!retro) {
    return <Loader loading text="" />;
  }

  return (
    <>
      <Box
        cursor={
          retro.status.active ? "pointer" : feedback ? "pointer" : "not-allowed"
        }
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {retro.status.active ? (
          <Tag hover tone={feedback ? "secondary" : "accent"}>
            {feedback ? "Feedback Given" : "Give Feedback"}
          </Tag>
        ) : (
          <Tag hover tone={feedback ? "accent" : "secondary"}>
            {feedback ? "Feedback Received" : "No Feedback"}
          </Tag>
        )}
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
                  disabled={!retro.status.active}
                />
                {retro.status.active && (
                  <PrimaryButton
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const res = await giveFeedback(retroId, {
                        feedback: {
                          [member]: feedbackContent,
                        },
                      });
                      console.log({ res });
                      setRetroData(res);
                      setLoading(false);
                      if (res) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    Submit
                  </PrimaryButton>
                )}
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
