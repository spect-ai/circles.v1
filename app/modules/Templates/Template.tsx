import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getATemplate } from "@/app/services/Templates";
import {
  CircleType,
  TemplateMinimal,
  Template as TemplateType,
} from "@/app/types";
import { Box, Button, IconChevronLeft, Spinner, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SlShareAlt } from "react-icons/sl";
import { toast } from "react-toastify";
import styled from "styled-components";
import CreateFromTemplateModal from "./CreateFromTemplateModal";

type Props = {
  template: TemplateMinimal;
  handleBack: () => void;
  destinationCircle: CircleType;
  setDestinationCircle: (circle: CircleType) => void;
  discordGuildId: string;
};

export default function Template({
  template,
  handleBack,
  destinationCircle,
  setDestinationCircle,
  discordGuildId,
}: Props) {
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
            template={detailedTemplate}
            handleClose={() => {
              setCreateFromTemplateModalOpen(false);
            }}
            destinationCircle={destinationCircle}
            setDestinationCircle={setDestinationCircle}
            discordGuildId={discordGuildId}
          />
        )}
      </AnimatePresence>
      <Stack
        direction="horizontal"
        space="4"
        align="center"
        justify={"space-between"}
      >
        <Button size="extraSmall" variant="transparent" onClick={handleBack}>
          <Box display="flex" alignItems="center">
            <IconChevronLeft size="4" />
            <Text color="textSecondary"> Go Back</Text>
          </Box>
        </Button>
        <Button
          size="extraSmall"
          variant="transparent"
          onClick={() => {
            void navigator.clipboard.writeText(
              `https://circles.spect.network/templates?templateId=${template.id}`
            );
            toast.success("Copied to clipboard");
          }}
        >
          <Box display="flex" alignItems="center" gap="2">
            <Text color="textSecondary">Share</Text>
            <SlShareAlt size={14} />
          </Box>
        </Button>
      </Stack>
      <Stack direction="vertical" space="4">
        <TemplateImage src={template.image} />

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

const TemplateImage = styled.img`
  width: 100%;
  height: 24rem;
  object-fit: cover;
  border-radius: 1rem 1rem;

  @media (max-width: 768px) {
    height: 7rem;
  }
`;
