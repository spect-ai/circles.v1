import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, IconSearch, IconUserSolid, Input, Text } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalCard } from "../hooks/LocalCardContext";
import { Option } from "../constants";
import { matchSorter } from "match-sorter";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

export default function CardReviewer() {
  const { reviewer, setReviewer } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions, getMemberDetails } = useModalOptions();

  useEffect(() => {
    const ops = getOptions("assignee") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
    if (currentUser && !reviewer) {
      setReviewer(currentUser.id);
    }
  }, []);
  return (
    <EditTag
      name={getMemberDetails(reviewer)?.username || "Unassigned"}
      modalTitle="Select Reviewer"
      label="Reviewer"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        reviewer ? (
          <Avatar src={getMemberDetails(reviewer)?.avatar} label="" size="5" />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
      disabled={!canTakeAction("cardReviewer")}
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
              isSelected={reviewer === item.value}
              item={item}
              onClick={() => {
                setReviewer(item.value);
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
                <Avatar
                  size="6"
                  src={item.avatar}
                  label="avatar"
                  placeholder={!item.avatar}
                />
                <Box marginRight="2" />
                <Text
                  size="small"
                  color={reviewer === item.value ? "accent" : "text"}
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