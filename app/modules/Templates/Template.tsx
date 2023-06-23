import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { duplicateCircle } from "@/app/services/Circle";
import { getATemplate, useTemplate } from "@/app/services/Templates";
import { Box, Button, IconChevronLeft, Spinner, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import CreateFromTemplateModal from "./CreateFromTemplateModal";
import { AnimatePresence } from "framer-motion";
import { Template as TemplateType, TemplateMinimal } from "@/app/types";

type Props = {
  template: TemplateMinimal;
  handleBack: () => void;
};

export default function Template({ template, handleBack }: Props) {
  const [createFromTemplateModalOpen, setCreateFromTemplateModalOpen] =
    useState(false);
  const [detailedTemplate, setDetailedTemplate] = useState<TemplateType>(
    {} as TemplateType
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    void (async () => {
      setLoading(true);
      if (template) {
        const res = await getATemplate(template.id);
        console.log({
          detailedTemplate: res,
        });
        setDetailedTemplate(res);
      }
      setLoading(false);
    })();
  }, [template]);

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
        {loading && <Spinner />}
        {!loading && (
          <Editor version={2} value={detailedTemplate.description} disabled />
        )}
      </Stack>
    </Stack>
  );
}
