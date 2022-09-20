import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCircle } from "@/app/services/UpdateCircle";
import { guild } from "@guildxyz/sdk";
import { Box, IconClose, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";
import RolePopover from "../DiscordRoleMapping/RolePopover";

export default function GuildRoleMapping() {
  const [isOpen, setIsOpen] = useState(false);
  const { circle } = useCircle();
  const [roleMap, setRoleMap] = useState(circle?.guildxyzToCircleRoles || {});
  const [loading, setLoading] = useState(false);

  const [guildRoles, setGuildRoles] =
    useState<
      | {
          id: number;
          name: string;
        }[]
      | undefined
    >();

  useEffect(() => {
    if (isOpen) {
      void (async () => {
        setLoading(true);
        const guildServer = await guild.get(circle?.guildxyzId || "");
        console.log({ guildServer });
        setGuildRoles(
          guildServer.roles.map((role) => ({ id: role.id, name: role.name }))
        );
        setLoading(false);
      })();
    }
  }, [circle?.guildxyzId, isOpen]);

  if (loading && isOpen) {
    return <Loader loading text="Fetching Roles" />;
  }
  const RoleSection = ({ roleName }: { roleName: string }) => (
    <Box>
      <Text size="headingTwo" weight="semiBold">
        {roleName}
      </Text>
      <Stack direction="horizontal" wrap align="center">
        <RolePopover
          roles={guildRoles as any}
          setRoleMap={setRoleMap}
          roleMap={roleMap}
          circleRole={roleName}
        />
        {roleMap &&
          Object.keys(roleMap).map((role) => {
            if (roleMap[role as any].circleRole.includes(roleName))
              return (
                <Box
                  key={role}
                  cursor="pointer"
                  onClick={() => {
                    if (roleMap[role as any].circleRole.length > 1) {
                      setRoleMap({
                        ...roleMap,
                        [role]: {
                          ...roleMap[role as any],
                          circleRole: roleMap[role as any].circleRole.filter(
                            (r) => r !== roleName
                          ),
                        },
                      });
                    } else {
                      delete roleMap[role as any];
                      setRoleMap({ ...roleMap });
                    }
                  }}
                >
                  <Tag hover tone="accent">
                    <Stack direction="horizontal" space="1" align="center">
                      <IconClose size="5" />
                      <Text>{roleMap[role as any].name}</Text>
                    </Stack>
                  </Tag>
                </Box>
              );
          })}
      </Stack>
    </Box>
  );

  if (!circle) {
    return <Loader loading text="Loading Roles" />;
  }

  return (
    <>
      <PrimaryButton
        onClick={() => {
          if (!circle.guildxyzId)
            toast.error(
              "You must have a guild.xyz server connected to use this feature",
              {
                theme: "dark",
              }
            );
          else setIsOpen(true);
        }}
      >
        Map guild.xyz Roles
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Guildxyz Roles" handleClose={() => setIsOpen(false)}>
            <Box paddingX="8" paddingY="4">
              <Stack>
                {Object.keys(circle.roles).map((role) => (
                  <RoleSection key={role} roleName={role} />
                ))}
                <PrimaryButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    console.log({ roleMap });
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
}
