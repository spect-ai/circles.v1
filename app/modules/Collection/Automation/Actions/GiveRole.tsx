import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";

type Props = {
  action: Action;
  setAction: (action: Action) => void;
};

const GiveRole = ({ setAction, action }: Props) => {
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
        {Object.keys(circle?.roles || {})?.map((role) => (
          <Box
            key={role}
            cursor="pointer"
            onClick={() => toggleSelectedRole(role)}
          >
            {selectedRoles[role] ? (
              <Tag tone="accent" hover>
                <Box paddingX="2">{role}</Box>
              </Tag>
            ) : (
              <Tag hover>
                <Box paddingX="2">{role}</Box>
              </Tag>
            )}
          </Box>
        ))}{" "}
      </Stack>
    </Box>
  );
};

export default GiveRole;
