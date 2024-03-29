import { Box, Tag, Text, IconUserGroupSolid, Stack } from "degen";
import { useState, useEffect } from "react";
import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";

interface Props {
  permissions: string[];
  setPermissions: (roles: string[]) => void;
  permissionText: string;
  setIsDirty: (dirty: boolean) => void;
}

function RoleChunks({
  permissions,
  setPermissions,
  permissionText,
  setIsDirty,
}: Props) {
  const { circle } = useCircle();
  const [circleRoles, setCircleRoles] = useState(circle?.roles || {});

  useEffect(() => {
    setCircleRoles(circle?.roles || {});
  }, [circle?.roles]);
  return (
    <Stack space={"4"}>
      <Text variant="large">{permissionText}</Text>
      <Box display={"flex"} flexDirection="row" gap={"2"}>
        {Object.keys(circleRoles)?.map((role) => {
          return (
            <Box
              key={role}
              onClick={() => {
                if (permissions.includes(role)) {
                  setPermissions(permissions.filter((item) => item !== role));
                } else {
                  setPermissions([...permissions, role]);
                }
                setIsDirty(true);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <Tag
                hover
                size="medium"
                as="span"
                tone={permissions.includes(role) ? "accent" : "secondary"}
              >
                {role}
              </Tag>
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}

export default function FormRoles() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [roleModal, setRoleModal] = useState(false);
  const [manageSettings, setManageSettings] = useState<string[]>(
    collection?.permissions?.manageSettings || []
  );
  const [updateResponses, setUpdateResponses] = useState<string[]>(
    collection?.permissions?.updateResponsesManually || []
  );
  const [viewResponses, setViewResponses] = useState<string[]>(
    collection?.permissions?.viewResponses || []
  );
  const [addComments, setAddComments] = useState<string[]>(
    collection?.permissions?.addComments || []
  );
  const [isDirty, setIsDirty] = useState(false);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Box width="full" display="flex" flexDirection={"column"} gap="4">
        <Text variant="label">Configure granular permissions using Circle Roles</Text>
        <PrimaryButton
          icon={<IconUserGroupSolid />}
          onClick={() => setRoleModal(true)}
        >
          Configure access
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {roleModal && (
          <Modal
            title="Granular Access"
            handleClose={() => setRoleModal(false)}
          >
            <Box padding="6" display={"flex"} flexDirection="column" gap={"4"}>
              <RoleChunks
                permissionText={
                  collection?.collectionType === 0
                    ? "Manage Form Settings"
                    : "Manage Collection Settings"
                }
                permissions={manageSettings}
                setPermissions={setManageSettings}
                setIsDirty={setIsDirty}
              />
              <RoleChunks
                permissionText={
                  collection?.collectionType === 0
                    ? "Update Responses Manually"
                    : "Update Cards"
                }
                permissions={updateResponses}
                setPermissions={setUpdateResponses}
                setIsDirty={setIsDirty}
              />
              <RoleChunks
                permissionText={
                  collection?.collectionType === 0
                    ? "View Responses"
                    : "View Cards"
                }
                permissions={viewResponses}
                setPermissions={setViewResponses}
                setIsDirty={setIsDirty}
              />
              <RoleChunks
                permissionText="Add Comments"
                permissions={addComments}
                setPermissions={setAddComments}
                setIsDirty={setIsDirty}
              />
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  const res = await (
                    await fetch(
                      `${process.env.API_HOST}/collection/v1/${collection.id}`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({
                          permissions: {
                            manageSettings: manageSettings,
                            updateResponsesManually: updateResponses,
                            viewResponses: viewResponses,
                            addComments: addComments,
                          },
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }
                    )
                  ).json();
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                  setLoading(false);
                  setRoleModal(false);
                }}
                disabled={!isDirty}
              >
                Save Permissions
              </PrimaryButton>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
