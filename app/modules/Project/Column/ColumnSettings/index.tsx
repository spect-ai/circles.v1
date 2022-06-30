import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { deleteColumn, updateColumnDetails } from "@/app/services/Column";
import { ColumnType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Button, IconCog, IconTrash, Input, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalProject } from "../../Context/LocalProjectContext";

interface Props {
  column: ColumnType;
  handleClose: () => void;
}

export default function ColumnSettings({ column, handleClose }: Props) {
  const [name, setName] = useState(column.name);
  const { localProject: project, setLocalProject } = useLocalProject();
  const [showConfirm, setShowConfirm] = useState(false);

  const onSave = async () => {
    console.log({ column });
    const updatedProject = await updateColumnDetails(
      project.id,
      column.columnId,
      {
        name,
      }
    );
    if (!updatedProject) {
      toast.error("Error updating column", { theme: "dark" });
      return;
    }
    console.log("GOTCHA");
    setLocalProject(updatedProject);
  };

  const onDelete = async () => {
    const updatedProject = await deleteColumn(project.id, column.columnId);
    if (!updatedProject) {
      toast.error("Error updating column", { theme: "dark" });
      return;
    }
    console.log("GOTCHA");
    setLocalProject(updatedProject);
  };
  return (
    <Modal handleClose={handleClose} title="Column Settings">
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to delete this column? This action also deletes all tasks in this column."
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              void onDelete();
              setShowConfirm(false);
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
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
              onClick={() => setShowConfirm(true)}
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
  );
}
