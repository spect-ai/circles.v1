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
  roleKey: string;
  role: {
    name: string;
    description: string;
    permissions: Permissions;
    selfAssignable: boolean;
    mutable: boolean;
  };
}

function RoleCard({ roleKey, role }: Props) {
  const { circle, setCircleData } = useCircle();
  const { mode } = useTheme();
  const { canDo } = useRoleGate();
  const [isDirty, setIsDirty] = useState(false);
  const [description, setDescription] = useState(role?.description);

  const onSaveDescription = async () => {
    if (circle?.id === undefined) return;
    const payload = {
      ...role,
      description: description,
    };
    console.log({ payload });
    const res = await updateRole(circle?.id, roleKey, payload);
    if (res) setCircleData(res);
    console.log({ res });
  };

  return (
    <Container key={role.name} mode={mode}>
      <Stack direction={"horizontal"} align="center" justify={"space-between"}>
        <Text variant="extraLarge" weight="semiBold">
          {role.name}
        </Text>
        <Tag>
          <Stack direction="horizontal" space="1" align="center">
            <IconUserSolid size="5" />
            {Object.values(circle?.memberRoles || {}).reduce(
              (acc, memberRole) => {
                if (memberRole.includes(roleKey)) {
                  return acc + 1;
                }
                return acc;
              },
              0
            )}
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
      <AddRole role={roleKey} />
    </Container>
  );
}

export default RoleCard;
