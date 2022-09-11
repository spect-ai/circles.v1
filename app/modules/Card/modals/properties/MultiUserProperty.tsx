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

  const [localProperty, setLocalProperty] = useState(
    properties[propertyId].value
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

  useEffect(() => {
    if (properties[propertyId].value) {
      setLocalProperty(properties[propertyId].value);
    } else if (properties[propertyId].default) {
      setLocalProperty(properties[propertyId].default);
    }
  }, [properties]);

  const getTagLabel = () => {
    if (!localProperty || !localProperty[0]) {
      return "Unassigned";
    }
    let name = "";
    name += getMemberDetails(localProperty[0])?.username;
    if (localProperty.length > 1) {
      // name += ` + ${localProperty.length - 1}`;
      return "";
    }
    return name;
  };

  return (
    <EditTag
      tourId={`create-card-modal-${propertyId}`}
      name={getTagLabel()}
      modalTitle={`Select ${cardProperty.name}`}
      label={`${cardProperty.name}`}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        localProperty?.length ? (
          <AvatarGroup
            members={localProperty && getMemberAvatars(localProperty)}
            hover
          />
        ) : (
          <IconUserSolid color="accent" size="5" />
        )
      }
      //disabled={!canTakeAction("cardReviewer")}
      handleClose={() => {
        if (card?.properties[propertyId].value !== localProperty) {
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
                  ? !localProperty?.length
                  : localProperty?.includes(item.value)
              }
              item={item}
              onClick={() => {
                if (item.value === "") {
                  updatePropertyState(propertyId, []);
                  return;
                }
                // set assignee if not selected already unselect if selected
                if (localProperty?.includes(item.value)) {
                  updatePropertyState(
                    propertyId,
                    localProperty.filter((i: any) => i !== item.value)
                  );
                } else {
                  if (localProperty?.length) {
                    updatePropertyState(propertyId, [
                      ...(localProperty || []),
                      item.value,
                    ]);
                  } else {
                    updatePropertyState(propertyId, [item.value]);
                  }
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
                    localProperty && localProperty.includes(item.value)
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
