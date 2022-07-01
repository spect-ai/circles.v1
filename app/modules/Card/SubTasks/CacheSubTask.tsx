import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { CardType } from "@/app/types";
import React from "react";
import { SubTaskContainer } from "./CreatedSubTask";

type Props = {
  child: Partial<CardType>;
};

export default function CacheSubTask({ child }: Props) {
  const { getMemberDetails } = useModalOptions();

  return (
    <SubTaskContainer
      title={child.title as string}
      avatar={child.assignee ? getMemberDetails(child.assignee[0])?.avatar : ""}
    />
  );
}
