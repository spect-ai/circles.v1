/* eslint-disable @typescript-eslint/ban-ts-comment */
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { addRole, updateRole } from "@/app/services/CircleRoles";
import {
  Box,
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
import { defaultPermissions } from "./contants";

type props = {
  role?: string;
};

export default function AddRole({ role }: props) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading, setLoading] = useState(false);
  const { circle, setCircleData } = useCircle();

  useEffect(() => {
    if (role && circle) {
      setName(role);
      setPermissions(circle.roles[role].permissions);
    }
  }, [circle, role]);

  return (
    <>
      {!role ? (
        <PrimaryButton
          icon={<IconPlusSmall />}
          onClick={() => setIsOpen(true)}
          variant="tertiary"
        >
          Add Role
        </PrimaryButton>
      ) : (
        <PrimaryButton
          icon={<IconPencil />}
          onClick={() => setIsOpen(true)}
          variant="tertiary"
        >
          Edit
        </PrimaryButton>
      )}

      <AnimatePresence>
        {isOpen && (
          <Modal title="Add Role" handleClose={() => setIsOpen(false)}>
            <Box padding="8" overflow="auto" style={{ height: "40rem" }}>
              <Stack space="2">
                <Box marginLeft="4">
                  <Text weight="semiBold">Role Name</Text>
                </Box>
                <Input
                  label=""
                  placeholder="guild_lead"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Box marginLeft="4">
                  <Text weight="semiBold">Permissions</Text>
                </Box>
                {/* <Stack direction="horizontal" wrap> */}
                {Object.keys(permissions).map((key) => (
                  <Box key={key} paddingY="2">
                    <Stack direction="horizontal">
                      <Box width="1/2">
                        <Text variant="label">{key}</Text>
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
                <PrimaryButton
                  icon={<IconCheck />}
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const payload = {
                      role: name,
                      description: name,
                      selfAssignable: false,
                      permissions,
                    };
                    console.log({ payload });
                    let res;
                    if (role) {
                      res = await updateRole(
                        circle?.id as string,
                        role,
                        payload
                      );
                    } else {
                      res = await addRole(circle?.id as string, payload);
                    }
                    console.log({ res });
                    setLoading(false);
                    setCircleData(res);
                    // reset
                    setName("");
                    setPermissions(defaultPermissions);
                    res && setIsOpen(false);
                  }}
                >
                  Save
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
