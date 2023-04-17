import { QuestionCircleOutlined, TwitterOutlined } from "@ant-design/icons";
import { Box, Button, Stack } from "degen";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { Hidden } from "react-grid-system";

type Props = {
  setFaqOpen: (value: boolean) => void;
};

export default function Help({ setFaqOpen }: Props) {
  return (
    <Hidden xs sm>
      <Box
        style={{
          position: "absolute",
          right: "2rem",
          bottom: "0.5rem",
          zIndex: "11",
        }}
      >
        <Stack
          justify={"center"}
          direction="horizontal"
          align={"center"}
          space="2"
        >
          <a
            href={"https://twitter.com/joinSpect"}
            target="_blank"
            rel="noreferrer"
          >
            <Button shape="circle" size="small" variant="transparent">
              <TwitterOutlined style={{ fontSize: "1.3rem" }} />
            </Button>
          </a>

          <a
            href={"https://discord.gg/AF2qRMMpZ9"}
            target="_blank"
            rel="noreferrer"
          >
            <Button shape="circle" size="small" variant="transparent">
              <DiscordIcon />
            </Button>
          </a>
          <Button
            shape="circle"
            size="small"
            variant="transparent"
            onClick={() => setFaqOpen(true)}
          >
            <QuestionCircleOutlined style={{ fontSize: "1.3rem" }} />
          </Button>
        </Stack>
      </Box>
    </Hidden>
  );
}
