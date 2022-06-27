import { Box, Button, IconPlusSmall, Input, Stack, Text } from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Card from "@/app/common/components/Card";
import Select, { option } from "@/app/common/components/Select";
import { useMutation, useQuery } from "react-query";
import { CircleType, Template } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Tooltip } from "react-tippy";
import { QuestionCircleFilled } from "@ant-design/icons";

type CreateProjectDto = {
  name: string;
  circleId: string;
  fromTemplateId: string;
  description: string;
};

interface Props {
  accordian: boolean;
}

function CreateProjectModal({ accordian }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, refetch } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: templates } = useQuery<option[]>(
    ["projectTemplates", cId],
    () =>
      fetch(
        `${process.env.API_HOST}/template/allProjectTemplates/${circle?.id}`
      ).then(async (res) => {
        const data = await res.json();
        const filteredData = data.map((t: Template) => {
          const rt: option = {
            label: t.name,
            value: t._id,
          };
          return rt;
        });
        return filteredData;
      }),
    {
      onSuccess: (res: option[]) => {
        setTemplate(res[0]);
      },
      enabled: !!circle?.id,
    }
  );
  const { mutateAsync, isLoading } = useMutation(
    (project: CreateProjectDto) => {
      return fetch(`${process.env.API_HOST}/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
        credentials: "include",
      });
    }
  );

  const [template, setTemplate] = useState({} as option);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = () => {
    console.log({ circle });
    mutateAsync({
      name,
      circleId: circle?.id as string,
      description,
      fromTemplateId: template.value,
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
        void refetch();
        void router.push(`/${cId}/${resJson.slug}`);
        void close();
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your space" />
      {accordian ? (
        <Button
          data-tour="circle-sidebar-create-project-button"
          size="small"
          variant="transparent"
          shape="circle"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
        >
          <IconPlusSmall />
        </Button>
      ) : (
        <Card
          height="32"
          dashed
          tourId="circle-create-project-card"
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
      )}
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
                <Input
                  label=""
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Stack direction="horizontal" space="1" align="center">
                  <Text variant="extraLarge" weight="semiBold">
                    Template
                  </Text>

                  <Button shape="circle" size="small" variant="transparent">
                    <Tooltip
                      html={
                        <Text>
                          Pre built board with columns and automations set
                        </Text>
                      }
                    >
                      <QuestionCircleFilled style={{ fontSize: "1rem" }} />
                    </Tooltip>
                  </Button>
                </Stack>
                {templates && (
                  <Select
                    options={templates}
                    value={template}
                    onChange={setTemplate}
                  />
                )}
                <Box width="full" marginTop="4">
                  <PrimaryButton onClick={onSubmit} loading={isLoading}>
                    Create Project
                  </PrimaryButton>
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
