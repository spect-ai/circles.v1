import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { Avatar, Box, IconSearch, IconUserSolid, Input, Text } from "degen";
import React, { memo, useEffect, useState } from "react";
import { useLocalCard } from "../hooks/LocalCardContext";
import { Option } from "../constants";
import { matchSorter } from "match-sorter";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

function CardReviewer() {
  const { reviewers, setReviewers, onCardUpdate, card, fetchCardActions } =
    useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions, getMemberDetails } = useModalOptions();

  useEffect(() => {
    const ops = getOptions("assignee") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  const getTagLabel = () => {
    if (!reviewers[0]) {
      return null;
    }
    let name = "";
    name += getMemberDetails(reviewers[0])?.username;
    if (reviewers.length > 1) {
      name += ` + ${reviewers.length - 1}`;
    }
    return name;
  };
  return (
    <EditTag
      tourId="create-card-modal-reviewer"
      name={getTagLabel() || "Unassigned"}
      modalTitle="Select Reviewer"
      label="Reviewer"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        reviewers.length ? (
          <Avatar
            src={getMemberDetails(reviewers[0])?.avatar}
            label=""
            size="5"
          />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
      disabled={!canTakeAction("cardReviewer")}
      handleClose={async () => {
        if (card?.reviewer !== reviewers) {
          void fetchCardActions();
          await onCardUpdate();
        }
        setModalOpen(false);
      }}
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
              isSelected={
                item.value === ""
                  ? !reviewers.length
                  : reviewers.includes(item.value)
              }
              item={item}
              onClick={() => {
                if (item.value === "") {
                  setReviewers([]);
                  return;
                }
                // set assignee if not selected already unselect if selected
                if (reviewers.includes(item.value)) {
                  setReviewers(reviewers.filter((i) => i !== item.value));
                } else {
                  if (reviewers.length) {
                    setReviewers([...reviewers, item.value]);
                  } else {
                    setReviewers([item.value]);
                  }
                  console.log({ reviewers });
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
                />
                <Box marginRight="2" />
                <Text
                  size="small"
                  color={reviewers.includes(item.value) ? "accent" : "text"}
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
    </EditTag>
  );
}

export default memo(CardReviewer);
