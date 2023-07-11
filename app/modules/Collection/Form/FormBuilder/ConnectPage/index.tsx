import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Logout from "@/app/common/components/LogoutButton";
import { StampCard } from "@/app/modules/PublicForm";
import { getUser } from "@/app/modules/PublicForm/FormFields";
import { getForm } from "@/app/services/Collection";
import { getPassportScoreAndStamps } from "@/app/services/Credentials/AggregatedCredentials";
import { connectedUserAtom } from "@/app/state/global";
import {
  CollectionType,
  FormType,
  GuildRole,
  StampWithScoreAndVerification,
  UserType,
} from "@/app/types";
import styled from "@emotion/styled";
import { Box, Spinner, Stack, Tag, useTheme } from "degen";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import ProfileInfo from "./ProfileInfo";
import { Button, Logo, Page, Text } from "@avp1598/vibes";
import { FormConnect } from "@/app/modules/Sidebar/ConnectButtonForm";

type Props = {
  form: CollectionType;
  setForm: (form: CollectionType | FormType) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const ConnectPage = ({ form, setForm, currentPage, setCurrentPage }: Props) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [stamps, setStamps] = useState([] as StampWithScoreAndVerification[]);
  const [loadingPassport, setLoadingPassport] = useState(false);

  const [signedIn, setSignedIn] = useState(false);
  const { mode } = useTheme();

  const router = useRouter();
  const { formId } = router.query;

  const [connectedUser] = useAtom(connectedUserAtom);
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });
  const pageNumber = form.formMetadata.pageOrder.indexOf(currentPage);

  const getPassportInfo = async (slug: string) => {
    const res = await getPassportScoreAndStamps(slug);
    console.log({ res });
    setCurrentScore(res?.score);
    setStamps(res.stamps?.sort((a, b) => b.score - a.score));
  };

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
        if (!stamps?.length) setLoadingPassport(true);
        try {
          await getPassportInfo(form.slug);
        } catch (e) {
          console.log({ e });
        }
        setLoadingPassport(false);
      })();
    }
    if (!currentUser?.id) {
      setCurrentScore(0);
      setStamps([]);
    }
  }, [form, currentUser]);

  return (
    <Page>
      <Box
        style={{
          minHeight: "calc(100vh - 20rem)",
          width: "100%",
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
            {form.formMetadata.logo && <Logo src={form.formMetadata.logo} />}
            <Text type="heading">{form.name}</Text>
            {form.description && (
              <Text type="description" description={form.description} />
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
                <Text>You require one of the following roles on</Text>
                <a href="https://guild.xyz">
                  <Text>guild.xyz</Text>
                </a>
                <Text>to fill this form. Sign in to check your role</Text>
              </Stack>
              <Stack space="2">
                {form.formMetadata.formRoleGating?.map((role: GuildRole) => (
                  <Tag tone="accent" key={role.id}>
                    {role.name}
                  </Tag>
                ))}
              </Stack>
              {connectedUser && (
                <Text>
                  You do not have the correct roles to access this form
                </Text>
              )}
              <Box display="flex" flexDirection="row" gap="4">
                <Button
                  variant="secondary"
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
          {form.formMetadata.sybilProtectionEnabled && (
            <Box
              display="flex"
              flexDirection="column"
              padding="4"
              marginTop="4"
              gap="4"
            >
              {" "}
              <Stack space="1">
                <Text>
                  This form is sybil protected using Gitcoin Passport. You must
                  have a minimum score of 100% to fill this form.
                </Text>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  marginTop="2"
                  cursor="pointer"
                >
                  <a
                    href="https://docs.passport.gitcoin.co/overview/introducing-gitcoin-passport"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Text>Learn More</Text>
                  </a>
                </Box>
              </Stack>
              {loadingPassport && (
                <Text>
                  <Stack direction="horizontal" space="2" align="center">
                    <Spinner size="small" />
                    Loading Passport
                  </Stack>
                </Text>
              )}
              {!currentUser && (
                <Stack space="2">
                  <Text>
                    Please sign in to verify your Gitcoin passport. Make sure to
                    connect the same account that contains your stamps.
                  </Text>
                </Stack>
              )}
              {!loadingPassport && currentUser && (
                <Box>
                  <Text>Your current score: {currentScore}%</Text>
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
                                  <Text>{stamp.stampName}</Text>
                                  <Text type="label">
                                    {stamp.stampDescription}
                                  </Text>
                                </Box>
                              </Box>{" "}
                              {stamp.verified && (
                                <Tag tone="green">Verified</Tag>
                              )}
                              <Text>{stamp.score}%</Text>
                            </Box>
                          </StampCard>
                        );
                      }
                    )}
                  </StampScrollContainer>
                  <Box display="flex" flexDirection="row" gap="4">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        window.open("https://passport.gitcoin.co/", "_blank")
                      }
                    >
                      Get Stamps
                    </Button>
                    <Button
                      onClick={async () => {
                        setLoadingPassport(true);
                        try {
                          await getPassportInfo(form.slug);
                        } catch (e) {
                          console.log({ e });
                        }
                        setLoadingPassport(false);
                      }}
                    >
                      Check Score Again
                    </Button>
                  </Box>
                </Box>
              )}
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
            <Button
              variant="tertiary"
              onClick={() => {
                setCurrentPage(form.formMetadata.pageOrder[pageNumber - 1]);
              }}
            >
              Back
            </Button>
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
                  <Button
                    onClick={() => {
                      if (
                        form.formMetadata.sybilProtectionEnabled &&
                        currentScore < 100
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
                      setCurrentPage(
                        form.formMetadata.pageOrder[pageNumber + 1]
                      );
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Box onClick={() => setSignedIn(true)}>
                    <FormConnect />
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Page>
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
