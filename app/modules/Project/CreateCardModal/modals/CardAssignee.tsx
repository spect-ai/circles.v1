import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconSearch,
  IconUserSolid,
  Input,
  Text,
} from "degen";
import React, { memo, useEffect, useState } from "react";
import { useLocalCard } from "../hooks/LocalCardContext";
import { Option } from "../constants";
import { matchSorter } from "match-sorter";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { useQuery } from "react-query";
import { MemberDetails } from "@/app/types";
import { useRouter } from "next/router";

type Props = {
  filteredOptions: Option[] | undefined;
  setFilteredOptions: (options: Option[]) => void;
  assignees: string[];
  setAssignees: (assignees: string[]) => void;
  options: Option[];
};

export const AssigneeModal = ({
  setAssignees,
  assignees,
  setFilteredOptions,
  filteredOptions,
  options,
}: Props) => (
  <Box height="96">
    <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
      <Input
        hideLabel
        label=""
        placeholder="Search"
        prefix={<IconSearch />}
        onChange={(e) => {
          setFilteredOptions(
            matchSorter(options, e.target.value, {
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
          isSelected={
            item.value === ""
              ? !assignees.length
              : assignees.includes(item.value)
          }
          item={item}
          onClick={() => {
            if (item.value === "") {
              setAssignees([]);
              return;
            }
            // set assignee if not selected already unselect if selected
            if (assignees.includes(item.value)) {
              setAssignees(assignees.filter((i) => i !== item.value));
            } else {
              if (assignees.length) {
                setAssignees([...assignees, item.value]);
              } else {
                setAssignees([item.value]);
              }
              console.log({ assignees });
            }
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
              address={item.ethAddress}
            />
            <Box marginRight="2" />
            <Text
              size="small"
              color={assignees.includes(item.value) ? "accent" : "text"}
              weight="semiBold"
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
);

function CardAssignee() {
  const {
    assignees,
    setAssignees,
    onCardUpdate,
    fetchCardActions,
    card,
    cardId,
  } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>({} as Option[]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();
  const { canTakeAction } = useRoleGate();
  const { getOptions, getMemberDetails, getMemberAvatars } = useModalOptions();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (memberDetails) {
      const ops = getOptions("assignee") as Option[];
      setOptions(ops);
      setFilteredOptions(ops);
    }
  }, [memberDetails]);

  const getTagLabel = () => {
    if (!assignees[0]) {
      return "Unassigned";
    }
    let name = "";
    name += getMemberDetails(assignees[0])?.username;
    if (assignees.length > 1) {
      // name += ` + ${assignees.length - 1}`;
      return "";
    }
    return name;
  };

  return (
    <EditTag
      tourId="create-card-modal-assignee"
      name={getTagLabel()}
      modalTitle="Choose Assignee"
      label="Assignee"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        assignees[0] ? (
          <AvatarGroup members={getMemberAvatars(assignees)} hover />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
      disabled={!canTakeAction("cardAssignee")}
      handleClose={() => {
        if (card?.assignee !== assignees) {
          void onCardUpdate();
          cardId && void fetchCardActions();
        }
        setModalOpen(false);
      }}
    >
      <AssigneeModal
        setAssignees={setAssignees}
        assignees={assignees}
        filteredOptions={filteredOptions}
        setFilteredOptions={setFilteredOptions}
        options={options}
      />
    </EditTag>
  );
}

export default memo(CardAssignee);
