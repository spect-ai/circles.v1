import { UserType } from "@/app/types";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { Tooltip } from "react-tippy";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { Globe } from "react-feather";
import { smartTrim } from "@/app/common/utils/utils";

type Props = {
  member: UserType;
};

const ProfileInfo = ({ member }: Props) => {
  return (
    <Box>
      <a
        href={`/profile/${member.username}`}
        target="_blank"
        rel="noreferrer"
        style={{
          width: "100%",
        }}
      >
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
              backgroundColor="background"
              padding="4"
              width="full"
              borderRadius="2xLarge"
              boxShadow="0.5"
            >
              <Box marginTop="4" />
              <Stack align="center">
                <Text weight="semiBold">{member.username}</Text>
                <Text variant="small">{smartTrim(member.ethAddress, 20)}</Text>
                <Stack direction="horizontal" wrap space="1">
                  {member.skillsV2?.map((skill) => (
                    <Stack direction="horizontal" space="2" align="center">
                      <Tag key={skill.title} tone="accent">
                        {skill.title}
                      </Tag>
                      {/* <Text variant="label">|</Text> */}
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="horizontal" wrap space="1">
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noreferrer">
                      <Button shape="circle" size="small" variant="transparent">
                        <TwitterOutlined style={{ fontSize: "1.3rem" }} />
                      </Button>
                    </a>
                  )}
                  {member.discordId && (
                    <Tooltip title={member.discordUsername}>
                      <Button shape="circle" size="small" variant="transparent">
                        <DiscordIcon />
                      </Button>
                    </Tooltip>
                  )}
                  {member.github && (
                    <a
                      href={"https://github.com/spect-ai"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button shape="circle" size="small" variant="transparent">
                        <GithubOutlined style={{ fontSize: "1.3rem" }} />
                      </Button>
                    </a>
                  )}
                  {member.website && (
                    <a href={member.website} target="_blank" rel="noreferrer">
                      <Button shape="circle" size="small" variant="transparent">
                        <Globe />
                      </Button>
                    </a>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </a>
    </Box>
  );
};

export default ProfileInfo;
