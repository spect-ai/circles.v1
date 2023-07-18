import { Text } from "@avp1598/vibes";
import { Avatar, Box, Stack } from "degen";

type Props = {
  avatar: string;
  username: string;
  id: string;
};

export default function DiscordProfileInfo({ avatar, username, id }: Props) {
  return (
    <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
      <Stack direction="horizontal" align="center" justify="center">
        <Avatar
          label="Discord Avatar"
          src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`}
        />
        <Box>
          <Text weight="bold">{username}</Text>
        </Box>
      </Stack>
    </Box>
  );
}
