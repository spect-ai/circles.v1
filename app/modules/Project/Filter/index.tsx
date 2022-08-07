import Popover from "@/app/common/components/Popover";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Box, Text, useTheme, IconGrid, IconList } from "degen";
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
import { filterCards } from "./filterCards";

export default function Filter() {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const { mode } = useTheme();

  const { circle: cId } = router.query;
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
  const [reviewer, setReviewer] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [label, setLabels] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [column, setColumn] = useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);

  return (
    <>
      <Popover
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        butttonComponent={
          <Box cursor="pointer" onClick={() => setFilterOpen(!filterOpen)}>
            <FilterOutlined style={{ color: "gray" }} />
          </Box>
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
              padding={"4"}
              backgroundColor="background"
              width="96"
              style={{
                border: `1px solid ${
                  mode == "dark"
                    ? "rgb(255, 255, 255, 0.05)"
                    : "rgb(20, 20, 20, 0.05)"
                }`,
                borderRadius: "1rem",
              }}
            >
              <MultiSelectDropdown
                width="22"
                options={filteredMembers as OptionType[]}
                value={assignee}
                setValue={setAssignee}
                title={"Assignee"}
              />
              <MultiSelectDropdown
                width="22"
                options={filteredMembers as OptionType[]}
                value={reviewer}
                setValue={setReviewer}
                title={"Reviewer"}
              />
              <MultiSelectDropdown
                width="22"
                options={labels as OptionType[]}
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
              <PrimaryButton>Filter</PrimaryButton>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Popover>
    </>
  );
}
