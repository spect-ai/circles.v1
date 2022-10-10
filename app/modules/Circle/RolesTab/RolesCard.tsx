import Editor from "@/app/common/components/Editor";
import { Box, useTheme, Text, IconUserSolid, Stack, Tag } from "degen";
import React, { useState } from "react";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import styled from "styled-components";
import { Permissions } from "@/app/types";
import { useCircle } from "../CircleContext";
import AddRole from "../ContributorsModal/AddRoleModal";
import { updateRole } from "@/app/services/CircleRoles";

const Container = styled(Box)<{ mode: string }>`
  border-width: 2px;
  border-radius: 0.5rem;
  border-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.05)" : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  color: rgb(191, 90, 242, 0.7);
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

interface Props {
  role: {
    name: string;
    role: string;
    description: string;
    permissions: Permissions;
    selfAssignable: boolean;
    mutable: boolean;
  };
}

function RoleCard({ role }: Props) {
  const { localCircle: circle, setCircleData } = useCircle();
  const { mode } = useTheme();
  const { canDo } = useRoleGate();
  const [isDirty, setIsDirty] = useState(false);
  const [description, setDescription] = useState(role?.description);

  const onSaveDescription = async () => {
    const payload = {
      ...role,
      description: description,
    };
    console.log({ payload });
    const res = await updateRole(circle?.id, role.role, payload);
    if (res) setCircleData(res);
    console.log({ res });
  };

  return (
    <Container key={role.name} mode={mode}>
      <Stack direction={"horizontal"} align="center" justify={"space-between"}>
        <Text variant="extraLarge" weight="semiBold" transform="capitalize">
          {role.name}
        </Text>
        <Tag>
          <Stack direction="horizontal" space="1" align="center">
            <IconUserSolid size="5" />
            {Object.values(circle.memberRoles).reduce((acc, memberRole) => {
              if (memberRole.includes(role.role)) {
                return acc + 1;
              }
              return acc;
            }, 0)}
          </Stack>
        </Tag>
      </Stack>
      <Editor
        value={description}
        placeholder="Add a description, press '/' for commands"
        disabled={!canDo("manageRoles")}
        onChange={(txt) => {
          setDescription(txt);
        }}
        onSave={() => {
          void onSaveDescription();
          setIsDirty(false);
        }}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
      />
      <AddRole role={role.role} />
    </Container>
  );
}

export default RoleCard;
