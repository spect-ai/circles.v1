import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import Logo from "@/app/common/components/Logo";
import styled from "styled-components";
import { getAllCredentials } from "@/app/services/Credentials/AggregatedCredentials";
import { Option, Stamp } from "@/app/types";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Image from "next/image";
import {
  experienceLevel,
  opportunityType,
  skills,
  tags,
} from "@/app/common/utils/constants";

export default function OpportunityMode() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState([] as string[]);
  const [selectedTags, setSelectedTags] = useState([] as string[]);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([] as string[]);

  useEffect(() => {
    const tagOptions = [];
    for (const skill of selectedSkills) {
      tagOptions.push(...tags[skill as keyof typeof tags]);
    }
    setTagOptions(tagOptions);
  }, [selectedSkills]);

  useEffect(() => {
    setSelectedExperienceLevel(collection.opportunityInfo?.experience || "");
    setSelectedOpportunityType(collection.opportunityInfo?.type || "");
    setSelectedSkills(collection.opportunityInfo?.skills || []);
    setSelectedTags(collection.opportunityInfo?.tags || []);
  }, [collection.opportunityInfo]);

  return (
    <>
      <Stack direction="vertical">
        {collection.isAnOpportunity && (
          <Text variant="small">{`Opportunity mode is on`}</Text>
        )}
        {!collection.isAnOpportunity && (
          <Text variant="small">{`Turn on Opportunity Mode to reach 10,000+ opportunity seekers`}</Text>
        )}
      </Stack>
      <Box
        width={{
          xs: "full",
          md: "1/2",
        }}
      >
        <PrimaryButton
          variant={collection.isAnOpportunity ? "tertiary" : "secondary"}
          onClick={() => setIsOpen(true)}
        >
          {collection.isAnOpportunity
            ? `Update Opportunity Mode`
            : `Enable Opportunity Mode`}
        </PrimaryButton>
      </Box>

      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Opportunity Mode"
            handleClose={() => setIsOpen(false)}
            height="30rem"
          >
            <Box padding="8" width="full">
              <ScrollContainer>
                <Box width="full" marginBottom="4">
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="4"
                  >
                    <Text variant="label">{`Opportunity Type`} </Text>
                  </Box>
                  <Stack direction="horizontal" wrap>
                    {opportunityType.map((type) => (
                      <Box
                        key={type}
                        onClick={() => {
                          if (selectedOpportunityType === type) {
                            setSelectedOpportunityType("");
                          } else {
                            setSelectedOpportunityType(type);
                          }
                        }}
                        cursor="pointer"
                      >
                        <Tag
                          key={type}
                          tone={
                            selectedOpportunityType === type
                              ? "accent"
                              : "secondary"
                          }
                        >
                          {type}
                        </Tag>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Box width="full" marginBottom="4">
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="4"
                  >
                    <Text variant="label">{`Experience Level`} </Text>
                  </Box>
                  <Stack direction="horizontal" wrap>
                    {experienceLevel.map((level) => (
                      <Box
                        key={level}
                        onClick={() => {
                          if (selectedExperienceLevel === level) {
                            setSelectedExperienceLevel("");
                          } else {
                            setSelectedExperienceLevel(level);
                          }
                        }}
                        cursor="pointer"
                      >
                        <Tag
                          key={level}
                          tone={
                            selectedExperienceLevel === level
                              ? "accent"
                              : "secondary"
                          }
                        >
                          {level}
                        </Tag>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Box width="full" marginBottom="4">
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="4"
                  >
                    <Text variant="label">{`Pick Skills`} </Text>
                  </Box>
                  <Stack direction="horizontal" wrap>
                    {skills.map((skill) => (
                      <Box
                        key={skill}
                        onClick={() => {
                          if (selectedSkills.includes(skill)) {
                            setSelectedSkills(
                              selectedSkills.filter((s) => s !== skill)
                            );
                          } else {
                            setSelectedSkills([...selectedSkills, skill]);
                          }
                        }}
                        cursor="pointer"
                      >
                        <Tag
                          tone={
                            selectedSkills.includes(skill)
                              ? "accent"
                              : "secondary"
                          }
                          key={skill}
                          hover
                        >
                          <Box paddingX="2">{skill}</Box>
                        </Tag>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box width="full" marginBottom="4">
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="4"
                  >
                    <Text variant="label">{`Add Tags`} </Text>
                  </Box>
                  <Stack direction="horizontal" wrap>
                    {tagOptions.map((tag) => (
                      <Box
                        key={tag}
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(
                              selectedTags.filter((s) => s !== tag)
                            );
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        cursor="pointer"
                      >
                        <Tag
                          key={tag}
                          tone={
                            selectedTags.includes(tag) ? "accent" : "secondary"
                          }
                        >
                          {tag}
                        </Tag>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </ScrollContainer>

              <Box width="full" paddingTop="8">
                <Box
                  display="flex"
                  flexDirection={{
                    xs: "column",
                    md: "row",
                  }}
                  width="full"
                  gap="4"
                  justifyContent="flex-end"
                >
                  {collection.isAnOpportunity && (
                    <Box width="full">
                      <PrimaryButton
                        loading={loading}
                        variant="tertiary"
                        onClick={async () => {
                          setLoading(true);
                          const res = await (
                            await fetch(
                              `${process.env.API_HOST}/collection/v1/${collection.id}`,
                              {
                                method: "PATCH",
                                body: JSON.stringify({
                                  isAnOpportunity: false,
                                  opportunityInfo: {
                                    type: "",
                                    experience: "",
                                    skills: [],
                                    tags: [],
                                  },
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }
                            )
                          ).json();
                          updateCollection(res);
                          setIsOpen(false);
                          setLoading(false);
                        }}
                      >
                        Disable Opportunity Mode
                      </PrimaryButton>
                    </Box>
                  )}
                  <Box width="full">
                    <PrimaryButton
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);

                        const res = await (
                          await fetch(
                            `${process.env.API_HOST}/collection/v1/${collection.id}`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({
                                isAnOpportunity: true,
                                opportunityInfo: {
                                  type: selectedOpportunityType,
                                  experience: selectedExperienceLevel,
                                  skills: selectedSkills,
                                  tags: selectedTags,
                                },
                              }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }
                          )
                        ).json();
                        updateCollection(res);
                        setIsOpen(false);
                        setLoading(false);
                      }}
                    >
                      Save
                    </PrimaryButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  height: calc(100vh - 25rem);
  ::-webkit-scrollbar {
    width: 5px;
  }
`;
