import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import {
  LensExperience,
  Milestone,
  Option,
  Registry,
  UserType,
  VerifiableCredential,
} from "@/app/types";
import { Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkCredentialsModal from "./LinkCredentialsModal";
import { Credential } from "@/app/types";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Image from "next/image";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddExperienceModal from "./AddExperienceModal";
import router from "next/router";
import { useQuery } from "react-query";

type Props = {
  handleClose: () => void;
  experienceId?: number;
  setEditExperience: (value: boolean) => void;
};

export default function ViewExperienceModal({
  handleClose,
  experienceId,
  setEditExperience,
}: Props) {
  const { userData } = useGlobal();
  const { removeExperience } = useProfileUpdate();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { mode } = useTheme();
  const experience =
    experienceId || experienceId === 0
      ? userData.experiences[experienceId]
      : null;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!experience) return;
    if (
      experience.start_date.day &&
      experience.start_date.month &&
      experience.start_date.year
    ) {
      setStartDate(
        experience.start_date?.year?.toString().padStart(2, "0") +
          "-" +
          experience.start_date?.month?.toString().padStart(2, "0") +
          "-" +
          experience.start_date?.day?.toString().padStart(2, "0")
      );
    }
    if (
      experience.end_date.day &&
      experience.end_date.month &&
      experience.end_date.year
    ) {
      setEndDate(
        experience.end_date?.year?.toString().padStart(2, "0") +
          "-" +
          experience.end_date?.month?.toString().padStart(2, "0") +
          "-" +
          experience.end_date?.day?.toString().padStart(2, "0")
      );
    }
  }, [experience]);

  console.log({ experience });

  return (
    <>
      {experience && (experienceId || experienceId === 0) && (
        <Modal
          handleClose={() => {
            handleClose();
          }}
          title={experience?.jobTitle}
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
            <Box>
              <Text variant="large">{experience?.company}</Text>

              <Box marginTop="2">
                {startDate && endDate && !experience?.currentlyWorking && (
                  <Text variant="label">
                    {startDate} - {endDate}
                  </Text>
                )}{" "}
                {startDate && experience.currentlyWorking && (
                  <Text variant="label">{startDate} - Present</Text>
                )}
              </Box>
            </Box>
            <ScrollContainer>
              <Box>
                <Editor value={experience.description} disabled={true} />
              </Box>
              {experience.linkedCredentials?.length > 0 && (
                <Box>
                  <Text variant="label">Linked Credentials</Text>

                  <Box marginTop="4">
                    {experience.linkedCredentials?.map((credential, index) => {
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
                                      (
                                        credential?.metadata as VerifiableCredential
                                      )
                                        ?.providerName as keyof typeof PassportStampIconsLightMode
                                    ]
                                  : PassportStampIconsLightMode[
                                      (
                                        credential?.metadata as VerifiableCredential
                                      )
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
                      setEditExperience(true);
                    }}
                  >
                    Edit Experience
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

                      await removeExperience(experienceId.toString());
                    }}
                  >
                    Delete Experience
                  </PrimaryButton>
                </Box>
              </Box>
            )}
          </Box>
        </Modal>
      )}
    </>
  );
}
export const DateInput = styled.input<{ mode: string }>`
  padding: 1rem;
  border-radius: 0.55rem;
  border 1px solid ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};
  background-color: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"};
  width: 100%;
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.7)" : "rgb(20,20,20,0.7)"};
  margin-top: 10px;
  outline: none;
  &:focus {
    border-color: rgb(191, 90, 242, 1);
  }
  transition: border-color 0.5s ease;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  overflow-y: auto;
  max-height: 35rem;
`;
