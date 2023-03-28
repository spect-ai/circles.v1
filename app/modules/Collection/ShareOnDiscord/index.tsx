import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { linkDiscordToCollection } from "@/app/services/Collection";
import { fetchGuildChannels, guildIsConnected } from "@/app/services/Discord";
import { Option } from "@/app/types";
import { Box, Input, Text } from "degen";
import { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type EmbedProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ShareOnDiscord = ({ isOpen, setIsOpen }: EmbedProps) => {
  const { localCollection: collection } = useLocalCollection();
  const { circle, justAddedDiscordServer } = useCircle();
  const [threadName, setThreadName] = useState(collection.name);
  const [channelOptions, setChannelOptions] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({} as Option);
  const [discordIsConnected, setDiscordIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (circle?.discordGuildId && discordIsConnected) {
      const getGuildChannels = async () => {
        const data = await fetchGuildChannels(circle?.discordGuildId);
        const channelOptions = data.guildChannels?.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }));
        setChannelOptions(channelOptions);
      };
      void getGuildChannels();
    }
  }, [discordIsConnected]);

  if (!discordIsConnected)
    return (
      <Box
        width="48"
        paddingTop="4"
        onClick={() => {
          console.log({ origin });
          window.open(
            `https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
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
    <Modal
      title={`Share on Discord`}
      handleClose={() => setIsOpen(false)}
      size="small"
    >
      <Box paddingX="8" paddingY="4">
        <Box marginTop="2" width="full">
          {" "}
          <Box marginTop="2" marginBottom="2">
            <Text variant="label">Thread Name</Text>
          </Box>
          <Input
            label
            hideLabel
            onChange={(e) => {
              setThreadName(e.target.value);
            }}
            value={threadName}
            placeholder=""
          />
          <Box marginTop="4">
            <Text variant="label">Create Thread on this Channel</Text>
          </Box>
          <Dropdown
            options={channelOptions}
            selected={selectedChannel}
            onChange={(value) => {
              setSelectedChannel(value);
            }}
            multiple={false}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          marginTop="4"
        >
          <PrimaryButton
            onClick={async () => {
              setLoading(true);
              const res = await linkDiscordToCollection(collection.id, {
                threadName,
                selectedChannel: selectedChannel,
              });
              setLoading(false);
              console.log({ res });
            }}
            loading={loading}
          >
            Create Thread & Share
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};
