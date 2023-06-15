import { SpectTemplate } from "@/app/types";
import { Box, Button, IconSearch, Input, Stack, Text } from "degen";
import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import Template from "./Template";
import Logo from "@/app/common/components/Logo";

export default function Templates() {
  const [template, setTemplate] = useState<SpectTemplate | null>(null);

  const sidebarItems = [
    "Popular",
    "New",
    "Onboarding",
    "Education",
    "Community Management",
    "Grant Program",
    "Project Management",
    "Event Management",
    "Governance",
    "Social",
    "Marketing",
  ];
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(
    sidebarItems[0]
  );
  const spectTemplates = [
    {
      id: "1",
      name: "Community Feedback",
      description:
        "Get feedback from your community on a topic of your choice.",
      preview: "",
      tags: ["Community Management", "Onboarding"],
      image: "",
      url: "",
    },
    {
      id: "2",

      name: "Community Feedback",
      description:
        "Get feedback from your community on a topic of your choice.",
      preview: "",
      tags: ["Community Management", "Onboarding"],

      image: "",
      url: "",
    },
    {
      id: "3",

      name: "Community Feedback",
      description:
        "Get feedback from your community on a topic of your choice.",
      preview: "",
      tags: ["Community Management", "Onboarding"],
      url: "",

      image: "",
    },
    {
      id: "4",

      name: "Community Feedback",
      description:
        "Get feedback from your community on a topic of your choice.",
      preview: "",
      tags: ["Community Management", "Onboarding"],
      image: "",
      url: "",
    },
  ];

  const onClick = (template: SpectTemplate) => {
    setTemplate(template);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        paddingX={{
          xs: "1",
          md: "2",
        }}
        transitionDuration="500"
        width="full"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            paddingY="3"
            display="flex"
            flexDirection="row"
            gap="2"
            alignItems="center"
          >
            <Logo
              href="/"
              src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
              gradient=""
            />
            <Text variant="extraLarge">Spect Templates</Text>
          </Box>
          <Button
            size="small"
            variant="transparent"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <Box display="flex" alignItems="center">
              Go to Dashboard
            </Box>
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          width="full"
          padding="32"
          paddingTop="24"
          gap="16"
        >
          <Box display="flex" flexDirection="column" width="1/4">
            {" "}
            <Stack direction="vertical" space="4">
              <Input
                placeholder="Search Templates"
                onChange={(e) => {
                  console.log(e.target.value);
                }}
                label=""
                prefix={<IconSearch size="4" />}
              />
              <Stack direction="vertical" space="2">
                {sidebarItems.map((item) => (
                  <Button
                    size="small"
                    variant={
                      selectedSidebarItem === item ? "tertiary" : "transparent"
                    }
                    onClick={() => setSelectedSidebarItem(item)}
                  >
                    {" "}
                    <Text>{item}</Text>
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            width="3/4"
          >
            {!template && (
              <Stack direction="horizontal" space="4" wrap>
                {spectTemplates.map((item) => (
                  <TemplateCard
                    key={template}
                    template={item}
                    onClick={async () => {
                      onClick(item);
                    }}
                  />
                ))}
              </Stack>
            )}
            {template && (
              <Template
                template={template}
                handleBack={() => setTemplate(null)}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

const TemplateCard = ({
  template,
  onClick,
}: {
  template: SpectTemplate;
  onClick: () => void;
}) => {
  return (
    <TemplateContainer
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ position: "relative" }}
    >
      <TemplateImage src={template.image} />
      <Box
        padding={{
          xs: "2",
          md: "4",
        }}
      >
        <Stack>
          <Text weight="bold" align="center">
            {template.name}
          </Text>
          <Text size="extraSmall" align="center">
            {template.description}
          </Text>
          {/* <a href={template.docs} target="_blank">
              <Text color="accent">View Docs</Text>
            </a> */}
        </Stack>
      </Box>
    </TemplateContainer>
  );
};

const TemplateContainer = styled(motion.div)`
  @media (max-width: 768px) {
    width: calc(100% / 2 - 0.5rem);
  }
  width: calc(100% / 3 - 1rem);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

const TemplateImage = styled.img`
  width: 100%;
  height: 14rem;
  object-fit: cover;
  border-radius: 1rem 1rem 0 0;

  @media (max-width: 768px) {
    height: 7rem;
  }
`;
