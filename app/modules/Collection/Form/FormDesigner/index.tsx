import { Box, Heading, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import FormPreview from "./FormPreview";

type Props = {};

const FormDesigner = (props: Props) => {
  const [themeSelected, setThemeSelected] =
    useState<"spect" | "deform" | "gform" | "typeform">("spect");
  return (
    <div className="p-8">
      <div className="flex flex-row overflow-auto">
        <div className="w-1/3">
          <Stack>
            <Text variant="label">Themes</Text>
            <Stack direction="horizontal" wrap>
              <Box onClick={() => setThemeSelected("spect")} cursor="pointer">
                <Tag
                  tone={themeSelected === "spect" ? "accent" : undefined}
                  hover
                >
                  Spect
                </Tag>
              </Box>
              <Box
                onClick={() => setThemeSelected("typeform")}
                cursor="pointer"
              >
                <Tag
                  tone={themeSelected === "typeform" ? "accent" : undefined}
                  hover
                >
                  Typeform
                </Tag>
              </Box>
              <Box onClick={() => setThemeSelected("gform")} cursor="pointer">
                <Tag
                  tone={themeSelected === "gform" ? "accent" : undefined}
                  hover
                >
                  Google Forms
                </Tag>
              </Box>
              <Box onClick={() => setThemeSelected("deform")} cursor="pointer">
                <Tag
                  tone={themeSelected === "deform" ? "accent" : undefined}
                  hover
                >
                  Deform
                </Tag>
              </Box>
              <Tag>Airtable</Tag>
              <Tag>ChatGPT</Tag>
              <Tag>Custom</Tag>
            </Stack>
          </Stack>
        </div>
        <div className="w-2/3">
          <FormPreview themeSelected={themeSelected} />
        </div>
      </div>
    </div>
  );
};

export default FormDesigner;
