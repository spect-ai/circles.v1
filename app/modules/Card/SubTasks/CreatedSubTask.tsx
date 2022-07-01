import { Avatar, Box, Stack } from "degen";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CardType } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/router";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

const TitleInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.8);
  color: rgb(255, 255, 255, 0.8);

  ::placeholder {
    color: rgb(255, 255, 255, 0.25);
  }
  cursor: pointer;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const Container = styled(Box)`
  color: rgb(255, 255, 255, 0.85);
  background: rgb(255, 255, 255, 0);
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  &:hover {
    border: 2px solid rgb(191, 90, 242, 1);
  }
`;

type Props = {
  child: CardType;
};

type ContainerProps = {
  title: string;
  avatar?: string;
};

const variants = {
  hidden: { opacity: 0, x: 0, y: "-10h" },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: {
    opacity: 0,
    x: 0,
    y: "10vh",
    transition: {
      duration: 0.3,
    },
  },
};

export const SubTaskContainer = ({ title, avatar }: ContainerProps) => (
  <motion.div
    style={{
      background: "transparent",
      border: "none",
      padding: "0rem",
    }}
    variants={variants}
  >
    <Container paddingX="4" borderWidth="0.5" cursor="pointer">
      <Stack direction="horizontal">
        <TitleInput value={title} disabled />
        <Box paddingY="1">
          {avatar && (
            <Stack direction="horizontal" space="1">
              <Avatar
                size="9"
                src={avatar}
                label="avatar"
                placeholder={!avatar}
              />
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  </motion.div>
);

export default function CreatedSubTask({ child }: Props) {
  const [assignees, setAssignees] = useState<string[]>([]);
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { getMemberDetails } = useModalOptions();

  useEffect(() => {
    if (child) {
      setAssignees(child.assignee);
    }
  }, [child]);
  return (
    <Link href={`/${cId}/${pId}/${child.slug}`}>
      <div>
        <SubTaskContainer
          title={child.title}
          avatar={getMemberDetails(child.assignee[0])?.avatar}
        />
      </div>
    </Link>
  );
}
