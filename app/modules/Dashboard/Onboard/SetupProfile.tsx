import { Heading, Stack, Text, Box, Input, Tag } from "degen";
import { useState } from "react";
import { RocketOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { LensSkills, UserType } from "@/app/types";
import { isEmail } from "@/app/common/utils/utils";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { skills as skillsArray } from "@/app/common/utils/constants";

export function SetUpProfile() {
  const router = useRouter();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [skill, setSkill] = useState<string[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(currentUser?.email);
  const { updateProfile } = useProfileUpdate();

  const skills = currentUser?.skillsV2;

  const onSaveProfile = async () => {
    setIsLoading(true);
    const newSkills = skill.map((s) => ({
      title: s,
      category: s,
      linkedCredentials: [],
      nfts: [],
      poaps: [],
      icon: "",
    }));
    const res = await updateProfile({
      email,
      skillsV2: [...(skills as LensSkills[]), ...newSkills],
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
      marginTop={"24"}
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
      {(currentUser?.email?.length == 0 || !currentUser?.email) && (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
          width={{
            lg: "1/2",
          }}
        >
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
        </Box>
      )}

      {currentUser?.skillsV2?.length == 0 && (
        <>
          <Text>Select your Skills</Text>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
            }}
            width={{
              lg: "1/2",
            }}
          >
            {skillsArray?.map((s) => {
              return (
                <Box
                  key={s}
                  onClick={() => {
                    if (skill.includes(s)) {
                      setSkill(skill.filter((item) => item !== s));
                    } else {
                      setSkill([...skill, s]);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Tag
                    as="span"
                    tone={skill.includes(s) ? "accent" : "secondary"}
                    hover
                    size="medium"
                  >
                    {s}
                  </Tag>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
