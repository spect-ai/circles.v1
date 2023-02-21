/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { addRole, updateRole } from "@/app/services/CircleRoles";
import { EyeOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconCheck,
  IconPencil,
  IconPlusSmall,
  Input,
  Stack,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";
import { defaultPermissions, permissionText } from "./contants";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

type props = {
  role?: string;
};

export default function AddRole({ role }: props) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading, setLoading] = useState(false);
  const { circle, fetchCircle } = useCircle();
  const { canDo } = useRoleGate();

  useEffect(() => {
    if (role && circle) {
      setName(circle.roles[role]?.name);
      setPermissions(circle.roles[role]?.permissions);
    }
  }, [circle, role]);

  return (
    <Box>
      {!role ? (
        <PrimaryButton
          icon={<IconPlusSmall />}
          onClick={() => setIsOpen(true)}
          variant="transparent"
        >
          Add Role
        </PrimaryButton>
      ) : (
        <Button
          prefix={
            circle.roles[role]?.mutable && canDo("manageRoles") ? (
              <IconPencil size="5" />
            ) : (
              <EyeOutlined />
            )
          }
          onClick={() => setIsOpen(true)}
          variant="transparent"
          width={"full"}
          size="small"
        >
          {circle.roles[role]?.mutable && canDo("manageRoles")
            ? "Edit"
            : "View"}{" "}
          Permissions
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <Modal
            title={
              role
                ? circle.roles[role]?.mutable && canDo("manageRoles")
                  ? "Edit Permissions"
                  : "View Permissions"
                : "Add Role"
            }
            handleClose={() => setIsOpen(false)}
          >
            <Box
              padding={{
                xs: "4",
                md: "8",
              }}
            >
              <Stack space="2">
                {(!role || (role && circle.roles[role]?.mutable)) && (
                  <>
                    <Box marginLeft="4">
                      <Text weight="semiBold">Role Name</Text>
                    </Box>
                    <Input
                      label=""
                      placeholder="guild_lead"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </>
                )}
                {role && !circle.roles[role]?.mutable && (
                  <Box marginLeft="4">
                    <Text weight="semiBold" align={"center"}>
                      This role is immutable
                    </Text>
                  </Box>
                )}

                <Box marginLeft="4">
                  <Text weight="semiBold">Permissions</Text>
                </Box>
                {/* <Stack direction="horizontal" wrap> */}
                {permissions &&
                  Object.keys(permissions)?.map((key) => (
                    <Box key={key} paddingY="2">
                      <Stack direction="horizontal" wrap>
                        <Box
                          width={{
                            xs: "full",
                            md: "1/2",
                          }}
                        >
                          <Text variant="label">
                            {(permissionText as any)?.[key]}
                          </Text>
                        </Box>
                        {typeof (permissions as any)[key] === "boolean" ? (
                          <CheckBox
                            isChecked={(permissions as any)[key] as boolean}
                            onClick={() => {
                              setPermissions({
                                ...permissions,
                                [key]: !(permissions as any)[key],
                              });
                            }}
                          />
                        ) : (
                          <Stack direction="horizontal">
                            {Object.keys((permissions as any)[key]).map(
                              (subKey) => (
                                <Stack direction="horizontal" key={subKey}>
                                  <Text>{subKey}</Text>
                                  <CheckBox
                                    // @ts-ignore
                                    isChecked={permissions[key][subKey]}
                                    onClick={() => {
                                      setPermissions({
                                        ...permissions,
                                        [key]: {
                                          // @ts-ignore
                                          ...permissions[key],
                                          // @ts-ignore
                                          [subKey]: !permissions[key][subKey],
                                        },
                                      });
                                    }}
                                  />
                                </Stack>
                              )
                            )}
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  ))}
                {/* </Stack> */}
                {(!role ||
                  (role &&
                    circle.roles[role]?.mutable &&
                    canDo("manageRoles"))) && (
                  <PrimaryButton
                    icon={<IconCheck />}
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      let res;
                      if (role) {
                        const payload = {
                          name: name,
                          description: role
                            ? circle.roles[role]?.description
                            : `${name} role`,
                          selfAssignable: false,
                          permissions,
                        };
                        console.log({ payload });
                        res = await updateRole(circle?.id, role, payload);
                      } else {
                        const payload = {
                          name: name,
                          description: role
                            ? circle.roles[role]?.description
                            : `${name} role`,
                          selfAssignable: false,
                          permissions,
                        };
                        console.log({ payload });
                        res = await addRole(circle?.id, payload);
                      }
                      console.log({ res });
                      fetchCircle();
                      setLoading(false);

                      // reset
                      setName("");
                      setPermissions(defaultPermissions);
                      res && setIsOpen(false);
                    }}
                  >
                    Save
                  </PrimaryButton>
                )}
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}
