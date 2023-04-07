import { Button, IconBookOpenSolid, Stack } from "degen";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import {
  GithubOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";

const SocialMedia = () => (
  <Stack justify="center" direction="horizontal" align="center">
    <a
      href="https://docs.spect.network/spect-docs/introduction/what-is-spect
      "
      target="_blank"
      rel="noreferrer"
    >
      <Button shape="circle" size="small" variant="transparent">
        <IconBookOpenSolid />
      </Button>
    </a>
    <a href="https://twitter.com/joinSpect" target="_blank" rel="noreferrer">
      <Button shape="circle" size="small" variant="transparent">
        <TwitterOutlined style={{ fontSize: "1.3rem" }} />
      </Button>
    </a>

    <a href="https://discord.gg/AF2qRMMpZ9" target="_blank" rel="noreferrer">
      <Button shape="circle" size="small" variant="transparent">
        <DiscordIcon />
      </Button>
    </a>

    <a href="https://github.com/spect-ai" target="_blank" rel="noreferrer">
      <Button shape="circle" size="small" variant="transparent">
        <GithubOutlined style={{ fontSize: "1.3rem" }} />
      </Button>
    </a>

    <a
      href="https://www.youtube.com/@spect.network"
      target="_blank"
      rel="noreferrer"
    >
      <Button shape="circle" size="small" variant="transparent">
        <YoutubeFilled style={{ fontSize: "1.3rem" }} />
      </Button>
    </a>
  </Stack>
);

export default SocialMedia;
