import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCircle } from "@/app/services/UpdateCircle";
import { guild } from "@guildxyz/sdk";
import { Box, IconClose, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GuildxyzToCircleRoles } from "@/app/types";
import { useCircle } from "../../CircleContext";
import RolePopover from "../DiscordRoleMapping/RolePopover";

type Props = {
  roleName: string;
  guildRoles: {
    id: string;
    name: string;
  }[];
  roleMap: GuildxyzToCircleRoles;
  setRoleMap: React.Dispatch<React.SetStateAction<GuildxyzToCircleRoles>>;
};

const RoleSection = ({ roleName, guildRoles, setRoleMap, roleMap }: Props) => (
  <Box>
    <Text size="headingTwo" weight="semiBold">
      {roleName}
    </Text>
    <Stack direction="horizontal" wrap align="center">
      <RolePopover
        roles={guildRoles}
        setRoleMap={setRoleMap}
        roleMap={roleMap}
        circleRole={roleName}
      />
      {roleMap &&
        Object.values(roleMap).map((role) => {
          if (role.circleRole.includes(roleName)) {
            return (
              <Box
                key={role.id}
                cursor="pointer"
                onClick={() => {
                  if (role.circleRole.length > 1) {
                    setRoleMap({
                      ...roleMap,
                      [role.id]: {
                        ...role,
                        circleRole: role.circleRole.filter(
                          (r) => r !== roleName
                        ),
                      },
                    });
                  } else {
                    // eslint-disable-next-line no-param-reassign
                    delete roleMap[role.id];
                    setRoleMap({ ...roleMap });
                  }
                }}
              >
                <Tag hover tone="accent">
                  <Stack direction="horizontal" space="1" align="center">
                    <IconClose size="5" />
                    <Text>{role.name}</Text>
                  </Stack>
                </Tag>
              </Box>
            );
          }
          return null;
        })}
    </Stack>
  </Box>
);

const GuildRoleMapping = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { circle } = useCircle();
  const [roleMap, setRoleMap] = useState(circle?.guildxyzToCircleRoles || {});
  const [loading, setLoading] = useState(false);

  const [guildRoles, setGuildRoles] =
    useState<
      | {
          id: string;
          name: string;
        }[]
      | undefined
    >();

  useEffect(() => {
    if (isOpen) {
      (async () => {
        setLoading(true);
        const guildServer = await guild.get(circle?.guildxyzId || "");
        setGuildRoles(
          guildServer.roles.map((role) => ({
            id: role.id.toString(),
            name: role.name,
          }))
        );
        setLoading(false);
      })();
    }
  }, [circle?.guildxyzId, isOpen]);

  if (loading && isOpen) {
    return <Loader loading text="Fetching Roles" />;
  }

  if (!circle) {
    return <Loader loading text="Loading Roles" />;
  }

  return (
    <>
      <PrimaryButton
        variant="tertiary"
        onClick={() => {
          if (!circle.guildxyzId) {
            toast.error(
              "You must have a guild.xyz server connected to use this feature",
              {
                theme: "dark",
              }
            );
          } else setIsOpen(true);
        }}
      >
        Map Guild.xyz Roles
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Guildxyz Roles" handleClose={() => setIsOpen(false)}>
            <Box paddingX="8" paddingY="4">
              <Stack>
                {Object.keys(circle.roles).map((role) => (
                  <RoleSection
                    key={role}
                    roleName={circle.roles[role].name}
                    guildRoles={guildRoles || []}
                    roleMap={roleMap}
                    setRoleMap={setRoleMap}
                  />
                ))}
                <PrimaryButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    await updateCircle(
                      {
                        guildxyzToCircleRoles: roleMap,
                      },
                      circle.id
                    );
                    setLoading(false);
                    setIsOpen(false);
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
};

export default GuildRoleMapping;
