import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function GiveRole({ setAction, actionMode, action }: Props) {
  const [selectedRoles, setSelectedRoles] = useState(
    (action.data?.roles || {}) as { [roleId: string]: boolean }
  );

  const { circle } = useCircle();
  const toggleSelectedRole = (roleId: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [roleId]: !selectedRoles[roleId],
    });
  };

  return (
    <Box
      marginTop="4"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            roles: selectedRoles,
          },
        });
      }}
    >
      <Box marginBottom="4">
        <Text variant="label">Pick the roles to give</Text>
      </Box>
      <Stack direction="horizontal" wrap>
        {Object.keys(circle.roles)?.map((role) => {
          return (
            <Box
              key={role}
              cursor="pointer"
              onClick={() => toggleSelectedRole(role)}
            >
              {selectedRoles[role] ? (
                <Tag tone={"accent"} hover>
                  <Box paddingX="2">{role}</Box>
                </Tag>
              ) : (
                <Tag hover>
                  <Box paddingX="2">{role}</Box>
                </Tag>
              )}
            </Box>
          );
        })}{" "}
      </Stack>
    </Box>
  );
}
