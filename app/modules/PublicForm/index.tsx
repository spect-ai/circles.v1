/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getForm } from "@/app/services/Collection";
import { FormType } from "@/app/types";
import { Avatar, Box, Stack, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import FormFields from "./FormFields";

export default function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;
  const [form, setForm] = useState<FormType>();
  const { mode } = useTheme();

  useEffect(() => {
    console.log({ formId });
    void (async () => {
      if (formId) {
        const res = await getForm(formId as string);
        console.log({ res });
        if (res.id) {
          setForm(res);
        } else toast.error("Error fetching form");
      }
    })();
  }, [formId]);

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
            <FormFields form={form} />
          </FormContainer>
        </Container>
      </ScrollContainer>
    );
  }
  return <Box>Loading</Box>;
}

const Container = styled(Box)`
  overflow-y: auto;
  padding: 2rem 14rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: -10rem;
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

export const DescriptionInput = styled.input<{ mode: "dark" | "light" }>`
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
