import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCircle } from "@/app/services/UpdateCircle";
import { updateCollection } from "@/app/services/UpdateCollection";
import { UserType } from "@/app/types";
import { guild } from "@guildxyz/sdk";
import { Box, Input, Stack, Tag, Text } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  handleClose: () => void;
};

export default function RoleGate({ handleClose }: Props) {
  const { circle, setCircleData } = useCircle();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const [guildUrl, setGuildUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<boolean[]>([]);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

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
    if (circle?.guildxyzId) {
      void (async () => {
        setLoading(true);
        const guildServer = await guild.get(circle?.guildxyzId || "");
        const guildRoles = guildServer.roles.map((role) => ({
          id: role.id,
          name: role.name,
        }));
        setGuildRoles(
          guildServer.roles.map((role) => ({ id: role.id, name: role.name }))
        );
        const currentlySelectedRoles = new Set([
          ...(collection.formMetadata.formRoleGating?.map((r) => r.id) || []),
        ]);
        const initSelectedRoles = Array(guildRoles?.length).fill(false);

        guildRoles?.forEach((role, index) => {
          if (currentlySelectedRoles.has(role.id)) {
            initSelectedRoles[index] = true;
          }
        });
        setSelectedRoles(initSelectedRoles);
        setLoading(false);
      })();
    }
  }, [circle?.guildxyzId]);

  return (
    <Modal title="Guild Integration" handleClose={handleClose} size="small">
      <Box padding="8" width="full">
        {!circle.guildxyzId ? (
          <Stack space="1">
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
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Form Role gate", {
                      user: currentUser?.username,
                      form: collection.name,
                    });
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
                Add Guild
              </PrimaryButton>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  margin="2"
                  cursor="pointer"
                  width="full"
                  onClick={() => {
                    window.open("https://guild.xyz/explorer", "_blank");
                  }}
                >
                  <Text color="accent">{`I haven't setup my guild yet`}</Text>
                </Box>
              </Box>
            </Box>
          </Stack>
        ) : (
          <Stack>
            <Box marginBottom="6">
              {" "}
              <Text>{`Pick guild.xyz roles that can submit a response to this form`}</Text>
            </Box>

            <Stack direction="horizontal" wrap>
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
            <Box padding="8" width="full">
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
                        formMetadata: {
                          ...collection.formMetadata,
                          formRoleGating: selectedRoleIds,
                        },
                      },
                      collection.id
                    );
                    setLocalCollection(res);
                  }
                  setLoading(false);
                  handleClose();
                }}
              >
                Save
              </PrimaryButton>
            </Box>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}
