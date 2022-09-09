import {
  Box,
  Button,
  IconGrid,
  IconList,
  IconPlusSmall,
  IconSplit,
  Input,
  Stack,
  Text,
  useTheme,
} from "degen";
import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Select, { option } from "@/app/common/components/Select";
import { useQuery } from "react-query";
import { Template } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Tooltip } from "react-tippy";
import { QuestionCircleFilled } from "@ant-design/icons";
import { createProject } from "@/app/services/Project";
import { useCircle } from "./CircleContext";
import Popover from "@/app/common/components/Popover";
import { PopoverOption } from "../Explore";
import styled from "styled-components";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 14rem;
  overflow-y: auto;
`;

function CreateProjectModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projectType, setProjectType] = useState(
    "Board" as "Board" | "List" | "Gantt"
  );
  const close = () => setModalOpen(false);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { circle, fetchCircle } = useCircle();
  const { data: templates, refetch: fetchTemplate } = useQuery<option[]>(
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
        //setTemplate(res[0]);
      },
      enabled: false,
    }
  );
  const [template, setTemplate] = useState({} as option);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mode } = useTheme();

  const onSubmit = async () => {
    console.log({ circle });
    setIsLoading(true);
    const data = await createProject({
      name,
      circleId: circle?.id as string,
      description,
      fromTemplateId: template.value,
      type: projectType,
    });
    setIsLoading(false);
    if (data) {
      void router.push(`/${cId}/${data.slug}`);
      void close();
      fetchCircle();
    }
  };

  useEffect(() => {
    void fetchTemplate();
  }, []);

  return (
    <>
      <Loader loading={isLoading} text="Creating your project" />
      <Popover
        butttonComponent={
          <Button
            data-tour="circle-create-project-button"
            size="small"
            variant="transparent"
            shape="circle"
            onClick={(e) => {
              e.stopPropagation();
              setPopoverOpen(true);
            }}
          >
            <IconPlusSmall />
          </Button>
        }
        isOpen={popoverOpen}
        setIsOpen={setPopoverOpen}
        width="2"
      >
        {" "}
        <ScrollContainer
          backgroundColor="background"
          borderWidth="0.5"
          borderRadius="2xLarge"
        >
          <PopoverOption
            onClick={() => {
              setProjectType("Board");
              setPopoverOpen(false);
              setModalOpen(true);
            }}
          >
            <Stack direction="horizontal" space="2">
              <Box display="flex" flexDirection="row" alignItems="center">
                <IconGrid size="4" />
                <Box marginLeft="2">{"Board"}</Box>
              </Box>
            </Stack>
          </PopoverOption>
          <PopoverOption
            onClick={() => {
              setProjectType("List");
              setPopoverOpen(false);
              setModalOpen(true);
            }}
          >
            <Stack direction="horizontal" space="2">
              <Box display="flex" flexDirection="row" alignItems="center">
                <IconList size="4" />
                <Box marginLeft="2">{"List"}</Box>
              </Box>
            </Stack>
          </PopoverOption>
          <PopoverOption
            onClick={() => {
              setProjectType("Gantt");
              setPopoverOpen(false);
              setModalOpen(true);
            }}
          >
            <Stack direction="horizontal" space="2">
              <Box display="flex" flexDirection="row" alignItems="center">
                <IconSplit size="4" />
                <Box marginLeft="2">{"Gantt"}</Box>
              </Box>
            </Stack>
          </PopoverOption>
        </ScrollContainer>
      </Popover>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close} title={`Create ${projectType}`}>
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
                {templates && ["Board", "List"].includes(projectType) && (
                  <>
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
                          theme={mode}
                        >
                          <QuestionCircleFilled style={{ fontSize: "1rem" }} />
                        </Tooltip>
                      </Button>
                    </Stack>

                    <Select
                      options={templates}
                      value={template}
                      onChange={setTemplate}
                    />
                  </>
                )}
                <Box width="full" marginTop="4">
                  <PrimaryButton
                    onClick={onSubmit}
                    loading={isLoading}
                    disabled={!name}
                  >
                    {`Create ${projectType}`}
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
