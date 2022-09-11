import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Option } from "@/app/types";
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
  const { onCardUpdate, card, properties, project, updatePropertyState } =
    useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();
  const [template, setTemplate] = useState(templateId || "Task");
  const [propertyInProjectTemplate, setPropertyInProjectTemplate] = useState(
    project?.cardTemplates[templateId || "Task"].properties[propertyId]
  );
  const [localProperty, setLocalProperty] = useState(
    properties[propertyId].value
  );

  const cardProperty = properties[propertyId];

  const { canTakeAction } = useRoleGate();

  useEffect(() => {
    const ops = cardProperty.options as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  useEffect(() => {
    if (properties[propertyId].value) {
      setLocalProperty(properties[propertyId].value);
    } else if (properties[propertyId].default) {
      setLocalProperty(properties[propertyId].default);
    }
  }, [properties]);

  return (
    <EditTag
      tourId="create-card-modal-priority"
      name={localProperty?.label}
      modalTitle={`Select ${propertyInProjectTemplate?.name}`}
      label={`${propertyInProjectTemplate?.name}`}
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
      //disabled={!canTakeAction("cardPriority")}
      handleClose={() => {
        if (
          card?.properties[propertyId]?.value?.value !== localProperty?.value
        ) {
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
              isSelected={localProperty?.value === item.value}
              item={item}
              onClick={() => {
                updatePropertyState("priority", item);
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
              No ${propertyInProjectTemplate?.name} found
            </Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}

export default memo(CardPriority);
