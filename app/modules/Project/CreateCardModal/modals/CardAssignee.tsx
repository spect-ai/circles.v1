import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { MemberDetails } from "@/app/types";
import { Avatar, Box, IconSearch, IconUserSolid, Input, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalCard } from "../hooks/LocalCardContext";
import { getOptions, Option } from "../utils";
import { matchSorter } from "match-sorter";

export default function CardAssignee() {
  const { assignee, setAssignee, project } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  useEffect(() => {
    const ops = getOptions("assignee", project, memberDetails) as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);
  return (
    <EditTag
      name={
        (memberDetails && memberDetails.memberDetails[assignee]?.username) ||
        "Unassigned"
      }
      modalTitle="Select Card Type"
      label="Assignee"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        assignee ? (
          <Avatar
            src={memberDetails && memberDetails.memberDetails[assignee]?.avatar}
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
            onChange={(e) => {
              setFilteredOptions(
                matchSorter(options as Option[], e.target.value, {
                  keys: ["name"],
                })
              );
            }}
          />
        </Box>
        <Box>
          {filteredOptions?.map((item: any) => (
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
          {!filteredOptions?.length && (
            <Text variant="label">No Contributors found</Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}
