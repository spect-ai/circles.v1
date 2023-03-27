import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Logout from "@/app/common/components/LogoutButton";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { StampCard } from "@/app/modules/PublicForm";
import { getUser } from "@/app/modules/PublicForm/FormFields";
import { Connect } from "@/app/modules/Sidebar/ProfileButton/ConnectButton";
import { getForm } from "@/app/services/Collection";
import {
  getAllCredentials,
  getPassportScoreAndCredentials,
} from "@/app/services/Credentials/AggregatedCredentials";
import { connectedUserAtom } from "@/app/state/global";
import {
  CollectionType,
  FormType,
  GuildRole,
  Stamp,
  UserType,
} from "@/app/types";
import { Box, Button, Stack, Tag, Text, useTheme } from "degen";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import ProfileInfo from "./ProfileInfo";

type Props = {
  form: CollectionType;
  setForm: (form: CollectionType | FormType) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const ConnectPage = ({ form, setForm, currentPage, setCurrentPage }: Props) => {
  const [hasStamps, setHasStamps] = useState({} as any);
  const [currentScore, setCurrentScore] = useState(0);
  const [stamps, setStamps] = useState([] as Stamp[]);

  const [signedIn, setSignedIn] = useState(false);
  const { mode } = useTheme();

  const router = useRouter();
  const { formId } = router.query;

  const [connectedUser] = useAtom(connectedUserAtom);
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });

  const addStamps = async (form: FormType) => {
    const stamps = await getAllCredentials();
    const stampsWithScore = [];
    if (
      form.formMetadata.sybilProtectionEnabled &&
      form.formMetadata.sybilProtectionScores
    ) {
      for (const stamp of stamps) {
        if (form.formMetadata.sybilProtectionScores[stamp.id]) {
          const stampWithScore = {
            ...stamp,
            score: form.formMetadata.sybilProtectionScores[stamp.id],
          };
          stampsWithScore.push(stampWithScore);
        }
      }
      console.log({ stampsWithScore });
      setStamps(stampsWithScore.sort((a, b) => b.score - a.score));
    }
  };

  useEffect(() => {
    (async () => {
      if (connectedUser && signedIn) {
        if (form.formMetadata.sybilProtectionEnabled) {
          if (form.formMetadata.hasPassedSybilCheck) {
            setCurrentPage(form.formMetadata.pageOrder[2]);
          }
        } else if (form.formMetadata.formRoleGating) {
          if (form.formMetadata.hasRole) {
            setCurrentPage(form.formMetadata.pageOrder[2]);
          }
        } else {
          setCurrentPage(form.formMetadata.pageOrder[2]);
        }
        setSignedIn(false);
      }
      const res: FormType = await getForm(formId as string);
      setForm(res);
      addStamps(res);
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
        const res = await getPassportScoreAndCredentials(
          currentUser?.ethAddress,
          form.formMetadata.sybilProtectionScores
        );
        console.log({ res });
        setCurrentScore(res?.score);
        setHasStamps(res?.mappedStampsWithCredentials);
      })();
    }
  }, [form, currentUser]);

  // useEffect(() => {
  //   if (currentPage === "connect") {
  //     if (connectedUser) {
  //       if (form.formMetadata.sybilProtectionEnabled) {
  //         if (form.formMetadata.hasPassedSybilCheck) {
  //           setCurrentPage(form.formMetadata.pageOrder[2]);
  //         }
  //       } else if (form.formMetadata.formRoleGating) {
  //         if (form.formMetadata.hasRole) {
  //           setCurrentPage(form.formMetadata.pageOrder[2]);
  //         }
  //       } else {
  //         setCurrentPage(form.formMetadata.pageOrder[2]);
  //       }
  //     }
  //   }
  // }, [currentPage]);
  return (
    <Box
      style={{
        height: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="auto"
    >
      {currentUser?.id && (
        <Stack align="center">
          <ProfileInfo member={currentUser} />
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
            {" "}
            <Text weight="bold">
              You require one of the following roles to fill this form
            </Text>
            <Stack space="2">
              {form.formMetadata.formRoleGating?.map((role: GuildRole) => (
                <Tag tone="accent" key={role.id}>
                  {role.name}
                </Tag>
              ))}
            </Stack>
            <Text variant="label">
              You do not have the correct roles to access this form
            </Text>{" "}
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
              <Text color="red" font="mono">
                Your current score: {currentScore}%
              </Text>
              <StampScrollContainer>
                {stamps?.map((stamp: Stamp, index: number) => {
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
                              : PassportStampIconsLightMode[stamp.providerName]}
                          </Box>
                          <Box>
                            <Text as="h1">{stamp.stampName}</Text>
                            <Text variant="small">
                              {stamp.stampDescription}
                            </Text>
                          </Box>
                        </Box>{" "}
                        {hasStamps[stamp.id] && (
                          <Tag tone="green">Verified</Tag>
                        )}
                        <Text variant="large">{stamp.score}%</Text>
                      </Box>
                    </StampCard>
                  );
                })}
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
              setCurrentPage("start");
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
          <Stack direction="horizontal">
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
                    setCurrentPage(form.formMetadata.pageOrder[2]);
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
  height: calc(100vh - 35rem);
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

export default ConnectPage;
