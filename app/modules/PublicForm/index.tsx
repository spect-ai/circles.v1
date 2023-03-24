/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FormType, UserType } from "@/app/types";
import { Box, Text, Stack, useTheme } from "degen";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { motion } from "framer-motion";
import mixpanel from "@/app/common/utils/mixpanel";
import Image from "next/image";

import _ from "lodash";
import { useLocation } from "react-use";
import FormFields from "./FormFields";

function PublicForm() {
  const [form, setForm] = useState<FormType>();
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { pathname } = useLocation();
  const route = pathname?.split("/")[3];

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FormFields form={form} setForm={setForm} />
          </motion.div>
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
          </a>{" "}
          <Text variant="large">
            💪 Powerful Web3 Forms, Projects and Automations 🤝
          </Text>
          <a href="/" target="_blank">
            <PrimaryButton
              onClick={() => {
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Create your own form", {
                    form: form?.name,
                    sybilEnabled: form?.formMetadata.sybilProtectionEnabled,
                    user: currentUser?.username,
                  });
              }}
            >
              Build With Spect
            </PrimaryButton>
          </a>
        </Stack>
        <Box marginBottom="8" />
      </Container>
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

export const StampCard = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

PublicForm.whyDidYouRender = true;

export default React.memo(PublicForm);
