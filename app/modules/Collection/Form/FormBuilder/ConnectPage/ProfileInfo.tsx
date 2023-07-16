import { UserType } from "@/app/types";
import { GithubOutlined } from "@ant-design/icons";
import { Avatar, Box, Stack } from "degen";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { smartTrim } from "@/app/common/utils/utils";
import { Button, Text } from "@avp1598/vibes";

type Props = {
  member: UserType;
};

const ProfileInfo = ({ member }: Props) => {
  return (
    <Box>
      <Box padding="2" margin="0">
        <Stack space="1" align="center">
          <Box
            style={{
              marginBottom: "-2rem",
              borderRadius: "50%",
            }}
          >
            <Avatar
              src={
                member.avatar ||
                `https://api.dicebear.com/5.x/thumbs/svg?seed=${member.id}`
              }
              address={member.ethAddress as `0x${string}`}
              label={member.username}
              size="24"
            />
          </Box>
          <Box
            backgroundColor="transparent"
            padding="4"
            width="full"
            borderRadius="2xLarge"
          >
            <Box marginTop="4" />
            <Stack align="center">
              <Text weight="semiBold" color="secondary">
                {member.username}
              </Text>
              <Text>{smartTrim(member.ethAddress, 20)}</Text>

              <Stack direction="horizontal" wrap space="1">
                {member.discordUsername && (
                  // <Tooltip title={member.discordUsername}>
                  <Button variant="tertiary">
                    <DiscordIcon />
                  </Button>
                  // </Tooltip>
                )}
                {member.githubUsername && (
                  <a
                    href={`https://github.com/${member.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="tertiary">
                      <GithubOutlined style={{ fontSize: "1.3rem" }} />
                    </Button>
                  </a>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
