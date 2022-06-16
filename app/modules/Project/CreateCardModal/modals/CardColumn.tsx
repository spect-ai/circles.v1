import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { ProjectType } from "@/app/types";
import { Box, IconSearch, Input, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useDragEnd from "../../Hooks/useDragEnd";
import { useCreateCard } from "../hooks/createCardContext";
import { getOptions } from "../utils";

export default function CardColumn() {
  const { columnId, setColumnId } = useCreateCard();
  const router = useRouter();
  const { project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const { space } = useDragEnd();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <EditTag
      name={space?.columns[columnId]?.title}
      modalTitle="Select Card Type"
      tagLabel="Change"
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
          {getOptions("column", space).map((item: any) => (
            <ModalOption
              key={item.value}
              isSelected={columnId === item.value}
              item={item}
              onClick={() => {
                setColumnId(item.value);
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
                  color={columnId === item.value ? "accent" : "text"}
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
