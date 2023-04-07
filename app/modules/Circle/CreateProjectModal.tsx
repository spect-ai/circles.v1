import { Box, Button, Input, Stack, Text, useTheme } from "degen";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "@/app/common/components/Modal";
import Select, { Option } from "@/app/common/components/Select";
import { useQuery } from "react-query";
import { Template } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Tooltip } from "react-tippy";
import { QuestionCircleFilled } from "@ant-design/icons";
import { createProject } from "@/app/services/Project";
import Dropdown from "@/app/common/components/Dropdown";
import { toast } from "react-toastify";
import { updateFolder } from "@/app/services/Folders";
import { useCircle } from "./CircleContext";

const getPlaceholder: {
  [key: string]: string;
} = {
  trello: "Trello URL",
};

interface Props {
  folderId?: string;
  setModalOpen: (modal: boolean) => void;
}

const CreateProjectModal = ({ folderId, setModalOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const close = () => setModalOpen(false);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { circle, fetchCircle } = useCircle();

  const [template, setTemplate] = useState({} as Option);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mode } = useTheme();

  const [importType, setImportType] = useState({
    label: "Trello",
    value: "trello",
  });

  const { data: templates, refetch: fetchTemplate } = useQuery<Option[]>(
    ["projectTemplates", cId],
    () =>
      fetch(
        `${process.env.API_HOST}/template/allProjectTemplates/${circle?.id}`
      ).then(async (res) => {
        const data = await res.json();
        const filteredData = data.map((t: Template) => {
          const rt: Option = {
            label: t.name,
            value: t._id,
          };
          return rt;
        });
        return filteredData;
      }),
    {
      onSuccess: (res: Option[]) => {
        setTemplate(res[0]);
      },
      enabled: false,
    }
  );

  const [importURL, setImportURL] = useState("");

  const onSubmit = async () => {
    // get board id from trello url
    let importId;
    if (importURL) {
      [, , , importId] = importURL.split("/");
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
    if (!circle) return;

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
      router.push(`/${cId}/${data.slug}`);
      close();
      if (folderId) {
        const prev = Array.from(circle?.folderDetails[folderId]?.contentIds);
        prev.push(data.id);
        const payload = {
          contentIds: prev,
        };
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
        await updateFolder(payload, circle?.id, folder?.[0] as string);
      }
      fetchCircle();
    }
  };

  useEffect(() => {
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
                  <Text>Pre built board with columns and automations set</Text>
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
                html={<Text>Import project board from other platforms</Text>}
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
              multiple={false}
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
  );
};

export default CreateProjectModal;
