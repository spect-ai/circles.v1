import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconArrowRight, IconCheck, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RetroForm, slideIn } from "./RetroDetails";
import { useRouter } from "next/router";
import { Chain, Token } from "@/app/types";
import MemberRow from "./MemberRow";
import { createRetro } from "@/app/services/Retro";
import { useCircle } from "../../Circle/CircleContext";

type Props = {
  handleClose: () => void;
  setStep: (step: number) => void;
  retroDetails: RetroForm | undefined;
  retroBudget: {
    chain: Chain;
    token: Token;
    value: string;
  };
};

export type MemberDetails = {
  member: string;
  canGive: boolean;
  canReceive: boolean;
  allocation: number;
  isChecked: boolean;
};

export default function RetroMembers({
  handleClose,
  setStep,
  retroBudget,
  retroDetails,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [memberStats, setmemberStats] = useState<MemberDetails[] | undefined>();
  const router = useRouter();
  const { circle, fetchCircle } = useCircle();

  useEffect(() => {
    if (circle) {
      setmemberStats(
        circle.members.map((member) => ({
          member,
          canGive: true,
          canReceive: true,
          allocation: 100,
          isChecked: true,
        }))
      );
    }
  }, [circle]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      transition={{ duration: 0.3 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        style={{
          height: "31rem",
        }}
      >
        <Stack>
          <Box>
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Box width="8" />
              <Box width="1/4">
                <Text variant="label">Member</Text>
              </Box>
              <Box width="1/3">
                <Text variant="label">Permissions</Text>
              </Box>
              <Box width="1/4">
                <Text variant="label">Allocation</Text>
              </Box>
            </Stack>
          </Box>
          {memberStats?.map((member, index) => (
            <MemberRow
              key={member.member}
              details={member}
              memberStats={memberStats}
              setMemberStats={setmemberStats}
              index={index}
            />
          ))}
        </Stack>
        <Box flexGrow={1} />
        <Box marginTop="8" paddingBottom="8">
          <Stack direction="horizontal">
            <Box width="full">
              <PrimaryButton
                onClick={() => setStep(1)}
                variant="tertiary"
                icon={
                  <Box
                    style={{
                      transform: "rotate(180deg)",
                    }}
                  >
                    <IconArrowRight />
                  </Box>
                }
              >
                Back
              </PrimaryButton>
            </Box>
            <Box width="full">
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  console.log({ memberStats, retroBudget, retroDetails });
                  setLoading(true);
                  const res = await createRetro({
                    circle: circle?.id,
                    strategy: retroDetails?.strategy.value,
                    description: retroDetails?.description,
                    title: retroDetails?.title,
                    duration: (retroDetails?.duration || 1) * 86400,
                    reward: {
                      ...retroBudget,
                      value: parseFloat(retroBudget?.value || "0"),
                    },
                    memberStats: memberStats?.filter((m) => m.isChecked),
                  });
                  console.log({ res });
                  setLoading(false);
                  void fetchCircle();
                  void router.push(`/${circle?.slug}?retroSlug=${res?.slug}`);
                  if (res) {
                    handleClose();
                  }
                }}
                suffix={<IconCheck />}
              >
                Create Retro
              </PrimaryButton>
            </Box>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
}
