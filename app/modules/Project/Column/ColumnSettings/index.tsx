import Modal from "@/app/common/components/Modal";
import { deleteColumn, updateColumnDetails } from "@/app/services/Column";
import { ColumnType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Button, IconCog, IconTrash, Input, Stack } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalProject } from "../../Context/LocalProjectContext";

interface Props {
  column: ColumnType;
}

export default function ColumnSettings({ column }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(column.name);
  const { localProject: project, setLocalProject } = useLocalProject();

  const onSave = async () => {
    const updatedProject = await updateColumnDetails(
      project.id,
      column.columnId,
      {
        name,
      }
    );
    console.log({ updatedProject });
    if (!updatedProject) {
      toast.error("Error updating column", { theme: "dark" });
    }
    setLocalProject(updatedProject);
  };

  const onDelete = async () => {
    const updatedProject = await deleteColumn(project.id, column.columnId);
    if (!updatedProject) {
      toast.error("Error updating column", { theme: "dark" });
      return;
    }
    setLocalProject(updatedProject);
  };
  return (
    <>
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <IconCog />
      </Button>
      {isOpen && (
        <Modal handleClose={() => setIsOpen(false)} title="Column Settings">
          <Box padding="8">
            <Stack>
              <Input
                label=""
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Stack direction="horizontal">
                <Button
                  width="1/2"
                  size="small"
                  variant="secondary"
                  onClick={onSave}
                  center
                  prefix={<SaveOutlined style={{ fontSize: "1.3rem" }} />}
                >
                  Save
                </Button>
                <Button
                  width="1/2"
                  size="small"
                  variant="secondary"
                  onClick={onDelete}
                  center
                  tone="red"
                  prefix={<IconTrash />}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      )}
    </>
  );
}
