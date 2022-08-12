import Popover from "@/app/common/components/Popover";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Box, Button, useTheme } from "degen";
import { FilterOutlined } from "@ant-design/icons";
import { CircleType, MemberDetails } from "@/app/types";
import MultiSelectDropdown, {
  OptionType,
  Input,
  InputBox,
} from "@/app/common/components/MultiSelectDropDown/MultiSelectDropDown";
import { useLocalProject } from "../Context/LocalProjectContext";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { cardType, priorityType, labels } from "../ProjectViews/constants";
import { motion, AnimatePresence } from "framer-motion";
import { grow } from "@/app/common/components/Modal";

export default function Filter() {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const { mode } = useTheme();

  const { circle: cId } = router.query;
  const {
    localProject: project,
    currentFilter,
    setCurrentFilter,
  } = useLocalProject();
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

  const [reviewer, setReviewer] = useState<string[]>(
    currentFilter?.assignee || []
  );
  const [assignee, setAssignee] = useState<string[]>(
    currentFilter?.reviewer || []
  );
  const [label, setLabels] = useState<string[]>(currentFilter?.label || []);
  const [title, setTitle] = useState<string>(currentFilter?.title || "");
  const [column, setColumn] = useState<string[]>(currentFilter?.column || []);
  const [priority, setPriority] = useState<string[]>(
    currentFilter.priority || []
  );
  const [type, setType] = useState<string[]>(currentFilter?.type || []);

  const filterIsOn: boolean =
    currentFilter?.assignee?.length > 0 ||
    currentFilter?.reviewer?.length > 0 ||
    currentFilter?.label?.length > 0 ||
    currentFilter?.title?.length > 0 ||
    currentFilter?.column?.length > 0 ||
    currentFilter?.priority?.length > 0 ||
    currentFilter?.type?.length > 0;

  const handleClick = () => {
    setCurrentFilter({
      assignee: assignee,
      reviewer: reviewer,
      column: column,
      label: label,
      status: [""],
      title: title,
      type: type,
      priority: priority,
      deadline: "",
    });
    setFilterOpen(!filterOpen);
  };

  return (
    <>
      <Popover
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        butttonComponent={
          <Button
            shape="circle"
            size="small"
            variant="transparent"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterIsOn && (
              <div
                style={{
                  backgroundColor: "rgb(191, 90, 242, 1)",
                  height: "0.4rem",
                  width: "0.4rem",
                  zIndex: 10,
                  borderRadius: "3rem",
                  position: "absolute",
                  margin: "0px 8px 0px 15px",
                }}
              ></div>
            )}
            <FilterOutlined
              style={{
                color: `${filterIsOn ? "rgb(191, 90, 242, 0.7)" : "gray"}`,
                fontSize: "1.3rem",
              }}
            />
          </Button>
        }
      >
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={grow}
          >
            <Box
              padding={"3"}
              backgroundColor="background"
              width="96"
              style={{
                border: `2px solid ${
                  mode == "dark"
                    ? "rgb(255, 255, 255, 0.05)"
                    : "rgb(20, 20, 20, 0.05)"
                }`,
                borderRadius: "0.7rem",
              }}
            >
              <MultiSelectDropdown
                width="22"
                options={filteredMembers}
                value={assignee}
                setValue={setAssignee}
                title={"Assignee"}
              />
              <MultiSelectDropdown
                width="22"
                options={filteredMembers}
                value={reviewer}
                setValue={setReviewer}
                title={"Reviewer"}
              />
              <MultiSelectDropdown
                width="22"
                options={labels}
                value={label}
                setValue={setLabels}
                title={"Labels"}
              />
              <MultiSelectDropdown
                width="22"
                options={columns as OptionType[]}
                value={column}
                setValue={setColumn}
                title={"Column"}
              />
              <MultiSelectDropdown
                width="22"
                options={priorityType as OptionType[]}
                value={priority}
                setValue={setPriority}
                title={"Priority"}
              />
              <MultiSelectDropdown
                width="22"
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
              <PrimaryButton onClick={handleClick}>Filter</PrimaryButton>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Popover>
    </>
  );
}
