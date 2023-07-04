import { Box, Heading, Stack, Tag, Text } from "degen";
import React from "react";
import FormPreview from "./FormPreview";

type Props = {};

const FormDesigner = (props: Props) => {
  return (
    <div
      className="p-8"
      style={{
        height: "calc(100vh - 16rem)",
      }}
    >
      <div className="flex flex-row">
        <div className="w-full">
          <Stack>
            <Text variant="label">Themes</Text>
            <Stack direction="horizontal" wrap>
              <Tag tone="accent">Spect</Tag>
              <Tag>Typeform</Tag>
              <Tag>Google Forms</Tag>
              <Tag>Deform</Tag>
              <Tag>Airtable</Tag>
              <Tag>ChatGPT</Tag>
              <Tag>Custom</Tag>
            </Stack>
          </Stack>
        </div>
        <FormPreview />
      </div>
    </div>
  );
};

export default FormDesigner;
