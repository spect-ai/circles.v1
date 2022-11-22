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
import {
  GithubOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import Image from "next/image";
import Editor from "@/app/common/components/Editor";
import DataActivity from "../Collection/Form/DataDrawer/DataActivity";
import _ from "lodash";
import { useLocation } from "react-use";

export default function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;
  const [form, setForm] = useState<FormType>();
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);
  const [canFillForm, setCanFillForm] = useState(form?.canFillForm || false);
  const [stamps, setStamps] = useState([] as Stamp[]);

  const { connectedUser, socket } = useGlobal();

  const [memberDetails, setMemberDetails] = useState({} as any);

  const { pathname } = useLocation();
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
    if (form.sybilProtectionEnabled) {
      for (const stamp of stamps) {
        if (form.sybilProtectionScores[stamp.id]) {
          const stampWithScore = {
            ...stamp,
            score: form.sybilProtectionScores[stamp.id],
          };
          stampsWithScore.push(stampWithScore);
        }
      }
      setStamps(stampsWithScore);
    }
  };

  useEffect(() => {
    void (async () => {
      if (formId) {
        setLoading(true);
        const res: FormType = await getForm(formId as string);
        if (res.id) {
          await fetchMemberDetails(res.parents[0].slug);
          setForm(res);
          setCanFillForm(res.canFillForm);
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
  }, [connectedUser, formId, socket]);

  if (loading) {
    return <Loader loading text="Fetching form..." />;
  }

  return (
    <ScrollContainer>
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
        <CoverImage src={form?.cover || ""} backgroundColor="accentSecondary" />
      )}
      {form && (
        <Container embed={route === "embed"}>
          <FormContainer
            borderRadius={route === "embed" ? "none" : "2xLarge"}
            backgroundColor="background"
            style={{
              boxShadow: `0rem 0.2rem 0.5rem ${
                mode === "dark" ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.1)"
              }`,
            }}
          >
            <Box width="full" padding="4">
              <Stack space="2">
                {form.logo && <Avatar src={form.logo} label="" size="20" />}
                <NameInput autoFocus value={form.name} disabled />
                {form.description && (
                  <Editor value={form.description} isDirty={true} disabled />
                )}
              </Stack>
            </Box>
            {!form.active && (
              <Box width="full" padding="4">
                <Text variant="large">This form is not active</Text>
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
                {" "}
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
                {form.formRoleGating && form.formRoleGating.length > 0 && (
                  <Text weight="semiBold" variant="large" color="textPrimary">
                    This form is role gated
                  </Text>
                )}
                {form.mintkudosTokenId && (
                  <Text weight="semiBold" variant="large" color="textPrimary">
                    This form distributes Kudos to responders
                  </Text>
                )}
                {form.sybilProtectionEnabled && (
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
                {!form.hasRole && (
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
                      {form.formRoleGating.map((role: GuildRole) => (
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
                {!form.hasPassedSybilCheck && (
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
                      score of 100% to fill this form. Please check the assigned
                      scores below.
                    </Text>
                    <StampScrollContainer>
                      {stamps.map((stamp: Stamp, index: number) => {
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
                          window.open("https://passport.gitcoin.co/", "_blank")
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
            {form.previousResponses.length > 0 && (
              <DataActivity
                activities={form.activity}
                activityOrder={form.activityOrder}
                getMemberDetails={getMemberDetails}
                collectionId={form.id}
                dataId={
                  form.previousResponses[form.previousResponses?.length - 1]
                    ?.slug
                }
                setForm={setForm}
                dataOwner={currentUser as UserType}
              />
            )}
          </FormContainer>
          <Stack align={"center"}>
            <Text variant="label">Powered By</Text>
            <a href="/" target="_blank" rel="noopener noreferrer">
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
            <Stack justify={"center"} direction="horizontal" align={"center"}>
              <a
                href={"https://twitter.com/joinSpect"}
                target="_blank"
                rel="noreferrer"
              >
                <Button shape="circle" size="small" variant="transparent">
                  <TwitterOutlined style={{ fontSize: "1.3rem" }} />
                </Button>
              </a>

              <a
                href={"https://discord.gg/AF2qRMMpZ9"}
                target="_blank"
                rel="noreferrer"
              >
                <Button shape="circle" size="small" variant="transparent">
                  <DiscordIcon />
                </Button>
              </a>

              <a
                href={"https://github.com/spect-ai"}
                target="_blank"
                rel="noreferrer"
              >
                <Button shape="circle" size="small" variant="transparent">
                  <GithubOutlined style={{ fontSize: "1.3rem" }} />
                </Button>
              </a>

              <a
                href={
                  "https://www.youtube.com/channel/UCUXOC62aiZqT_ijL-dz379Q"
                }
                target="_blank"
                rel="noreferrer"
              >
                <Button shape="circle" size="small" variant="transparent">
                  <YoutubeFilled style={{ fontSize: "1.3rem" }} />
                </Button>
              </a>
            </Stack>
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

export const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

export const CoverImage = styled(Box)<{ src: string }>`
  width: 100%;
  height: 18rem;
  background-image: url(${(props) => props.src});
  background-size: cover;
  z-index: -1;
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
