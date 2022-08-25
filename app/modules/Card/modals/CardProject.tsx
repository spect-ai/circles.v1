import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { ProjectOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import React, { memo, useEffect, useState } from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { Option } from "../../Project/CreateCardModal/constants";
import { matchSorter } from "match-sorter";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useCardService from "@/app/services/Card/useCardService";

function CardProject() {
  const { projectId, setProjectId, cardId, card } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions } = useModalOptions();

  const { updateCardProject } = useCardService();

  useEffect(() => {
    const ops = getOptions("project") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);
  return (
    <EditTag
      tourId="create-card-modal-project"
      name={card?.project.slug || ""}
      modalTitle="Select Project"
      label="Project"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <ProjectOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(191, 90, 242, 1)",
          }}
        />
      }
      disabled={!canTakeAction("cardColumn")}
      handleClose={() => {
        if (card?.project.id !== projectId) {
          void updateCardProject(cardId, projectId);
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
              isSelected={projectId === item.value}
              item={item}
              onClick={() => {
                setProjectId(item.value);
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
                  color={projectId === item.value ? "accent" : "text"}
                  weight="semiBold"
                >
                  {item.name}
                </Text>
              </Box>
            </ModalOption>
          ))}
          {!filteredOptions?.length && (
            <Text variant="label">No project found</Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}

export default memo(CardProject);
