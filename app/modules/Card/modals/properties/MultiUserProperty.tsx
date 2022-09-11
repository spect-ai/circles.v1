import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { MemberDetails } from "@/app/types";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconSearch,
  IconUserSolid,
  Input,
  Text,
} from "degen";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Option } from "../../../Project/CreateCardModal/constants";
import { useLocalCard } from "../../../Project/CreateCardModal/hooks/LocalCardContext";

export type props = {
  templateId: string;
  propertyId: string;
};

function MultiUserProperty({ templateId, propertyId }: props) {
  const {
    reviewers,
    onCardUpdate,
    card,
    fetchCardActions,
    cardId,
    updatePropertyState,
    properties,
    project,
  } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();
  const { canTakeAction } = useRoleGate();
  const { getOptions, getMemberDetails, getMemberAvatars } = useModalOptions();
  const [template, setTemplate] = useState(templateId || "Task");
  const [propertyInProjectTemplate, setPropertyInProjectTemplate] = useState(
    project?.cardTemplates[templateId || "Task"].properties[propertyId]
  );
  const cardProperty = properties[propertyId];

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
    if (!cardProperty?.value || !cardProperty?.value[0]) {
      return "Unassigned";
    }
    let name = "";
    name += getMemberDetails(cardProperty?.value[0])?.username;
    if (cardProperty?.value.length > 1) {
      // name += ` + ${cardProperty?.value.length - 1}`;
      return "";
    }
    return name;
  };

  if (!propertyInProjectTemplate) return <></>;
  return (
    <EditTag
      tourId={`create-card-modal-${propertyId}`}
      name={getTagLabel()}
      modalTitle={`Select ${propertyInProjectTemplate.name}`}
      label={`${propertyInProjectTemplate.name}`}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        cardProperty?.value?.length ? (
          <AvatarGroup
            members={
              cardProperty?.value && getMemberAvatars(cardProperty?.value)
            }
            hover
          />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
      disabled={!canTakeAction("cardReviewer")}
      handleClose={() => {
        if (
          card?.properties[propertyId].value !== propertyInProjectTemplate.value
        ) {
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
                  ? !cardProperty?.value?.length
                  : cardProperty?.value?.includes(item.value)
              }
              item={item}
              onClick={() => {
                if (item.value === "") {
                  updatePropertyState(propertyId, []);
                  return;
                }
                // set assignee if not selected already unselect if selected
                if (cardProperty?.value?.includes(item.value)) {
                  updatePropertyState(
                    propertyId,
                    cardProperty?.value.filter((i: any) => i !== item.value)
                  );
                } else {
                  if (cardProperty?.value?.length) {
                    updatePropertyState(propertyId, [
                      ...(cardProperty?.value || []),
                      item.value,
                    ]);
                  } else {
                    updatePropertyState(propertyId, [item.value]);
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
                  address={item.ethAddress}
                />
                <Box marginRight="2" />
                <Text
                  size="small"
                  color={
                    cardProperty?.value &&
                    cardProperty?.value.includes(item.value)
                      ? "accent"
                      : "text"
                  }
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

export default memo(MultiUserProperty);
