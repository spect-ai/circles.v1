import {
  Box,
  Button,
  IconPlusSmall,
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
import Dropdown from "@/app/common/components/Dropdown";
import { toast } from "react-toastify";
import { ProjectOutlined } from "@ant-design/icons";
import { updateFolder } from "@/app/services/Folders";

const getPlaceholder: {
  [key: string]: string;
} = {
  // notion: "Notion URL",
  // github: "Github URL",
  trello: "Trello URL",
};

function CreateProjectModal({ folderId }: { folderId?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        setTemplate(res[0]);
      },
      enabled: false,
    }
  );
  const [template, setTemplate] = useState({} as option);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mode } = useTheme();

  const [importType, setImportType] = useState({
    label: "Trello",
    value: "trello",
  });

  const [importURL, setImportURL] = useState("");

  const onSubmit = async () => {
    // get board id from trello url
    let importId;
    if (importURL) {
      importId = importURL.split("/")[4];
      console.log({ importId });
      const trelloRes = await fetch(
        `https://api.trello.com/1/boards/${importId}`
      );
      if (trelloRes.status !== 200) {
        toast.error(
          "Invalid Trello URL, ensure that your board is public and the link is of the form https://trello.com/b/BOARD_ID"
        );
        return;
      }
    }

    setIsLoading(true);
    const data = await createProject({
      name,
      circleId: circle?.id,
      description,
      fromTemplateId: template.value,
      trelloId: importId,
    });
    setIsLoading(false);
    if (data) {
      void router.push(`/${cId}/${data.slug}`);
      void close();
      if (folderId) {
        const prev = Array.from(circle?.folderDetails[folderId]?.contentIds);
        prev.push(data.id);
        const payload = {
          contentIds: prev,
        };
        console.log(payload);
        await updateFolder(payload, circle?.id, folderId);
      } else if (circle?.folderOrder.length !== 0) {
        const folder = Object.entries(circle?.folderDetails)?.find(
          (pair) => pair[1].avatar === "All"
        );
        const prev = Array.from(
          circle?.folderDetails[folder?.[0] as string]?.contentIds
        );
        prev.push(data.id);
        const payload = {
          contentIds: prev,
        };
        console.log(payload);
        await updateFolder(payload, circle?.id, folder?.[0] as string);
      }
      fetchCircle();
    }
  };

  useEffect(() => {
    void fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Loader loading={isLoading} text="Creating your project" />
      {folderId ? (
        <Button
          size="small"
          variant="transparent"
          shape="circle"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
        >
          <ProjectOutlined
            style={{ fontSize: "1.1rem", color: "rgb(191, 90, 242, 1)" }}
          />
        </Button>
      ) : (
        <Button
          data-tour="circle-create-project-button"
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
                      theme={mode}
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
                <Stack direction="horizontal" space="1" align="center">
                  <Text variant="extraLarge" weight="semiBold">
                    Import
                  </Text>

                  <Button shape="circle" size="small" variant="transparent">
                    <Tooltip
                      html={
                        <Text>Import project board from other platforms</Text>
                      }
                      theme={mode}
                    >
                      <QuestionCircleFilled style={{ fontSize: "1rem" }} />
                    </Tooltip>
                  </Button>
                </Stack>
                <Stack direction="horizontal">
                  <Dropdown
                    options={[
                      {
                        label: "Trello",
                        value: "trello",
                      },
                    ]}
                    selected={importType}
                    onChange={setImportType}
                    title=""
                  />
                  <Input
                    label=""
                    placeholder={getPlaceholder[importType.value]}
                    value={importURL}
                    onChange={(e) => setImportURL(e.target.value)}
                  />
                </Stack>
                <Box width="full" marginTop="4">
                  <PrimaryButton
                    onClick={onSubmit}
                    loading={isLoading}
                    disabled={!name}
                  >
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
