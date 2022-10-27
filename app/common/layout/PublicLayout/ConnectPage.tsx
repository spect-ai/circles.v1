import { Box, Button, Stack, Text, IconSparkles } from "degen";
import { Connect } from "@/app/modules/Sidebar/ProfileButton/ConnectButton";
import styled from "styled-components";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import {
  GithubOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import Link from "next/link";

const VioletBlur = styled.div`
  filter: blur(150px);
  height: 200px;
  width: 200px;
  border-radius: 100px;
  background: linear-gradient(126.86deg, #5200ff 0%, #a900ff 100%);
  position: absolute;
`;

export default function ConnectPage() {
  return (
    <Box position={"relative"} display="flex" width={"full"} gap="11">
      {/* <VioletBlur style={{ bottom: "0px", left: "80rem" }} /> */}
      <Box
        style={{
          margin: "40vh auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Stack justify={"center"} direction="horizontal" align={"center"}>
          <IconSparkles color="accent" />
          <Text variant="large">
            Connect your wallet to explore the world of Spect
          </Text>
        </Stack>
        <Connect />
        <Stack justify={"center"} direction="horizontal" align={"center"}>
          <Link href={"https://twitter.com/joinSpect"}>
            <Button shape="circle" size="small" variant="transparent">
              <TwitterOutlined style={{ fontSize: "1.3rem" }} />
            </Button>
          </Link>

          <Link href={"https://discord.gg/AF2qRMMpZ9"}>
            <Button shape="circle" size="small" variant="transparent">
              <DiscordIcon />
            </Button>
          </Link>

          <Link href={"https://github.com/spect-ai"}>
            <Button shape="circle" size="small" variant="transparent">
              <GithubOutlined style={{ fontSize: "1.3rem" }} />
            </Button>
          </Link>

          <Link
            href={"https://www.youtube.com/channel/UCUXOC62aiZqT_ijL-dz379Q"}
          >
            <Button shape="circle" size="small" variant="transparent">
              <YoutubeFilled style={{ fontSize: "1.3rem" }} />
            </Button>
          </Link>
        </Stack>
      </Box>

      <VioletBlur style={{ top: "0px", left: "0rem" }} />
    </Box>
  );
}
