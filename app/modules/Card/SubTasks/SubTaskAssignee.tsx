import Modal from "@/app/common/components/Modal";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { AvatarGroup, Box, IconUserSolid, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Option } from "../../Project/CreateCardModal/constants";

const CircleButton = styled(Box)<{ empty: boolean }>`
  border: ${(props) =>
    props.empty
      ? "2px solid rgb(255, 255, 255, 0.1)"
      : "2px solid transparent"};

  display: flex;
  align-items: center;
  border-radius: 50%;
  padding: ${(props) => (props.empty ? "0.4rem" : "0rem")};
  cursor: pointer;
  &:hover {
    border: ${(props) =>
      props.empty
        ? "2px solid rgb(191, 90, 242, 1)"
        : "2px solid rgb(191, 90, 242, 1)"};
  }
  transition: all 0.2s ease-in-out;
`;

interface Props {
  assignees: string[];
  setAssignees: (assignees: string[]) => void;
}

export default function SubTaskAssignee({ assignees, setAssignees }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>({} as Option[]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();
  const { getOptions, getMemberAvatars } = useModalOptions();

  useEffect(() => {
    const ops = getOptions("assignee") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  return (
    <>
      <CircleButton
        marginRight="2"
        onClick={() => {
          setIsOpen(true);
        }}
        empty={assignees.length === 0}
      >
        {assignees.length > 0 ? (
          <AvatarGroup members={getMemberAvatars(assignees)} hover />
        ) : (
          <Text>
            <IconUserSolid />
          </Text>
        )}
      </CircleButton>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Choose Assignee" handleClose={() => setIsOpen(false)}>
            {/* <AssigneeModal
              setAssignees={setAssignees}
              assignees={assignees}
              options={options}
              setFilteredOptions={setFilteredOptions}
              filteredOptions={filteredOptions}
            /> */}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
