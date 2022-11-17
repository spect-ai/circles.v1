import { Heading, Stack, Text, Box, Input } from "degen";
import styled from "styled-components";
import { useState } from "react";
import { RocketOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { LensSkills, UserType } from "@/app/types";
import { isEmail } from "@/app/common/utils/utils";
import AddSkillModal from "@/app/modules/Profile/ProfilePage/AddSkillModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";

export function SetUpProfile() {
  const router = useRouter();
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { updateProfile } = useProfileUpdate();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const skills = currentUser?.skillsV2;

  const onSaveProfile = async () => {
    setIsLoading(true);
    const res = await updateProfile({
      email,
    });
    console.log(res);
    setIsLoading(false);
  };

  if (loading)
    return (
      <Box
        marginTop={"40"}
        display="flex"
        flexDirection="column"
        gap={{ xs: "10", md: "10", lg: "5" }}
      >
        <RocketOutlined
          style={{ fontSize: "5rem", color: "rgb(191, 90, 242, 1)" }}
          rotate={30}
        />
        <Heading align={"center"}>Boosting up your Spect experience</Heading>
      </Box>
    );

  return (
    <Box
      display={"flex"}
      flexDirection="column"
      gap={"5"}
      alignItems="center"
      marginTop={"48"}
    >
      <Stack
        direction={{ xs: "vertical", md: "horizontal", lg: "horizontal" }}
        align="center"
      >
        <RocketOutlined
          style={{ fontSize: "2.5rem", color: "rgb(191, 90, 242, 1)" }}
          rotate={30}
        />
        <Heading align={"center"}>All set ! This is the final step</Heading>
      </Stack>
      {currentUser?.email?.length == 0 && (
        <>
          <Text>What is your primary email ?</Text>
          <Input
            label
            hideLabel
            placeholder="swigglyTrex@gmail.com"
            inputMode="email"
            type="email"
            error={email && !isEmail(email)}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onBlur={() => {
              if (currentUser?.skillsV2.length != 0) void onSaveProfile();
            }}
          />
        </>
      )}

      {currentUser?.skillsV2?.length == 0 && (
        <>
          <Text>Add atleast one skill</Text>
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              setOpenSkillModal(true);
            }}
            disabled={currentUser?.skillsV2?.length != 0}
          >
            Add Skill
          </PrimaryButton>
        </>
      )}

      {openSkillModal && (
        <AddSkillModal
          modalMode={"add"}
          skills={skills as LensSkills[]}
          handleClose={() => setOpenSkillModal(false)}
          skillId={0}
          onboarding={email.length != 0 || !!isEmail(email)}
        />
      )}
      <PrimaryButton
        onClick={() => {
          void onSaveProfile();
          void router.push(`/profile/${currentUser?.username}`);
        }}
        disabled={
          currentUser?.skillsV2?.length == 0 ||
          email.length == 0 ||
          !isEmail(email)
        }
      >
        View Profile
      </PrimaryButton>
    </Box>
  );
}
