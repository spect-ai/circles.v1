import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { reservedRoles } from "@/app/modules/Circle/ContributorsModal/InviteMembersModal/constants";
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

  useEffect(() => {
    setSelectedRoles(action.data?.roles || {});
  }, [action]);

  return (
    <Box
      marginTop="2"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            ...action.data,
            roles: selectedRoles,
            circleId: circle?.id || "",
          },
        });
      }}
    >
      <Box marginBottom="4">
        <Text variant="label">Pick the roles to give</Text>
      </Box>
      <Stack direction="horizontal" wrap>
        {Object.keys(circle?.roles || {})?.map((role) => {
          if (reservedRoles.includes(role)) return null;
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
      <Box marginTop="4" marginBottom="-4">
        <Editor
          value={`:::tip\nEnsure you have "Collect Responder Profile" plugin enabled.\n:::`}
          disabled={true}
          version={1}
        />
      </Box>
    </Box>
  );
}
