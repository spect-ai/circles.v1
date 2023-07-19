/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormType } from "@/app/types";
import { Box, useTheme } from "degen";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useLocation } from "react-use";
import { ToastContainer } from "react-toastify";
import FormFields from "./FormFields";
import {
  LocalProfileContext,
  useProviderLocalProfile,
} from "../Profile/ProfileSettings/LocalProfileContext";
import {
  CircleContext,
  useProviderCircleContext,
} from "../Circle/CircleContext";
import PublicFormLayout from "@/app/common/layout/PublicLayout/PublicFormLayout";
import { Form, FormProvider } from "@avp1598/vibes";

type Props = {
  form?: FormType;
  embed?: boolean;
  preview?: boolean;
};

function PublicForm({ form: fetchedForm, embed, preview }: Props) {
  const [form, setForm] = useState<FormType | undefined>(fetchedForm);
  const { mode } = useTheme();
  const { pathname } = useLocation();
  const route = pathname?.split("/")[3];

  const context = useProviderCircleContext();
  const profileContext = useProviderLocalProfile();

  useEffect(() => {
    setForm(fetchedForm);
  }, [fetchedForm]);

  if (embed) {
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
        <Container embed={true} id="container">
          <FormContainer>
            <FormFields form={form} setForm={setForm} />
          </FormContainer>
        </Container>
      </ScrollContainer>
    );
  }

  return (
    <LocalProfileContext.Provider value={profileContext}>
      <CircleContext.Provider value={context}>
        <PublicFormLayout>
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
            <FormProvider
              colorPalette={form?.formMetadata.theme?.layout.colorPalette || {}}
              formProps={{
                ...form?.formMetadata?.theme?.layout?.formProps,
                cover: form?.formMetadata.cover
                  ? `url(${form?.formMetadata?.cover})`
                  : "rgb(191, 90, 242,0.2)",
                backgroundPosition: preview ? "absolute" : "fixed",
              }}
              pageProps={form?.formMetadata.theme?.layout.pageProps || {}}
              fieldProps={form?.formMetadata.theme?.layout.fieldProps || {}}
              buttonProps={form?.formMetadata.theme?.layout.buttonProps || {}}
              textProps={form?.formMetadata.theme?.layout.textProps || {}}
              logoProps={form?.formMetadata.theme?.layout.logoProps || {}}
              optionProps={form?.formMetadata.theme?.layout.optionProps || {}}
              tagProps={form?.formMetadata.theme?.layout.tagProps || {}}
              stepperProps={form?.formMetadata.theme?.layout.stepperProps || {}}
            >
              <Form>
                <FormFields form={form} setForm={setForm} preview={preview} />
              </Form>
            </FormProvider>
          </ScrollContainer>
        </PublicFormLayout>
      </CircleContext.Provider>
    </LocalProfileContext.Provider>
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

  @media (max-width: 768px) {
    height: 12rem;
  }
`;

const FormContainer = styled(Box)`
  padding: 0.5rem;
  margin-bottom: 2rem;
`;

const ScrollContainer = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  height: 100vh;
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
