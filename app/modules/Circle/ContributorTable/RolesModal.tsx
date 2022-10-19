import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { IconPlusSmall, IconClose, Box, Text, Stack, Tag } from "degen";
import { useState } from "react";
import { removeMember, updateMemberRole } from "@/app/services/CircleRoles";
import { useRouter } from "next/router";
import queryClient from "@/app/common/utils/queryClient";
import { CircleType } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";

interface Props {
  handleClose: () => void;
  user: string;
}

export function RolesModal({ handleClose, user }: Props) {
  const { circle } = useCircle();
  const router = useRouter();
  const { circle: cId } = router.query;
  const [userRoles, setUserRoles] = useState(circle?.memberRoles[user]);

  return (
    <Modal title="Select Roles" handleClose={handleClose} size="small">
      <Box style={{ margin: "1rem", marginTop: "1.5rem" }}>
        <Stack space="4" wrap>
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            alignItems="center"
            margin="auto"
          >
            {userRoles?.map &&
              Object.keys((circle).roles).map((role) => (
                <Box
                  key={role}
                  cursor="pointer"
                  onClick={async () => {
                    // remove user role if at least one role is left
                    if (userRoles.length > 1) {
                      const newRoles = userRoles.filter((r) => r !== role);
                      setUserRoles(newRoles);
                      const data = await updateMemberRole(
                        (circle).id,
                        user,
                        {
                          roles: newRoles,
                        }
                      );
                      if (data) {
                        queryClient.setQueryData(["circle", cId], data);
                      }
                    }
                    if (userRoles && !userRoles.includes(role)) {
                      console.log("add role");
                      // add user role if not already present
                      const newUserRoles = [...userRoles, role];
                      setUserRoles(newUserRoles);
                      const data = await updateMemberRole(
                        (circle).id,
                        user,
                        {
                          roles: newUserRoles,
                        }
                      );
                      if (data) {
                        queryClient.setQueryData(["circle", cId], data);
                      }
                    }
                  }}
                >
                  <Tag
                    hover
                    tone={userRoles.includes(role) ? "accent" : "secondary"}
                  >
                    <Stack direction="horizontal" space="1" align="center">
                      {userRoles.includes(role) ? (
                        <IconClose size="4" />
                      ) : (
                        <IconPlusSmall size="4" />
                      )}
                      <Text
                        color={userRoles.includes(role) ? "accent" : "text"}
                      >
                        {role}
                      </Text>
                    </Stack>
                  </Tag>
                </Box>
              ))}
          </Box>
          <PrimaryButton
            tone="red"
            icon={<IconClose />}
            onClick={async () => {
              const data = await removeMember((circle).id, user);
              if (data) {
                queryClient.setQueryData(["circle", cId], data);
              }
            }}
          >
            Remove Member
          </PrimaryButton>
        </Stack>
      </Box>
    </Modal>
  );
}
