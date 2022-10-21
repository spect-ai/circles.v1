import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { Box, IconSearch, IconUserGroup, Input, Text } from "degen";
import React, { memo, useEffect, useState } from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { Option } from "../../Project/CreateCardModal/constants";
import { matchSorter } from "match-sorter";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

function CardAssignedCircle() {
  const { setAssignedCircle, assignedCircle, card, onCardUpdate } =
    useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions } = useModalOptions();

  const getCircleName = (id: string) => {
    const circle = options?.find((option) => option.value === id);
    return circle?.name;
  };

  useEffect(() => {
    const ops = getOptions("circle") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <EditTag
      tourId="create-card-modal-project"
      name={getCircleName(assignedCircle) || "Unassigned"}
      modalTitle="Select Circle"
      label="Circle"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={<IconUserGroup color="accent" size="5" />}
      disabled={!canTakeAction("cardColumn")}
      handleClose={() => {
        if (card?.assignedCircle !== assignedCircle) {
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
              isSelected={assignedCircle === item.value}
              item={item}
              onClick={() => {
                setAssignedCircle(item.value);
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
                  color={assignedCircle === item.value ? "accent" : "text"}
                  weight="semiBold"
                >
                  {item.name}
                </Text>
              </Box>
            </ModalOption>
          ))}
          {!filteredOptions?.length && (
            <Box padding="8">
              <Text variant="label">No circles found</Text>
            </Box>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}

export default memo(CardAssignedCircle);
