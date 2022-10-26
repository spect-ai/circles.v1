/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getForm } from "@/app/services/Collection";
import { FormType, GuildRole, UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Avatar, Box, Text, Stack, useTheme, Button, Tag } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import FormFields from "./FormFields";
import { motion } from "framer-motion";
import Loader from "@/app/common/components/Loader";

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

  useEffect(() => {
    void (async () => {
      if (formId) {
        const res = await getForm(formId as string);
        console.log({ res });
        if (res.id) {
          setForm(res);
          setCanFillForm(res.canFillForm);
        } else toast.error("Error fetching form");
      }
    })();
  }, [formId]);

  useEffect(() => {
    void (async () => {
      if (formId) {
        setLoading(true);
        const res = await getForm(formId as string);
        if (res.id) {
          console.log({ res });
          console.log({ res: res.canFillForm });
          setCanFillForm(res.canFillForm);
        } else toast.error("Error fetching form");
        setLoading(false);
      }
    })();
  }, [currentUser, formId]);

  if (form) {
    return (
      <ScrollContainer>
        <CoverImage src={form.cover} backgroundColor="accentSecondary" />
        <Container>
          <FormContainer backgroundColor="background">
            <Box width="full" marginBottom="2" padding="4">
              <Stack space="2">
                {form.logo && <Avatar src={form.logo} label="" size="20" />}
                <NameInput
                  placeholder="Enter name"
                  autoFocus
                  value={form.name}
                  disabled
                />
                <DescriptionInput
                  mode={mode}
                  placeholder="Enter description"
                  autoFocus
                  value={form.description}
                  disabled
                />
              </Stack>
            </Box>
            {canFillForm && (
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
            {!canFillForm && !currentUser?.id && (
              <Box
                display="flex"
                flexDirection="column"
                padding="4"
                marginTop="4"
                gap="4"
              >
                {" "}
                <Text weight="semiBold" variant="large">
                  This form is role gated
                </Text>
                <Box
                  width={{
                    xs: "full",
                    sm: "full",
                    md: "1/4",
                  }}
                >
                  <PrimaryButton onClick={openConnectModal}>
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
              </motion.div>
            )}
          </FormContainer>
        </Container>
      </ScrollContainer>
    );
  }
  return <Loader loading text="Fetching form..." />;
}

const Container = styled(Box)`
  @media (max-width: 768px) {
    padding: 0rem 1rem;
    margin-top: -16rem;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 2rem 4rem;
    margin-top: -12rem;
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: 2rem 14rem;
    margin-top: -10rem;
  }

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: -10rem;
  padding: 2rem 14rem;
  overflow-y: auto;
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

export const DescriptionInput = styled.textarea<{ mode: "dark" | "light" }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20,20,20,0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20,20,20,0.7)"};
  font-weight: 400;
  font-size: 14px;
  resize: none;
`;

export const CoverImage = styled(Box)<{ src: string }>`
  width: 100%;
  height: 20rem;
  background-image: url(${(props) => props.src});
  background-size: cover;
  z-index: -1;
`;

const FormContainer = styled(Box)``;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: calc(100vh);
  overflow-y: auto;
`;
