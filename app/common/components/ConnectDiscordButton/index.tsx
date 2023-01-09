import { Box, Button } from "degen";
import Link from "next/link";
import { useLocation } from "react-use";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";

export default function ConnectDiscordButton({ state }: { state?: string }) {
  const { hostname } = useLocation();
  return (
    <Link
      href={
        `https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
          process.env.NODE_ENV === "development"
            ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
            : `https%3A%2F%2F${hostname}%2FlinkDiscord`
        }&response_type=code&scope=guilds%20identify` + `${state ? state : ``}`
      }
    >
      <Button
        data-tour="connect-discord-button"
        width="full"
        size="small"
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
