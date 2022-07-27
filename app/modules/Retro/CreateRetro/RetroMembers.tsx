import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconArrowRight, IconCheck, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RetroForm, slideIn } from "./RetroDetails";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Chain, CircleType, Token } from "@/app/types";
import MemberRow from "./MemberRow";
import { createRetro } from "@/app/services/Retro";

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
  const [memberStats, setmemberStats] = useState<MemberDetails[] | undefined>();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

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
                onClick={async () => {
                  console.log({ memberStats, retroBudget, retroDetails });
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
