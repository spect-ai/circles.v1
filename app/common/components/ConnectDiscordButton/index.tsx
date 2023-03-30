import { Box, Button } from "degen";
import Link from "next/link";
import { useLocation } from "react-use";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";

interface Props {
  state?: string;
  type?: string;
  width: "fit" | "full";
}

export default function ConnectDiscordButton({ state, width, type }: Props) {
  const { hostname } = useLocation();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  return (
    <Link
      href={
        `https://discord.com/api/oauth2/authorize?client_id=${
          process.env.DISCORD_CLIENT_ID
        }&redirect_uri=${
          process.env.NODE_ENV === "development"
            ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
            : `https%3A%2F%2F${hostname}%2FlinkDiscord`
        }&response_type=code&scope=guilds%20identify` +
        `${type ? "&type=" + type : ``}` +
        `${state ? "&state=" + state : ``}`
      }
    >
      <Button
        data-tour="connect-discord-button"
        size="small"
        width={width}
        variant={currentUser?.discordId ? "tertiary" : "secondary"}
        prefix={
          <Box marginTop="1">
            <DiscordIcon />
          </Box>
        }
      >
        {currentUser?.discordId ? "Reconnect" : "Connect"} Discord
      </Button>
    </Link>
  );
}
