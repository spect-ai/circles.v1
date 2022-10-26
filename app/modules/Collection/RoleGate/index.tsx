import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { addField } from "@/app/services/Collection";
import { updateCircle } from "@/app/services/UpdateCircle";
import { updateCollection } from "@/app/services/UpdateCollection";
import { FormUserType, GuildRole } from "@/app/types";
import { guild } from "@guildxyz/sdk";
import { Box, Input, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import { fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";

export default function RoleGate() {
  const [isOpen, setIsOpen] = useState(false);
  const { circle, setCircleData } = useCircle();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const [guildUrl, setGuildUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<boolean[]>([]);

  const [guildRoles, setGuildRoles] =
    useState<
      | {
          id: number;
          name: string;
        }[]
      | undefined
    >();

  const getGuildId = (guildUrl: string) => {
    try {
      const url = new URL(guildUrl);
      const pathname = url.pathname;
      const guildPath = pathname.split("/");
      if (guildPath.length !== 2 || !guildPath[1]) {
        toast.error("Invalid Guild Url");
        return;
      }
      return guildPath[1];
    } catch (err) {
      toast.error("Invalid Guild Url");
      return null;
    }
  };

  const toggleSelectedRole = (roleIndex: number) => {
    selectedRoles[roleIndex] = !selectedRoles[roleIndex];
    setSelectedRoles([...selectedRoles]);
  };

  useEffect(() => {
    if (isOpen && circle?.guildxyzId) {
      void (async () => {
        setLoading(true);
        const guildServer = await guild.get(circle?.guildxyzId || "");
        setGuildRoles(
          guildServer.roles.map((role) => ({ id: role.id, name: role.name }))
        );
        const currentlySelectedRoles = new Set([
          ...(collection.formRoleGating?.map((r) => r.id) || []),
        ]);
        const initSelectedRoles = Array(guildRoles?.length).fill(false);

        guildRoles?.forEach((role, index) => {
          if (currentlySelectedRoles.has(role.id)) {
            initSelectedRoles[index] = true;
          }
        });
        setSelectedRoles(initSelectedRoles);
        console.log({ currentlySelectedRoles });

        console.log({ selectedRoles });
        setLoading(false);
      })();
    }
  }, [circle?.guildxyzId, isOpen]);

  return (
    <>
      <Stack direction="vertical">
        {collection.formRoleGating && collection.formRoleGating.length > 0 && (
          <Text variant="small">{`Responses to form can only be added by these roles`}</Text>
        )}
        {!collection.formRoleGating ||
          (collection.formRoleGating.length === 0 && (
            <Text variant="small">{`Only allow holders of specific roles to submit response`}</Text>
          ))}
      </Stack>
      {collection.formRoleGating && collection.formRoleGating.length > 0 && (
        <Stack direction="horizontal" space="4">
          {collection.formRoleGating.map((role: GuildRole) => (
            <Tag tone="accent" key={role.id}>
              {role.name}
            </Tag>
          ))}
        </Stack>
      )}
      <PrimaryButton
        variant={
          collection.formRoleGating && collection.formRoleGating.length > 0
            ? "tertiary"
            : "secondary"
        }
        onClick={() => setIsOpen(true)}
      >
        {collection.formRoleGating && collection.formRoleGating.length > 0
          ? `Update Roles`
          : `Role Gate`}
      </PrimaryButton>
      {
        <AnimatePresence>
          {isOpen && !circle.guildxyzId && (
            <Modal
              title="Guild Integration"
              handleClose={() => setIsOpen(false)}
              size="small"
            >
              <Box padding="8" width="full">
                <Stack>
                  <Input
                    label="Guild URL on Guild.xyz"
                    placeholder="https://guild.xyz/our-guild"
                    name={guildUrl}
                    onChange={(e) => setGuildUrl(e.target.value)}
                  />
                  <Box
                    width="full"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <PrimaryButton
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);
                        const guildId = getGuildId(guildUrl);
                        if (guildId) {
                          const guildServer = await guild.get(guildId);
                          const res = await updateCircle(
                            {
                              guildxyzId: guildServer.id,
                            },
                            circle?.id
                          );
                          console.log({ res });
                          setCircleData(res);
                        }

                        setLoading(false);
                      }}
                    >
                      Save
                    </PrimaryButton>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        margin="4"
                        cursor="pointer"
                        width="2/3"
                        onClick={() => {
                          window.open("https://guild.xyz/explorer", "_blank");
                        }}
                      >
                        <Text>{`I haven't setup my guild yet`}</Text>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Modal>
          )}
          {isOpen && circle.guildxyzId && (
            <Modal
              title="Role Gate"
              handleClose={() => setIsOpen(false)}
              size="small"
            >
              <Box padding="8" width="full">
                <Box marginBottom="6">
                  {" "}
                  <Text>{`Pick guild.xyz roles that can submit a response to this form`}</Text>
                </Box>

                <Stack direction="horizontal">
                  {guildRoles?.map((option, index) => (
                    <Box
                      key={option.id}
                      cursor="pointer"
                      onClick={() => toggleSelectedRole(index)}
                    >
                      {selectedRoles[index] ? (
                        <Tag tone={"accent"} hover>
                          <Box paddingX="2">{option.name}</Box>
                        </Tag>
                      ) : (
                        <Tag hover>
                          <Box paddingX="2">{option.name}</Box>
                        </Tag>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box padding="8" width="full">
                <Box
                  width="full"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <PrimaryButton
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const selectedRoleIds = guildRoles?.filter(
                        (r, index) => selectedRoles[index] === true
                      );
                      if (selectedRoleIds) {
                        const res = await updateCollection(
                          {
                            formRoleGating: selectedRoleIds,
                          },
                          collection.id
                        );
                        setLocalCollection(res);
                      }
                      setIsOpen(false);
                      setLoading(false);
                    }}
                  >
                    Save
                  </PrimaryButton>
                </Box>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      }
    </>
  );
}
