import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action, CollectionType } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { getGuildRoles, guildIsConnected } from "@/app/services/Discord";
import Editor from "@/app/common/components/Editor";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { useLocation } from "react-use";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function GiveDiscordRole({
  setAction,
  actionMode,
  action,
  collection,
}: Props) {
  const [selectedRoles, setSelectedRoles] = useState(
    (action.data?.roles || {}) as { [roleId: string]: boolean }
  );
  const { origin } = useLocation();
  const { circle, justAddedDiscordServer } = useCircle();
  const toggleSelectedRole = (roleId: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [roleId]: !selectedRoles[roleId],
    });
  };
  const [discordIsConnected, setDiscordIsConnected] = useState(false);

  useEffect(() => {
    setSelectedRoles(action.data?.roles || {});
  }, [action]);

  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
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
      const data = await getGuildRoles(circle?.discordGuildId);
      data && setDiscordRoles(data.roles);
      console.log({ data });
    };
    if (circle?.discordGuildId) void fetchGuildRoles();
  }, [discordIsConnected]);

  if (!discordIsConnected)
    return (
      <Box
        width="48"
        paddingTop="4"
        onClick={() => {
          window.open(
            `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
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
    );

  return (
    <Box
      marginTop="2"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            ...action.data,
            roles: selectedRoles,
            circleId: circle?.id,
          },
        });
      }}
    >
      <Box marginBottom="4">
        <Text variant="label">Pick the roles to give</Text>
      </Box>
      <Stack direction="horizontal" wrap>
        {discordRoles?.map((role) => {
          return (
            <Box
              key={role.id}
              cursor="pointer"
              onClick={() => toggleSelectedRole(role.id)}
            >
              {selectedRoles[role.id] ? (
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
      <Box marginTop="4" marginBottom="-4">
        <Editor
          value={
            ":::tip\nEnsure you have a discord field added to your form which the user will use to connect their discord account. Also, make sure the spect bot's role in your server is placed above the roles you are giving.\n:::"
          }
          disabled={true}
        />
      </Box>
    </Box>
  );
}
