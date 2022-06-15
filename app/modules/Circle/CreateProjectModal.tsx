import { Box, Button, IconPlus, Input, Stack, Text, Textarea } from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import Card from "@/app/common/components/Card";
import Select from "@/app/common/components/Select";
import { useMutation, useQuery } from "react-query";

const templates = [
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Sprint Board",
    value: "sprint",
  },
  {
    label: "Roadmap",
    value: "roadmap",
  },
  {
    label: "Bug Tracking",
    value: "bugtracking",
  },
];

type CreateProjectDto = {
  name: string;
  circleId: string;
  template?: string;
};

function CreateProjectModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const { data: circle } = useQuery<Circle>("circle", { enabled: false });
  const { mutateAsync, isLoading } = useMutation(
    (project: CreateProjectDto) => {
      return fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
        credentials: "include",
      });
    }
  );

  const [template, setTemplate] = useState(templates[0]);
  const [name, setName] = useState("");
  const router = useRouter();

  const onSubmit = () => {
    mutateAsync({
      name,
      circleId: circle?.id as string,
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your space" />
      <Card
        height="32"
        dashed
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <Box width="32">
          <Stack align="center">
            <Text align="center">Create Project</Text>
          </Stack>
        </Box>
      </Card>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close} title="Create Project">
            <Box width="full" padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Text variant="extraLarge">Template</Text>
                <Select
                  options={templates}
                  value={template}
                  onChange={setTemplate}
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    width="1/2"
                    size="small"
                    variant="primary"
                    onClick={onSubmit}
                    loading={isLoading}
                  >
                    <Text>Create Project</Text>
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default CreateProjectModal;
