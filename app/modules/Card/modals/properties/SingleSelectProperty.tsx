import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Option, ProjectType } from "@/app/types";
import { DashboardOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import { matchSorter } from "match-sorter";
import { memo, useEffect, useState } from "react";
import { useLocalCard } from "../../../Project/CreateCardModal/hooks/LocalCardContext";

export type props = {
  templateId: string;
  propertyId: string;
};

function CardPriority({ templateId, propertyId }: props) {
  const {
    onCardUpdate,
    card,
    properties: cardProperties,
    project,
    updatePropertyState,
  } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const [localProperty, setLocalProperty] = useState(
    cardProperties && cardProperties[propertyId]
  );

  const { canTakeAction } = useRoleGate();

  useEffect(() => {
    const ops = project?.properties[propertyId].options as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  useEffect(() => {
    if (cardProperties && cardProperties[propertyId]) {
      setLocalProperty(cardProperties && cardProperties[propertyId]);
    } else if (project?.properties[propertyId].default) {
      setLocalProperty(project?.properties[propertyId].default);
    }
  }, [cardProperties]);

  return (
    <EditTag
      tourId="create-card-modal-priority"
      name={localProperty?.label}
      modalTitle={`Select ${project?.properties[propertyId]?.name}`}
      label={`${project?.properties[propertyId]?.name}`}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <DashboardOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(191, 90, 242, 1)",
          }}
        />
      }
      disabled={!canTakeAction("cardPriority")}
      handleClose={() => {
        void onCardUpdate();

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
              isSelected={localProperty?.value === item.value}
              item={item}
              onClick={() => {
                updatePropertyState(propertyId, item);
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
                  color={
                    localProperty?.value === item.value ? "accent" : "text"
                  }
                  weight="semiBold"
                >
                  {item.label}
                </Text>
              </Box>
            </ModalOption>
          ))}
          {!filteredOptions?.length && (
            <Text variant="label">
              No ${project?.properties[propertyId]?.name} found
            </Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}

export default memo(CardPriority);
