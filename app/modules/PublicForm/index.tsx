/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getForm } from "@/app/services/Collection";
import { FormType, Registry } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormFields from "./FormFields";

export default function PublicForm() {
  const router = useRouter();
  const { formId } = router.query;
  const [form, setForm] = useState<FormType>();

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
      <Box padding="8">
        <Stack align="center">
          <Heading>{form.name}</Heading>
          <Text>{form.description}</Text>
          <FormFields form={form} />
        </Stack>
      </Box>
    );
  }
  return <Box>Loading</Box>;
}
