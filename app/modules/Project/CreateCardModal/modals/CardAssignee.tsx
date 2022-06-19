import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { MemberDetails } from "@/app/types";
import { Avatar, Box, IconSearch, IconUserSolid, Input, Text } from "degen";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useLocalCard } from "../hooks/LocalCardContext";
import { getOptions } from "../utils";

export default function CardAssignee() {
  const { assignee, setAssignee, project } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: memberDetails } = useQuery<MemberDetails>("memberDetails", {
    enabled: false,
  });
  return (
    <EditTag
      name={
        (memberDetails && memberDetails[assignee]?.username) || "Unassigned"
      }
      modalTitle="Select Card Type"
      label="Assignee"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        assignee ? (
          <Avatar
            src={memberDetails && memberDetails[assignee].avatar}
            label=""
            size="5"
          />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
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
          {getOptions("assignee", project, memberDetails).map((item: any) => (
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
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Avatar size="6" src={item.avatar} label="avatar" />
                <Box marginRight="2" />
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
