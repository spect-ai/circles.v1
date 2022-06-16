import EditTag from "@/app/common/components/EditTag";
import { ProjectType } from "@/app/types";
import { Box, IconCheck, IconSearch, Input, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useCreateCard } from "../hooks/createCardContext";
import { getOptions } from "../utils";

export default function CardLabels() {
  const { labels, setLabels } = useCreateCard();
  const router = useRouter();
  const { project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <EditTag
      name={"Add Label"}
      modalTitle="Select Card Type"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <Box>
        <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
          <Input
            hideLabel
            label=""
            placeholder="Search"
            prefix={<IconSearch />}
          />
        </Box>
        <Box padding="8">
          <Stack direction="horizontal" wrap>
            {getOptions("labels", {} as ProjectType).map((item: any) => (
              <motion.button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0rem",
                }}
                key={item.value}
                onClick={() => {
                  if (labels.includes(item.value)) {
                    setLabels(labels.filter((label) => label !== item.value));
                  } else {
                    setLabels([...labels, item.value]);
                  }
                }}
              >
                <Tag
                  hover
                  tone={labels.includes(item.value) ? "accent" : "secondary"}
                >
                  <Box display="flex">
                    {labels.includes(item.value) && <IconCheck />}
                    {item.name}
                  </Box>
                </Tag>
              </motion.button>
            ))}
          </Stack>
        </Box>
      </Box>
    </EditTag>
  );
}
