import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  experienceLevel,
  opportunityType,
  skills,
  tags,
} from "@/app/common/utils/constants";
import { Box, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../Context/LocalCollectionContext";

const OpportunityMode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [, setTagOptions] = useState([] as string[]);
  const [selectedTags, setSelectedTags] = useState([] as string[]);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([] as string[]);

  useEffect(() => {
    const tagOptions2: string[] = [];
    selectedSkills.forEach((skill) => {
      tagOptions2.push(...tags[skill as keyof typeof tags]);
    });
    setTagOptions(tagOptions2);
  }, [selectedSkills]);

  useEffect(() => {
    if (collection.formMetadata) {
      setSelectedExperienceLevel(
        collection.formMetadata.opportunityInfo?.experience || ""
      );
      setSelectedOpportunityType(
        collection.formMetadata.opportunityInfo?.type || ""
      );
      setSelectedSkills(collection.formMetadata.opportunityInfo?.skills || []);
      setSelectedTags(collection.formMetadata.opportunityInfo?.tags || []);
    }
  }, [collection.formMetadata, collection.formMetadata?.opportunityInfo]);

  return (
    <>
      {/* <Stack direction="vertical">
        {!collection.formMetadata?.isAnOpportunity && (
          <Text variant="small">{`Reach 1000+ opportunity seekers`}</Text>
        )}
      </Stack> */}
      {/* <Box
        width={{
          xs: "full",
          md: "full",
        }}
      >
        <PrimaryButton
          center
          variant={
            collection.formMetadata?.isAnOpportunity ? "tertiary" : "secondary"
          }
          onClick={() => setIsOpen(true)}
          icon={<IconTrendingUp />}
        >
          {collection.formMetadata?.isAnOpportunity
            ? `Boosting Form`
            : `Boost Form`}
        </PrimaryButton>
      </Box> */}

      <AnimatePresence>
        {isOpen && (
          <Modal title="Boost Mode" handleClose={() => setIsOpen(false)}>
            <Box
              paddingLeft={{
                xs: "4",
                md: "8",
              }}
              paddingRight={{
                xs: "4",
                md: "8",
              }}
              width="full"
            >
              <Text variant="small">
                Boosting form helps you get opportunities in front of
                opportunity seekers! Fill up the following fields to get it in
                front of the right people.{" "}
              </Text>
            </Box>
            <Box
              padding={{
                xs: "4",
                md: "8",
              }}
              width="full"
            >
              <Box width="full" marginBottom="4">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  marginBottom="4"
                >
                  <Text variant="label">What is the opportunity?</Text>
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
                  <Text variant="label">Any specific skills?</Text>
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
                  <Text variant="label">
                    What level of experience are you looking for?
                  </Text>
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

              {/* <Box width="full" marginBottom="4">
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
                </Box> */}

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
                  {collection.formMetadata.isAnOpportunity && (
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
};

export default OpportunityMode;
