import { Box, Button } from "degen";
import Link from "next/link";
import { useLocation } from "react-use";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";

interface Props {
  state?: string;
  type?: string;
  width: "fit" | "full";
}

export default function ConnectDiscordButton({ state, width, type }: Props) {
  const { hostname } = useLocation();
  return (
    <Link
      href={
        `https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
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
        variant="secondary"
        prefix={
          <Box marginTop="1">
            <DiscordIcon />
          </Box>
        }
      >
        Connect Discord
      </Button>
    </Link>
  );
}
