import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { SpectTemplate } from "@/app/types";
import { Box, Button, IconChevronLeft, Stack, Tag, Text } from "degen";
import styled from "styled-components";

type Props = {
  template: SpectTemplate;
  handleBack: () => void;
};

export default function Templates({ template, handleBack }: Props) {
  return (
    <Stack space="4">
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
          <PrimaryButton size="large" variant="secondary">
            Use Template
          </PrimaryButton>
        </Stack>
        <Stack direction="horizontal" space="2" wrap>
          {template.tags &&
            template.tags.map((item) => <Tag key={item}>{item}</Tag>)}{" "}
        </Stack>
        <Box marginTop="8">
          <StyledIframe
            src={`http://localhost:3000/erer-3`}
            title="Figma Embed"
            allowFullScreen
          />
        </Box>
        <Editor version={2} value={template.description} disabled />
      </Stack>
    </Stack>
  );
}

const StyledIframe = styled.iframe`
  @media (max-width: 768px) {
    width: 100%;
    height: 100%px;
  }
  @media (max-width: 1280px) and (min-width: 768px) {
    width: 100%;
    height: 250px;
  }
  width: 100%;
  height: 500px;
  border: 0.5px solid #b6b6b6;
  border-radius: 8px;
`;
