import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { CircleType, MemberDetails } from "@/app/types";
import MultiSelectDropdown, {
  OptionType,
  Input,
  InputBox,
} from "@/app/common/components/MultiSelectDropDown/MultiSelectDropDown";

import { Box, Text, useTheme } from "degen";
import {
  AlignLeftOutlined,
  BarsOutlined,
  AppstoreOutlined,
  TableOutlined,
} from "@ant-design/icons";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { createViews } from "@/app/services/ProjectViews";
import { cardType, priorityType } from "../constants";
import Modal from "@/app/common/components/Modal";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

interface Props {
  setViewOpen: (viewOpen: boolean) => void;
}

function CreateViewModal({ setViewOpen }: Props) {
  const router = useRouter();
  const { mode } = useTheme();
  const { getOptions } = useModalOptions();

  const { circle: cId } = router.query;
  const { localProject: project, setLocalProject } = useLocalProject();
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    { enabled: false }
  );

  const [filteredMembers, setFilteredMembers] = useState<OptionType[]>(
    [] as OptionType[]
  );

  const labelsArray = getOptions("labels");
  const labels = labelsArray?.map((i) => ({ name: i.name, id: i.name }));

  useEffect(() => {
    if (circle) {
      const circleMembersArray = circle?.members.map((mem) => ({
        name: memberDetails?.memberDetails[mem]?.username as string,
        id: mem,
      }));
      setFilteredMembers(circleMembersArray);
    }
  }, [circle, memberDetails?.memberDetails]);

  const columns = project?.columnOrder?.map((column: string) => ({
    name: project?.columnDetails[column].name,
    id: project?.columnDetails[column].name,
  }));

  const [name, setName] = useState<string>("");
  const [layout, setLayout] =
    useState<"Board" | "List" | "Gantt" | "Table">("Board");
  const [reviewer, setReviewer] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [label, setLabels] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [column, setColumn] = useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);

  const onCreate = async () => {
    const updatedProject = await createViews(
      {
        type: layout,
        hidden: false,
        filters: {
          assignee: assignee,
          reviewer: reviewer,
          column: column,
          label: label,
          status: [],
          title: title,
          type: type,
          priority: priority,
          deadline: "",
          assignedCircle: [],
        },
        name: name,
      },
      project.id
    );
    setViewOpen(false);
    if (updatedProject !== null) setLocalProject(updatedProject);
  };

  return (
    <>
      <Modal
        handleClose={() => setViewOpen(false)}
        title={"Create View"}
        size="small"
        zIndex={2}
      >
        <Box padding={"4"}>
          <InputBox mode={mode}>
            <Input
              placeholder={"View Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
            />
          </InputBox>
          {name.length == 0 && (
            <Text variant="small" color="purple">
              Please name it
            </Text>
          )}
          <Box
            display="flex"
            flexDirection="row"
            padding="1"
            paddingBottom="2"
            paddingLeft="4"
            justifyContent="space-between"
          >
            <Text color="textSecondary" weight="medium" variant="base">
              Layout
            </Text>
            <Box display="flex" flexDirection="row" gap={"2"}>
              <Box
                cursor="pointer"
                color="textSecondary"
                paddingX="1.5"
                paddingY="1"
                borderRadius="large"
                backgroundColor={
                  layout == "Board" ? "accentSecondary" : "background"
                }
                onClick={() => setLayout("Board")}
              >
                <AppstoreOutlined style={{ fontSize: "1.1rem" }} />
              </Box>
              <Box
                cursor="pointer"
                color="textSecondary"
                paddingX="1.5"
                paddingY="1"
                borderRadius="large"
                backgroundColor={
                  layout == "List" ? "accentSecondary" : "background"
                }
                onClick={() => setLayout("List")}
              >
                <BarsOutlined style={{ fontSize: "1.1rem" }} />
              </Box>
              <Box
                cursor="pointer"
                color="textSecondary"
                paddingX="1.5"
                paddingY="1"
                borderRadius="large"
                backgroundColor={
                  layout == "Gantt" ? "accentSecondary" : "background"
                }
                onClick={() => setLayout("Gantt")}
              >
                <AlignLeftOutlined style={{ fontSize: "1.1rem" }} />
              </Box>
              <Box
                cursor="pointer"
                color="textSecondary"
                paddingX="1.5"
                paddingY="1"
                borderRadius="large"
                backgroundColor={
                  layout == "Table" ? "accentSecondary" : "background"
                }
                onClick={() => setLayout("Table")}
              >
                <TableOutlined style={{ fontSize: "1.1rem" }} />
              </Box>
            </Box>
          </Box>
          <MultiSelectDropdown
            width="30"
            options={filteredMembers}
            value={assignee}
            setValue={setAssignee}
            title={"Assignee"}
          />
          <MultiSelectDropdown
            width="30"
            options={filteredMembers}
            value={reviewer}
            setValue={setReviewer}
            title={"Reviewer"}
          />
          <MultiSelectDropdown
            width="30"
            options={labels as OptionType[]}
            value={label}
            setValue={setLabels}
            title={"Labels"}
          />
          <MultiSelectDropdown
            width="30"
            options={columns as OptionType[]}
            value={column}
            setValue={setColumn}
            title={"Column"}
          />
          <MultiSelectDropdown
            width="30"
            options={priorityType as OptionType[]}
            value={priority}
            setValue={setPriority}
            title={"Priority"}
          />
          <MultiSelectDropdown
            width="30"
            options={cardType as OptionType[]}
            value={type}
            setValue={setType}
            title={"Type"}
          />
          <InputBox mode={mode}>
            <Input
              placeholder={"Title"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputBox>
          <PrimaryButton onClick={onCreate} disabled={name.length == 0}>
            Create View
          </PrimaryButton>
        </Box>
      </Modal>
    </>
  );
}
export default CreateViewModal;
