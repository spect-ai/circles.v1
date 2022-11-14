import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Credential, UserType, VerifiableCredential } from "@/app/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Box, Text, useTheme } from "degen";
import Image from "next/image";
import router from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import AddSkillModal from "./AddSkillModal";

type Props = {
  handleClose: () => void;
  skillId?: number;
  setEditSkill: (value: boolean) => void;
};

export default function ViewSkillModal({
  handleClose,
  skillId,
  setEditSkill,
}: Props) {
  const { userData } = useGlobal();
  const [title, setTitle] = useState("");
  const [linkedCredentials, setLinkedCredentials] = useState<Credential[]>([]);
  const { updateProfile } = useProfileUpdate();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { mode } = useTheme();
  useEffect(() => {
    if (skillId || skillId === 0) {
      const skill = userData.skillsV2[skillId];
      setTitle(skill.title);
      setLinkedCredentials(skill.linkedCredentials);
    }
  }, [skillId, userData.skillsV2]);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={title}
    >
      <Box
        padding={{
          xs: "4",
          md: "8",
        }}
        paddingTop="0"
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        <ScrollContainer>
          {linkedCredentials?.length > 0 && (
            <Box>
              <Text variant="label">Linked Credentials</Text>
              <Box marginTop="4">
                {linkedCredentials?.map((credential, index) => {
                  if (credential.service === "gitcoinPassport") {
                    return (
                      <Box
                        key={index}
                        display="flex"
                        flexDirection="row"
                        gap="2"
                        width="full"
                        height="36"
                      >
                        <Box
                          width="1/4"
                          display="flex"
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                          padding="2"
                        >
                          <Box
                            width="12"
                            height="12"
                            display="flex"
                            flexDirection="row"
                            justifyContent="center"
                            alignItems="center"
                          >
                            {mode === "dark"
                              ? PassportStampIcons[
                                  (credential?.metadata as VerifiableCredential)
                                    ?.providerName as keyof typeof PassportStampIconsLightMode
                                ]
                              : PassportStampIconsLightMode[
                                  (credential?.metadata as VerifiableCredential)
                                    ?.providerName as keyof typeof PassportStampIconsLightMode
                                ]}
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          width="3/4"
                        >
                          <Text variant="large" weight="bold" align="left">
                            {credential.name}
                          </Text>
                        </Box>
                      </Box>
                    );
                  } else {
                    return (
                      <Box
                        key={index}
                        display="flex"
                        flexDirection="row"
                        gap="2"
                      >
                        <Box width="1/4" padding="2">
                          <Image
                            src={credential.imageUri}
                            width="100%"
                            height="100%"
                            objectFit="contain"
                            layout="responsive"
                            alt="img"
                          />
                        </Box>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          width="3/4"
                        >
                          <Text variant="large" weight="bold" align="left">
                            {credential.name}
                          </Text>
                        </Box>
                      </Box>
                    );
                  }
                })}
              </Box>
            </Box>
          )}
        </ScrollContainer>
        {currentUser?.id === userData.id && (
          <Box
            padding="3"
            display="flex"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            gap="4"
            justifyContent="flex-end"
          >
            <Box
              width={{
                xs: "full",
                md: "1/2",
              }}
            >
              <PrimaryButton
                icon={<EditOutlined style={{ fontSize: "1.3rem" }} />}
                variant="tertiary"
                onClick={() => {
                  handleClose();
                  setEditSkill(true);
                }}
              >
                Edit Skill
              </PrimaryButton>
            </Box>
            <Box
              width={{
                xs: "full",
                md: "1/2",
              }}
            >
              <PrimaryButton
                icon={<DeleteOutlined style={{ fontSize: "1.3rem" }} />}
                onClick={async () => {
                  handleClose();
                  const newSkills = userData.skillsV2.filter(
                    (skill, index) => index !== skillId
                  );
                  await updateProfile({
                    skillsV2: newSkills,
                  });
                }}
              >
                Delete Skill
              </PrimaryButton>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  overflow-y: auto;
  max-height: 35rem;
`;
