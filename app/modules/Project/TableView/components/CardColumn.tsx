import useCardService from "@/app/services/Card/useCardService";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { MenuOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import React, { memo, useEffect, useState } from "react";
import { matchSorter } from "match-sorter";
import { Option } from "@/app/modules/Project/CreateCardModal/constants";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

export function CardColumn({ id }: { id: string }) {
  const { localProject: project } = useLocalProject();
  let prevcolumnId: string;

  project.columnOrder.map((col) => {
    const column = project.columnDetails?.[col]?.cards;
    if (column.includes(id)) prevcolumnId = col;
  });

  const [columnId, setColumnId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { updateProject } = useLocalProject();
  const { updateCard } = useCardService();

  const onCardUpdate = async () => {
    const res = await updateCard({ columnId: columnId }, id);
    console.log(res);
    if (res?.id) updateProject(res.project);
  };

  useEffect(() => {
    const ops = project?.columnOrder?.map((column: string) => ({
      name: project?.columnDetails[column].name,
      value: column,
    })) as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
    setColumnId(prevcolumnId);
  }, []);
  return (
    <EditTag
      tourId="create-card-modal-column"
      name={project?.columnDetails[columnId]?.name}
      modalTitle="Select Column"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <MenuOutlined
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
        if (columnId !== prevcolumnId) {
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
              isSelected={columnId === item.value}
              item={item}
              onClick={() => {
                setColumnId(item.value);
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
                  color={columnId === item.value ? "accent" : "text"}
                  weight="semiBold"
                >
                  {item.name}
                </Text>
              </Box>
            </ModalOption>
          ))}
          {!filteredOptions?.length && (
            <Text variant="label">No Column found</Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}
