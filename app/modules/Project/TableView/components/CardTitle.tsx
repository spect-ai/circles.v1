import styled from "styled-components";
import { useState } from "react";
import { Box, Text, useTheme } from "degen";
import useCardService from "@/app/services/Card/useCardService";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";

const NameInput = styled.input<{ mode: string }>`
  width: auto;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.1rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  font-weight: 400;
  margin-left: 0.1rem;
`;

export function CardTitle({ id, name }: { id: string; name: string }) {
  const { mode } = useTheme();
  const { updateCard } = useCardService();
  const { updateProject } = useLocalProject();
  const [cardTitle, setCardTitle] = useState(name);

  const updateTitle = async () => {
    const res = await updateCard({ title: cardTitle }, id);
    console.log(res);
    if (res?.id) updateProject(res.project);
  };

  return (
    <NameInput
      mode={mode}
      value={cardTitle}
      placeholder="Add Title"
      onChange={(e) => setCardTitle(e.target.value)}
      onBlur={() => updateTitle()}
    />
  );
}
