import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { duplicateCircle } from "@/app/services/Circle";
import { useTemplate } from "@/app/services/Templates";
import { SpectTemplate } from "@/app/types";
import { Box, Button, IconChevronLeft, Stack, Tag, Text } from "degen";
import { useState } from "react";
import styled from "styled-components";
import CreateFromTemplateModal from "./CreateFromTemplateModal";
import { AnimatePresence } from "framer-motion";

type Props = {
  template: SpectTemplate;
  handleBack: () => void;
};

export default function Template({ template, handleBack }: Props) {
  const [createFromTemplateModalOpen, setCreateFromTemplateModalOpen] =
    useState(false);
  return (
    <Stack space="4">
      <AnimatePresence>
        {createFromTemplateModalOpen && (
          <CreateFromTemplateModal
            template={template}
            handleClose={() => {
              setCreateFromTemplateModalOpen(false);
              // window.open(`http://localhost:3000/${template.id}`, "_blank");
            }}
          />
        )}
      </AnimatePresence>
      <Button size="extraSmall" variant="transparent" onClick={handleBack}>
        <Box display="flex" alignItems="center">
          <IconChevronLeft size="4" />
          Go Back
        </Box>
      </Button>
      <Stack direction="vertical" space="4">
        <Stack
          direction="horizontal"
          space="4"
          align={"center"}
          justify={"space-between"}
        >
          <Text variant="extraLarge" weight="bold">
            {template.name}
          </Text>
          <PrimaryButton
            size="large"
            variant="secondary"
            onClick={async () => {
              setCreateFromTemplateModalOpen(true);
            }}
          >
            Use Template
          </PrimaryButton>
        </Stack>
        <Stack direction="horizontal" space="2" wrap>
          {template.tags &&
            template.tags.map((item) => <Tag key={item}>{item}</Tag>)}{" "}
        </Stack>

        <Editor version={2} value={template.description} disabled />
      </Stack>
    </Stack>
  );
}
