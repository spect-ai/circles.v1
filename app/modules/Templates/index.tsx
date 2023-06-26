import { CollectionType, TemplateMinimal } from "@/app/types";
import { Box, Button, IconSearch, Input, Stack, Text } from "degen";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Template from "./Template";
import Logo from "@/app/common/components/Logo";
import { getAllTemplates } from "@/app/services/Templates";
import { matchSorter } from "match-sorter";
import {
  LocalProfileContext,
  useProviderLocalProfile,
} from "../Profile/ProfileSettings/LocalProfileContext";
import { updateCircle } from "@/app/services/UpdateCircle";

export default function Templates() {
  const profileContext = useProviderLocalProfile();
  const { fetchCircles } = useProviderLocalProfile();
  const [template, setTemplate] = useState<TemplateMinimal | null>(null);
  const [templates, setTemplates] = useState<TemplateMinimal[]>([]);
  const [templateGroups, setTemplateGroups] = useState<{
    [key: string]: string[];
  }>({});
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateMinimal[]>(
    []
  );
  const [sidebarItems, setSidebarItems] = useState<string[]>([]);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("");

  const onClick = (template: TemplateMinimal) => {
    setTemplate(template);
  };

  const updateFilteredTemplates = (
    sidebarItem?: string,
    filteredBy?: string
  ) => {
    if (sidebarItem) {
      const fiteredTemplateIds = templateGroups[sidebarItem];
      const filteredTemplates = templates.filter((item) =>
        fiteredTemplateIds.includes(item.id)
      );
      setFilteredTemplates(filteredTemplates);
    } else if (filteredBy) {
      const filteredTemplates = matchSorter(templates, filteredBy, {
        keys: ["name"],
      });
      setFilteredTemplates(filteredTemplates);
    }
  };

  useEffect(() => {
    void (async () => {
      const { templateData, templatesByGroup } =
        (await getAllTemplates()) as any;
      setTemplates(templateData);
      setTemplateGroups(templatesByGroup);
    })();
  }, []);

  useEffect(() => {
    const sidebarItems = Object.keys(templateGroups);
    setSidebarItems(sidebarItems);
    setSelectedSidebarItem(sidebarItems[0]);
    updateFilteredTemplates(sidebarItems[0]);
  }, [templateGroups]);

  useEffect(() => {
    void (async () => {
      await fetchCircles();
    })();
  }, []);

  return (
    <LocalProfileContext.Provider value={profileContext}>
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
            gap="4"
            alignItems="center"
          >
            <Logo
              href="/"
              src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
              gradient=""
            />
            <Text variant="extraLarge">Template Gallery</Text>
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
          gap="32"
          paddingTop="24"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="1/4"
          >
            {" "}
            <Stack direction="vertical" space="4">
              <Input
                placeholder="Search Templates"
                onChange={(e) => {
                  updateFilteredTemplates(undefined, e.target.value);
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
                    onClick={() => {
                      setSelectedSidebarItem(item);
                      updateFilteredTemplates(item);
                    }}
                  >
                    {" "}
                    <Text>{item}</Text>
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Box>
          <ScrollContainer width="3/4">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              width="3/4"
            >
              {!template && (
                <Stack direction="horizontal" space="4" wrap>
                  {filteredTemplates.map((item) => (
                    <TemplateCard
                      key={item.id}
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
          </ScrollContainer>
        </Box>
      </Box>
    </LocalProfileContext.Provider>
  );
}

const TemplateCard = ({
  template,
  onClick,
}: {
  template: TemplateMinimal;
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
            {template.shortDescription}
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

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 768px) {
    height: calc(100vh - 3rem);
  }
  height: calc(100vh - 12rem);
`;
