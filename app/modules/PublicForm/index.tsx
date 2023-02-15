/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getForm } from "@/app/services/Collection";
import { FormType, GuildRole, Stamp, UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Avatar, Box, Text, Stack, useTheme, Button, Tag } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import FormFields from "./FormFields";
import { motion } from "framer-motion";
import Loader from "@/app/common/components/Loader";
import { getAllCredentials } from "@/app/services/Credentials/AggregatedCredentials";
import { useGlobal } from "@/app/context/globalContext";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import mixpanel from "@/app/common/utils/mixpanel";
import Image from "next/image";
import Editor from "@/app/common/components/Editor";
import DataActivity from "../Collection/Form/DataDrawer/DataActivity";
import _ from "lodash";
import { useLocation } from "react-use";
import SocialMedia from "@/app/common/components/SocialMedia";
import Link from "next/link";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import ConnectDiscordButton from "@/app/common/components/ConnectDiscordButton";

export default function PublicForm() {
  const router = useRouter();
  const { isReady } = router;
  const { formId } = router.query;
  const [form, setForm] = useState<FormType>();
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);
  const [canFillForm, setCanFillForm] = useState(
    form?.formMetadata.canFillForm || false
  );
  const [stamps, setStamps] = useState([] as Stamp[]);

  const { connectedUser, socket } = useGlobal();

  const [memberDetails, setMemberDetails] = useState({} as any);

  const { pathname, hostname } = useLocation();
  const route = pathname?.split("/")[3];

  const getMemberDetails = React.useCallback(
    (id: string) => {
      return memberDetails?.memberDetails[id];
    },
    [memberDetails]
  );

  const fetchMemberDetails = async (cId: string) => {
    const res = await (
      await fetch(
        `${process.env.API_HOST}/circle/${cId}/memberDetailsWithSlug?circleSlugs=${cId}`
      )
    ).json();
    if (res.members) setMemberDetails(res);
    else toast.error("Error fetching member details");
  };

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
      setStamps(stampsWithScore);
    }
  };

  console.log({ form });
  useEffect(() => {
    void (async () => {
      if (formId) {
        setLoading(true);
        const res: FormType = await getForm(formId as string);
        if (res.id) {
          await fetchMemberDetails(res.parents[0].slug);
          setForm(res);
          setCanFillForm(res.formMetadata.canFillForm);
          await addStamps(res);
        } else toast.error("Error fetching form");
        setLoading(false);
      }
    })();
  }, [connectedUser, formId]);

  useEffect(() => {
    if (socket && socket.on && formId) {
      socket.on(
        `${formId}:newActivityPublic`,
        _.debounce(async (event: { user: string }) => {
          console.log({ event, connectedUser });
          if (event.user !== connectedUser) {
            const res: FormType = await getForm(formId as string);
            setForm(res);
          }
        }, 2000)
      );
    }
    return () => {
      if (socket && socket.off) {
        socket.off(`${formId}:newActivityPublic`);
      }
    };
  }, [connectedUser, formId, socket]);

  if (loading) {
    return <Loader loading text="Fetching form..." />;
  }

  return (
    <ScrollContainer
      backgroundColor={
        route === "embed" ? "transparent" : "backgroundSecondary"
      }
    >
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      {route !== "embed" && (
        <CoverImage
          src={form?.formMetadata.cover || ""}
          backgroundColor="accentSecondary"
        />
      )}
      {form && (
        <Container embed={route === "embed"}>
          <FormContainer
            backgroundColor={route === "embed" ? "transparent" : "background"}
            borderRadius={route === "embed" ? "none" : "2xLarge"}
            style={{
              boxShadow: `0rem 0.2rem 0.5rem ${
                mode === "dark" ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.1)"
              }`,
            }}
          >
            <Box width="full" padding="4">
              <Stack space="2">
                {form.formMetadata.logo && (
                  <Avatar src={form.formMetadata.logo} label="" size="20" />
                )}
                <NameInput
                  autoFocus
                  value={form.name}
                  disabled
                  rows={Math.floor(form.name?.length / 60) + 1}
                />
                {form.description && (
                  <Editor value={form.description} isDirty={true} disabled />
                )}
              </Stack>
            </Box>
            {!form.formMetadata.active && (
              <Box width="full" padding="4">
                <Text variant="large" weight="semiBold">
                  This form is not active
                </Text>
              </Box>
            )}
            {canFillForm && currentUser?.id && (
              <motion.div
                className="box"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <FormFields form={form} setForm={setForm} />
              </motion.div>
            )}
            {!currentUser?.id && (
              <Box
                display="flex"
                flexDirection="column"
                padding="4"
                marginTop="4"
                gap="4"
              >
                {" "}
                {form.formMetadata.formRoleGating &&
                  form.formMetadata.formRoleGating.length > 0 && (
                    <Text weight="semiBold" variant="large" color="textPrimary">
                      This form is role gated
                    </Text>
                  )}
                {form.formMetadata.mintkudosTokenId && (
                  <Text weight="semiBold" variant="large" color="textPrimary">
                    This form distributes soulbound tokens to responders
                  </Text>
                )}
                {form.formMetadata.surveyTokenId && (
                  <Text weight="semiBold" variant="large" color="textPrimary">
                    This form distributes erc20 tokens to responders
                  </Text>
                )}
                {form.formMetadata.sybilProtectionEnabled && (
                  <Text weight="semiBold" variant="large" color="textPrimary">
                    This form is Sybil protected
                  </Text>
                )}
                <Box
                  width={{
                    xs: "full",
                    sm: "full",
                    md: "1/4",
                  }}
                >
                  <PrimaryButton
                    onClick={() => {
                      process.env.NODE_ENV === "production" &&
                        mixpanel.track("Connect Wallet Form", {
                          formId: form.slug,
                        });
                      openConnectModal && openConnectModal();
                    }}
                  >
                    Connect Wallet
                  </PrimaryButton>
                </Box>
              </Box>
            )}
            {form.formMetadata.discordConnectionRequired &&
              !currentUser?.discordId &&
              currentUser?.id && (
                <Box paddingLeft="4">
                  <Text weight="semiBold" variant="large" color="textPrimary">
                    This form requires Discord connection so it can
                    automatically assign roles
                  </Text>
                  <Box
                    width={{
                      xs: "full",
                      sm: "full",
                      md: "1/4",
                    }}
                    marginTop="4"
                  >
                    <ConnectDiscordButton
                      type="publicForm"
                      state={`/r/` + form.slug}
                      width="full"
                    />
                  </Box>
                </Box>
              )}
            {!canFillForm && currentUser?.id && !loading && (
              <motion.div
                className="box"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                {!form.formMetadata.hasRole && (
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
                      {form.formMetadata.formRoleGating?.map(
                        (role: GuildRole) => (
                          <Tag tone="accent" key={role.id}>
                            {role.name}
                          </Tag>
                        )
                      )}
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
                      <Button
                        variant="tertiary"
                        size="small"
                        onClick={() => router.push("/")}
                      >
                        No worries, go to dashboard
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
                        This form is sybil protected. You must have a minimum
                        score of 100% to fill this form. Please check the
                        assigned scores below.
                      </Text>
                      <StampScrollContainer>
                        {stamps?.map((stamp: Stamp, index: number) => {
                          return (
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              padding="4"
                              width="full"
                              key={index}
                            >
                              <Box
                                display="flex"
                                flexDirection="row"
                                width="full"
                                alignItems="center"
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
                                </Box>
                                <Text variant="small">{stamp.score}%</Text>
                              </Box>
                            </Box>
                          );
                        })}
                      </StampScrollContainer>
                      <Box display="flex" flexDirection="row" gap="4">
                        <Button
                          variant="tertiary"
                          size="small"
                          onClick={() =>
                            window.open(
                              "https://passport.gitcoin.co/",
                              "_blank"
                            )
                          }
                        >
                          Get Stamps
                        </Button>
                        <Button
                          variant="tertiary"
                          size="small"
                          onClick={() => router.push("/")}
                        >
                          No worries, go to dashboard
                        </Button>
                      </Box>
                    </Box>
                  )}
              </motion.div>
            )}
            {form.formMetadata.previousResponses?.length > 0 && (
              <DataActivity
                activities={form.activity}
                activityOrder={form.activityOrder}
                getMemberDetails={getMemberDetails}
                collectionId={form.id}
                dataId={
                  form.formMetadata.previousResponses[
                    form.formMetadata.previousResponses?.length - 1
                  ]?.slug
                }
                setForm={setForm}
                dataOwner={currentUser as UserType}
                collection={form}
              />
            )}
          </FormContainer>
          <Stack align={"center"}>
            <Text variant="label">Powered By</Text>
            <a
              href="https://spect.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {mode == "dark" ? (
                <Image
                  src={"/logo2.svg"}
                  alt="dark-mode-logo"
                  height={"35"}
                  width="138"
                />
              ) : (
                <Image
                  src={"/logo1.svg"}
                  alt="light-mode-logo"
                  height={"35"}
                  width="138"
                />
              )}
            </a>
            <SocialMedia />
          </Stack>
          <Box marginBottom="8" />
        </Container>
      )}
    </ScrollContainer>
  );
}

const Container = styled(Box)<{ embed: boolean }>`
  @media (max-width: 768px) {
    padding: 0rem ${(props) => (props.embed ? "0rem" : "1rem")};
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: ${(props) => (props.embed ? "0rem" : "2rem")}
      ${(props) => (props.embed ? "0rem" : "4rem")};
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: ${(props) => (props.embed ? "0rem" : "2rem")}
      ${(props) => (props.embed ? "0rem" : "14rem")};
  }

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: ${(props) => (props.embed ? "0rem" : "-8rem")};
  padding: 0rem ${(props) => (props.embed ? "0rem" : "14rem")};
`;

export const NameInput = styled.textarea`
  resize: none;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  font-family: Inter;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
  overflow: hidden;
`;

export const CoverImage = styled(Box)<{ src: string }>`
  width: 100%;
  height: 18rem;
  background-image: url(${(props) => props.src});
  background-size: cover;
  z-index: -1;
  border-radius: 1rem;
`;

const FormContainer = styled(Box)`
  padding: 0.5rem;
  margin-bottom: 2rem;
`;

const ScrollContainer = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  max-height: calc(100vh);
  overflow-y: auto;
`;

const StampScrollContainer = styled(Box)`
  overflow-y: auto;
  height: calc(100vh - 35rem);
  ::-webkit-scrollbar {
    width: 5px;
  }
`;
