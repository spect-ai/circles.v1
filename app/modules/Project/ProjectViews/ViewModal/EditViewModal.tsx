import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { CircleType, MemberDetails, Views, Filter } from "@/app/types";
import MultiSelectDropdown, {
  OptionType,
  Input,
  InputBox,
} from "../../../../common/components/MultiSelectDropDown/MultiSelectDropDown";
import {
  Box,
  Text,
  useTheme,
  IconGrid,
  IconList,
  Stack,
  Button,
  IconTrash,
} from "degen";
import { SaveOutlined } from "@ant-design/icons";
import { editViews } from "@/app/services/ProjectViews";
import { cardType, priorityType, labels, Status } from "../constants";
import Modal from "@/app/common/components/Modal";
import ConfirmDelete from "./ConfirmDeleteModal";
import { AnimatePresence } from "framer-motion";

interface Props {
  setViewOpen: (viewOpen: boolean) => void;
  viewId: string;
}

function EditViewModal({ setViewOpen, viewId }: Props) {
  const router = useRouter();
  const { mode } = useTheme();

  const { circle: cId, project: pId } = router.query;
  const { localProject: project, setLocalProject } = useLocalProject();
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    { enabled: false }
  );

  const [filteredMembers, setFilteredMembers] = useState<
    { name: string; id: string }[]
  >([] as any);
  const [deleteModal, setDeleteModal] = useState(false);

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
    id: column,
  }));

  const view: Views = project.viewDetails?.[viewId as string]!;
  const viewFilters: Filter = view?.filters!;

  const [name, setName] = useState<string>(view?.name || " ");
  const [layout, setLayout] = useState<"Board" | "List">(view?.type || "Board");
  const [reviewer, setReviewer] = useState<string[]>(
    viewFilters?.reviewer || []
  );
  const [assignee, setAssignee] = useState<string[]>(
    viewFilters?.assignee || []
  );
  const [label, setLabels] = useState<string[]>(viewFilters?.label || []);
  const [title, setTitle] = useState<string>(viewFilters?.title || "");
  const [column, setColumn] = useState<string[]>(viewFilters?.column || []);
  const [priority, setPriority] = useState<string[]>(
    viewFilters?.priority || []
  );
  const [type, setType] = useState<string[]>(viewFilters?.type || []);

  const onEdit = async () => {
    const updatedProject = await editViews(
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
        },
        name: name,
      },
      project.id,
      viewId
    );
    setViewOpen(false);
    console.log(updatedProject);
    if (updatedProject !== null) setLocalProject(updatedProject);
  };

  return (
    <>
      <Modal
        handleClose={() => setViewOpen(false)}
        title={"Edit View"}
        size="small"
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
            <Box display="flex" flexDirection="row">
              <Box
                color="textSecondary"
                padding="2"
                borderRadius="large"
                backgroundColor={
                  layout == "Board" ? "accentSecondary" : "background"
                }
                onClick={() => setLayout("Board")}
              >
                <IconGrid size="4" />
              </Box>
              <Box
                color="textSecondary"
                padding="2"
                borderRadius="large"
                backgroundColor={
                  layout == "List" ? "accentSecondary" : "background"
                }
                onClick={() => setLayout("List")}
              >
                <IconList size="4" />
              </Box>
            </Box>
          </Box>
          <MultiSelectDropdown
            width="30"
            options={filteredMembers as OptionType[]}
            value={assignee}
            setValue={setAssignee}
            title={"Assignee"}
          />
          <MultiSelectDropdown
            width="30"
            options={filteredMembers as OptionType[]}
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
          <Stack direction={"horizontal"} flex="initial" justify={"stretch"}>
            <Button
              tone="red"
              width="full"
              size="small"
              variant="secondary"
              prefix={<IconTrash size="4" />}
              onClick={() => setDeleteModal(true)}
            >
              Delete View
            </Button>
            <Button
              tone="accent"
              width="full"
              size="small"
              variant="secondary"
              onClick={onEdit}
              disabled={name.length == 0}
              prefix={<SaveOutlined />}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Modal>
      {deleteModal && (
        <AnimatePresence>
          <ConfirmDelete
            setDeleteModal={setDeleteModal}
            viewId={viewId}
            setViewOpen={setViewOpen}
          />
        </AnimatePresence>
      )}
    </>
  );
}
export default EditViewModal;
