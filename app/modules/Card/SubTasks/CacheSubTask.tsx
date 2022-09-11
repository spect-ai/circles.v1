import { CardType } from "@/app/types";
import React from "react";
import { SubTaskContainer } from "./CreatedSubTask";

type Props = {
  child: Partial<CardType>;
};

export default function CacheSubTask({ child }: Props) {
  return <SubTaskContainer title={child.title as string} />;
}
