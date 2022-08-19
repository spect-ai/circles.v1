import Modal from "@/app/common/components/Modal";
import { Box, IconSearch, IconUserSolid, Input, Stack, Text } from "degen";
import React from "react";
import { useCircle } from "../CircleContext";
import AddRole from "../ContributorsModal/AddRoleModal";

type Props = {
  handleClose: () => void;
};

export default function RolesModal({ handleClose }: Props) {
  const { circle } = useCircle();
  console.log({ circle });
  return (
    <Modal title="Roles" handleClose={handleClose}>
      <Box padding="8">
        <Stack>
          <Input label="" prefix={<IconSearch />} placeholder="Search" />
          <Box width="1/3">
            <AddRole />
          </Box>
          {circle &&
            Object.keys(circle?.roles).map((role) => (
              <Box key={role}>
                <Stack direction="horizontal" align="center">
                  <Box width="1/3">
                    <Text variant="label">{role}</Text>
                  </Box>
                  <Box width="1/3">
                    <Text>
                      <Stack direction="horizontal" space="1" align="center">
                        {Object.values(circle.memberRoles).reduce(
                          (acc, memberRole) => {
                            if (memberRole.includes(role)) {
                              return acc + 1;
                            }
                            return acc;
                          },
                          0
                        )}
                        <IconUserSolid size="5" />
                      </Stack>
                    </Text>
                  </Box>
                  <Box width="1/4">
                    <AddRole role={role} />
                  </Box>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
    </Modal>
  );
}
