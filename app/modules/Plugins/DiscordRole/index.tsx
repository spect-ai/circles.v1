import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action, CollectionType } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { getGuildRoles, guildIsConnected } from "@/app/services/Discord";
import Editor from "@/app/common/components/Editor";
import { useLocation } from "react-use";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { updateCollection } from "@/app/services/UpdateCollection";
import { logError } from "@/app/common/utils/utils";

type Props = {
  handleClose: () => void;
};

export default function DiscordRoleGate({ handleClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const { origin } = useLocation();
  const { circle, justAddedDiscordServer } = useCircle();
  const toggleSelectedRole = (index: number) => {
    setDiscordRoles(
      discordRoles?.map((role, i) => {
        if (i === index) return { ...role, selected: !role.selected } as any;
        return role;
      })
    );
  };
  const [discordIsConnected, setDiscordIsConnected] = useState(false);

  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
          selected: boolean;
        }[]
      | undefined
    >();

  useEffect(() => {
    if (circle?.discordGuildId) {
      const discordIsConnected = async () => {
        const res = await guildIsConnected(circle?.discordGuildId);
        console.log({ res });
        setDiscordIsConnected(res);
      };
      void discordIsConnected();
    }
  }, [circle?.discordGuildId, justAddedDiscordServer]);

  useEffect(() => {
    if (!discordIsConnected || !circle?.discordGuildId) return;
    const fetchGuildRoles = async () => {
      const roles = await getGuildRoles(circle?.discordGuildId);
      const selectedRolesSet = new Set(
        collection?.formMetadata.discordRoleGating?.map((role) => role.id)
      );
      roles?.forEach(
        (role: { selected: boolean; id: string; name: string }) => {
          role.selected = selectedRolesSet.has(role.id);
        }
      );

      roles && setDiscordRoles(roles);
    };
    if (circle?.discordGuildId) void fetchGuildRoles();
  }, [discordIsConnected]);

  if (!discordIsConnected)
    return (
      <Modal
        title="Discord Roles Plugin"
        handleClose={handleClose}
        size="small"
      >
        <Box padding="8" width="full">
          <Box
            width="48"
            paddingTop="4"
            onClick={() => {
              window.open(
                `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
                "popup",
                "width=600,height=600"
              );
            }}
          >
            <PrimaryButton
              icon={
                <Box marginTop="1">
                  <DiscordIcon />
                </Box>
              }
            >
              Connect Discord
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    );

  return (
    <Modal title="Discord Roles Plugin" handleClose={handleClose} size="small">
      <Box paddingX="8" paddingTop="4" paddingBottom="8" width="full">
        <Box marginTop="2">
          <Box marginBottom="4">
            <Text variant="label">
              Pick Discord roles that can submit a response to this form
            </Text>
          </Box>
          <Stack direction="horizontal" wrap>
            {discordRoles?.map((role, index) => {
              return (
                <Box
                  key={role.id}
                  cursor="pointer"
                  onClick={() => toggleSelectedRole(index)}
                >
                  {role.selected ? (
                    <Tag tone={"accent"} hover>
                      <Box paddingX="2">{role.name}</Box>
                    </Tag>
                  ) : (
                    <Tag hover>
                      <Box paddingX="2">{role.name}</Box>
                    </Tag>
                  )}
                </Box>
              );
            })}{" "}
          </Stack>
        </Box>
        <Box
          width="full"
          display="flex"
          flexDirection="row"
          gap="2"
          justifyContent="flex-end"
          paddingTop="8"
        >
          {(collection.formMetadata?.discordRoleGating?.length || 0) > 0 && (
            <PrimaryButton
              loading={loading}
              variant="tertiary"
              onClick={async () => {
                setLoading(true);

                const res = await updateCollection(
                  {
                    formMetadata: {
                      ...collection.formMetadata,
                      discordRoleGating: [],
                    },
                  },
                  collection.id
                );
                setLocalCollection(res);

                setLoading(false);
                handleClose();
              }}
            >
              Disable
            </PrimaryButton>
          )}
          <PrimaryButton
            loading={loading}
            disabled={!discordRoles?.some((role) => role.selected)}
            onClick={async () => {
              setLoading(true);
              const res = await updateCollection(
                {
                  formMetadata: {
                    ...collection.formMetadata,
                    discordRoleGating: discordRoles?.filter(
                      (role) => role.selected
                    ),
                  },
                },
                collection.id
              );
              if (res.id) setLocalCollection(res);
              else logError(res.message);
              setLoading(false);
              handleClose();
            }}
          >
            Save
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
