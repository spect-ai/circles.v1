import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Milestone, Option, Registry, VerifiableCredential } from "@/app/types";
import { Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkCredentialsModal from "./LinkCredentialsModal";
import { Credential } from "@/app/types";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Image from "next/image";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddEducationModal from "./AddEducationModal";
import router from "next/router";

type Props = {
  handleClose: () => void;
  educationId: number;
};

export default function ViewEducationModal({
  handleClose,
  educationId,
}: Props) {
  const { userData } = useGlobal();
  const username = router.query.user;

  const education = userData.education[educationId];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organization, setOrganization] = useState("");
  const [openEducationModal, setOpenEducationModal] = useState(false);
  const [linkedCredentials, setLinkedCredentials] = useState<Credential[]>([]);
  const { removeEducation } = useProfileUpdate();

  const { mode } = useTheme();
  console.log({ description });
  useEffect(() => {
    if (educationId || educationId === 0) {
      const education = userData.education[educationId];
      setTitle(education.courseDegree);
      setOrganization(education.school);
      setDescription(education.description);
      setStartDate(
        education.start_date?.year?.toString().padStart(2, "0") +
          "-" +
          education.start_date?.month?.toString().padStart(2, "0") +
          "-" +
          education.start_date?.day?.toString().padStart(2, "0")
      );
      setEndDate(
        education.end_date?.year?.toString().padStart(2, "0") +
          "-" +
          education.end_date?.month?.toString().padStart(2, "0") +
          "-" +
          education.end_date?.day?.toString().padStart(2, "0")
      );
      setLinkedCredentials(education.linkedCredentials);
    }
  }, [educationId, userData.education]);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={title}
    >
      {openEducationModal && (
        <AddEducationModal
          modalMode={"edit"}
          educationId={educationId}
          handleClose={() => setOpenEducationModal(false)}
        />
      )}
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
          <Text variant="large">{organization}</Text>

          <Box marginTop="2">
            {startDate && endDate ? (
              <Text variant="label">
                {startDate} - {endDate}
              </Text>
            ) : startDate ? (
              <Text variant="label">{startDate} - Present</Text>
            ) : null}
          </Box>
        </Box>
        <ScrollContainer>
          <Box>
            <Editor value={description} disabled={true} />
          </Box>
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
                    <Box key={index} display="flex" flexDirection="row" gap="2">
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
        </ScrollContainer>
        {username === userData.username && (
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
                onClick={() => setOpenEducationModal(true)}
              >
                Edit Education
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

                  await removeEducation(educationId.toString());
                }}
              >
                Delete Education
              </PrimaryButton>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
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
