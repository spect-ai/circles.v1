import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { Box, IconSearch, Input, Text } from "degen";
import React, { useState } from "react";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { useCreateCard } from "../hooks/createCardContext";
import { getOptions } from "../utils";

export default function CardAssignee() {
  const { assignee, setAssignee } = useCreateCard();
  const [modalOpen, setModalOpen] = useState(false);

  const { localProject: project } = useLocalProject();
  return (
    <EditTag
      name={assignee || "Add Assignee"}
      modalTitle="Select Card Type"
      tagLabel={assignee ? "Change" : ""}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <Box height="96">
        <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
          <Input
            hideLabel
            label=""
            placeholder="Search"
            prefix={<IconSearch />}
          />
        </Box>
        <Box>
          {getOptions("assignee", project).map((item: any) => (
            <ModalOption
              key={item.value}
              isSelected={assignee === item.value}
              item={item}
              onClick={() => {
                setAssignee(item.value);
                setModalOpen(false);
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text
                  size="small"
                  color={assignee === item.value ? "accent" : "text"}
                  weight="bold"
                >
                  {item.name}
                </Text>
              </Box>
            </ModalOption>
          ))}
        </Box>
      </Box>
    </EditTag>
  );
}
