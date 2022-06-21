import Modal from "@/app/common/components/Modal";
import { ProjectType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Button, IconCog, IconTrash, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function ProjectSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const router = useRouter();
  const { project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project?.id) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  const onSubmit = () => {
    setIsLoading(true);
    fetch(`http://localhost:3000/project/${project?.id}`, {
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
  return (
    <>
      <Button
        size="small"
        variant="transparent"
        shape="circle"
        onClick={(e) => {
          setIsOpen(true);
        }}
      >
        <IconCog />
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
                    onClick={onSubmit}
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
