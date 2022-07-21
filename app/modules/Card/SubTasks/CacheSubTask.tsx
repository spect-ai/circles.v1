import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { CardType } from "@/app/types";
import React from "react";
import { SubTaskContainer } from "./CreatedSubTask";

type Props = {
  child: Partial<CardType>;
};

export default function CacheSubTask({ child }: Props) {
  const { getMemberDetails } = useModalOptions();
  console.log({ child });
  return (
    <SubTaskContainer
      title={child.title as string}
      memberDetails={getMemberDetails(
        (child.assignee && child.assignee[0]) || ""
      )}
    />
  );
}
