import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { ProjectType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Button, IconCog, IconTrash, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";

export default function ProjectSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (project?.id) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  const onSubmit = () => {
    setIsLoading(true);
    fetch(`${process.env.API_HOST}/project/${project?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.id) {
          toast("Project updated successfully", { theme: "dark" });
        }
        queryClient.setQueryData(["project", pId], data);
        console.log({ data });
        setIsLoading(false);
        handleClose();
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
      });
  };

  const onDelete = () => {
    setIsLoading(true);
    fetch(`${process.env.API_HOST}/project/${project?.id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.id) {
          toast("Project deleted successfully", { theme: "dark" });
        }
        queryClient.setQueryData(["project", pId], null);
        console.log({ data });
        setIsLoading(false);
        handleClose();
        void router.push(`/${cId}`);
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
      });
  };

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to delete the project, this cannot be undone?"
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              onDelete();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
      <Button
        data-tour="header-project-settings-button"
        size="small"
        variant="transparent"
        shape="circle"
        onClick={(e) => {
          setIsOpen(true);
        }}
      >
        <Tooltip html={<Text>Project Settings</Text>}>
          <IconCog />
        </Tooltip>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Project Settings" handleClose={handleClose}>
            <Box width="full" padding="8">
              <Stack>
                <Input
                  label="Name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Stack direction="horizontal">
                  <Button
                    width="1/2"
                    size="small"
                    variant="secondary"
                    onClick={onSubmit}
                    loading={isLoading}
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
                    loading={isLoading}
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
      </AnimatePresence>
    </>
  );
}
