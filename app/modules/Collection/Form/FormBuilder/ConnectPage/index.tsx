import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Editor from "@/app/common/components/Editor";
import Logout from "@/app/common/components/LogoutButton";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { StampCard } from "@/app/modules/PublicForm";
import { NameInput, getUser } from "@/app/modules/PublicForm/FormFields";
import { Connect } from "@/app/modules/Sidebar/ProfileButton/ConnectButton";
import { getForm } from "@/app/services/Collection";
import { getPassportScoreAndStamps } from "@/app/services/Credentials/AggregatedCredentials";
import { connectedUserAtom } from "@/app/state/global";
import {
  CollectionType,
  FormType,
  GuildRole,
  StampWithScoreAndVerification,
  StampWithVerification,
  UserType,
} from "@/app/types";
import styled from "@emotion/styled";
import { Avatar, Box, Button, Stack, Tag, Text, useTheme } from "degen";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import ProfileInfo from "./ProfileInfo";

type Props = {
  form: CollectionType;
  setForm: (form: CollectionType | FormType) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const ConnectPage = ({ form, setForm, currentPage, setCurrentPage }: Props) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [stamps, setStamps] = useState([] as StampWithScoreAndVerification[]);

  const [signedIn, setSignedIn] = useState(false);
  const { mode } = useTheme();

  const router = useRouter();
  const { formId } = router.query;

  const [connectedUser] = useAtom(connectedUserAtom);
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });
  const pageNumber = form.formMetadata.pageOrder.indexOf(currentPage);

  useEffect(() => {
    (async () => {
      if (connectedUser && signedIn) {
        if (form.formMetadata.sybilProtectionEnabled) {
          if (form.formMetadata.hasPassedSybilCheck) {
            setCurrentPage(form.formMetadata.pageOrder[pageNumber + 1]);
          }
        } else if (form.formMetadata.formRoleGating) {
          if (form.formMetadata.hasRole) {
            setCurrentPage(form.formMetadata.pageOrder[pageNumber + 1]);
          }
        } else {
          setCurrentPage(form.formMetadata.pageOrder[pageNumber + 1]);
        }
        setSignedIn(false);
      }
      const res: FormType = await getForm(formId as string);
      setForm(res);
    })();
  }, [connectedUser]);

  useEffect(() => {
    if (
      form &&
      form.formMetadata &&
      form.formMetadata.sybilProtectionEnabled &&
      form.formMetadata.sybilProtectionScores &&
      currentUser
    ) {
      void (async () => {
        try {
          const res = await getPassportScoreAndStamps(form.slug);
          console.log({ res });
          setCurrentScore(res?.score);
          setStamps(res.stamps?.sort((a, b) => b.score - a.score));
        } catch (e) {
          console.log({ e });
        }
      })();
    }
  }, [form, currentUser]);

  return (
    <Box
      style={{
        minHeight: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="auto"
    >
      {currentUser?.id ? (
        <Stack align="center">
          <Box width="80">
            <ProfileInfo member={currentUser} />
          </Box>
        </Stack>
      ) : (
        <Stack space="2">
          {form.formMetadata.logo && (
            <Avatar src={form.formMetadata.logo} label="" size="20" />
          )}
          <NameInput
            autoFocus
            value={form.name}
            disabled
            rows={Math.floor(form.name?.length / 20) + 1}
          />
          {form.description && (
            <Editor
              value={form.description}
              isDirty={true}
              disabled
              version={form.editorVersion}
            />
          )}
        </Stack>
      )}
      <motion.div
        className="box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {!form.formMetadata.hasRole && form.formMetadata.formRoleGating && (
          <Box
            display="flex"
            flexDirection="column"
            padding="4"
            marginTop="4"
            gap="4"
          >
            <Stack direction="horizontal" space="1" wrap>
              <Text weight="bold">
                You require one of the following roles on
              </Text>
              <a href="https://guild.xyz">
                <Text font="mono" weight="bold" color="accent">
                  guild.xyz
                </Text>
              </a>
              <Text weight="bold">
                to fill this form. Sign in to check your role
              </Text>
            </Stack>
            <Stack space="2">
              {form.formMetadata.formRoleGating?.map((role: GuildRole) => (
                <Tag tone="accent" key={role.id}>
                  {role.name}
                </Tag>
              ))}
            </Stack>
            {connectedUser && (
              <Text variant="label">
                You do not have the correct roles to access this form
              </Text>
            )}
            <Box display="flex" flexDirection="row" gap="4">
              <Button
                variant="tertiary"
                size="small"
                onClick={async () => {
                  const externalCircleData = await (
                    await fetch(
                      `${process.env.API_HOST}/circle/external/v1/${form.parents[0].id}/guild`,
                      {
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }
                    )
                  ).json();
                  if (!externalCircleData.urlName) {
                    toast.error(
                      "Error fetching guild, please visit guild.xyz and find the roles or contact support"
                    );
                    return;
                  }
                  window.open(
                    `https://guild.xyz/${externalCircleData.urlName}`,
                    "_blank"
                  );
                }}
              >
                How do I get these roles?
              </Button>
            </Box>
          </Box>
        )}
        {form.formMetadata.sybilProtectionEnabled &&
          !form.formMetadata.hasPassedSybilCheck && (
            <Box
              display="flex"
              flexDirection="column"
              padding="4"
              marginTop="4"
              gap="4"
            >
              {" "}
              <Text weight="bold">
                This form is sybil protected. You must have a minimum score of
                100% to fill this form. Please check the assigned scores below.
              </Text>
              <Text color={currentScore >= 100 ? "green" : "red"} font="mono">
                Your current score: {currentScore}%
              </Text>
              <StampScrollContainer>
                {stamps?.map(
                  (stamp: StampWithScoreAndVerification, index: number) => {
                    console.log({ stamp });
                    return (
                      <StampCard mode={mode} key={index}>
                        <Box
                          display="flex"
                          flexDirection="row"
                          width="full"
                          alignItems="center"
                          gap="4"
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            width="full"
                            paddingRight="4"
                          >
                            <Box
                              width="8"
                              height="8"
                              flexDirection="row"
                              justifyContent="flex-start"
                              alignItems="center"
                              marginRight="4"
                            >
                              {mode === "dark"
                                ? PassportStampIcons[stamp.providerName]
                                : PassportStampIconsLightMode[
                                    stamp.providerName
                                  ]}
                            </Box>
                            <Box>
                              <Text as="h1">{stamp.stampName}</Text>
                              <Text variant="small">
                                {stamp.stampDescription}
                              </Text>
                            </Box>
                          </Box>{" "}
                          {stamp.verified && <Tag tone="green">Verified</Tag>}
                          <Text variant="large">{stamp.score}%</Text>
                        </Box>
                      </StampCard>
                    );
                  }
                )}
              </StampScrollContainer>
              <Box display="flex" flexDirection="row" gap="4">
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() =>
                    window.open("https://passport.gitcoin.co/", "_blank")
                  }
                >
                  Get Stamps
                </Button>
              </Box>
            </Box>
          )}
      </motion.div>
      <Stack direction="horizontal" justify="space-between">
        <Box
          paddingX="5"
          paddingBottom="4"
          width={{
            xs: "40",
            md: "56",
          }}
        >
          <PrimaryButton
            variant="transparent"
            onClick={() => {
              setCurrentPage(form.formMetadata.pageOrder[pageNumber - 1]);
            }}
          >
            Back
          </PrimaryButton>
        </Box>
        <Box
          paddingX="5"
          paddingBottom="4"
          width={{
            xs: "40",
            md: "64",
          }}
        >
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
          >
            {connectedUser && (
              <Box width="full">
                <Logout />
              </Box>
            )}
            <Box width="full">
              {connectedUser ? (
                <PrimaryButton
                  onClick={() => {
                    if (
                      form.formMetadata.sybilProtectionEnabled &&
                      !form.formMetadata.hasPassedSybilCheck
                    ) {
                      toast.error(
                        "You must have a minimum score of 100% to fill this form"
                      );
                      return;
                    }
                    if (
                      form.formMetadata.formRoleGating &&
                      !form.formMetadata.hasRole
                    ) {
                      toast.error(
                        "You do not have the correct roles to access this form"
                      );
                      return;
                    }
                    setCurrentPage(form.formMetadata.pageOrder[pageNumber + 1]);
                  }}
                >
                  Continue
                </PrimaryButton>
              ) : (
                <Box onClick={() => setSignedIn(true)}>
                  <Connect />
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

const StampScrollContainer = styled(Box)`
  overflow-y: auto;
  height: 20rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

export default ConnectPage;
