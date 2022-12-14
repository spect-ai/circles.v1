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
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { Option } from "../../Project/CreateCardModal/constants";
import { matchSorter } from "match-sorter";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { MemberDetails } from "@/app/types";

function CardReviewer() {
  const {
    reviewers,
    setReviewers,
    onCardUpdate,
    card,
    fetchCardActions,
    cardId,
  } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
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
    if (!reviewers[0]) {
      return "Unassigned";
    }
    let name = "";
    name += getMemberDetails(reviewers[0])?.username;
    if (reviewers.length > 1) {
      // name += ` + ${reviewers.length - 1}`;
      return "";
    }
    return name;
  };
  return (
    <EditTag
      tourId="create-card-modal-reviewer"
      name={getTagLabel()}
      modalTitle="Select Reviewer"
      label="Reviewer"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        reviewers.length ? (
          <AvatarGroup members={getMemberAvatars(reviewers)} hover />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
      disabled={!canTakeAction("cardReviewer")}
      handleClose={() => {
        if (card?.reviewer !== reviewers) {
          cardId && void fetchCardActions();
          void onCardUpdate();
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
                {console.log({item})}
                <Avatar
                  size="6"
                  src={item.avatar}
                  label="avatar"
                  placeholder={!item.avatar}
                  // address={item.ethAddress}
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
