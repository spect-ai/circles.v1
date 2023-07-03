import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { postFormMessage } from "@/app/services/Collection";
import {
  fetchGuildChannels,
  groupChannelsByCategory,
  guildIsConnected,
} from "@/app/services/Discord";
import { Option } from "@/app/types";
import { Box, Input, Text } from "degen";
import { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";
import { toast } from "react-toastify";
import { errorLookup } from "../Constants";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";

type EmbedProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ShareOnDiscord = ({ isOpen, setIsOpen }: EmbedProps) => {
  const { localCollection: collection } = useLocalCollection();
  const { circle, justAddedDiscordServer } = useCircle();
  const [channelOptions, setChannelOptions] = useState(
    [] as { label: string; options: Option[] }[]
  );
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
        const channels = await fetchGuildChannels(
          circle?.discordGuildId,
          ChannelType.GuildText,
          true,
          [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageThreads,
            PermissionFlagsBits.SendMessagesInThreads,
            PermissionFlagsBits.CreatePrivateThreads,
            PermissionFlagsBits.AttachFiles,
          ]
        );
        const channelOptions = channels?.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }));
        setChannelOptions(groupChannelsByCategory(channelOptions));
      };
      void getGuildChannels();
    }
  }, [discordIsConnected]);

  if (!discordIsConnected)
    return (
      <Modal
        title={`Share on Discord`}
        handleClose={() => setIsOpen(false)}
        size="small"
      >
        <Box paddingX="8" paddingY="4">
          <Text>
            Spect forms can be filled out directly from Discord 🤯. Connect your
            Discord server to collect responses to this form on Discord.
          </Text>
          <Box
            width="48"
            paddingTop="4"
            onClick={() => {
              window.open(
                `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
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
        </Box>
      </Modal>
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
          <Text variant="small">
            Spect forms can be filled out directly from Discord 🤯
          </Text>
          <Box marginTop="4">
            <Text variant="label">Share form on this Channel</Text>
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
          justifyContent="space-between"
          marginTop="4"
          alignItems="center"
        >
          <Box
            cursor="pointer"
            onClick={() => {
              window.open(
                "https://docs.spect.network/spect-docs/build-with-spect/setup-discord-native-onboarding/common-pitfalls-and-questions#why-doesnt-my-discord-channel-show-up-when-i-try-to-share-the-form",
                "_blank"
              );
            }}
          >
            <Text underline>I dont see a channel</Text>
          </Box>
          <PrimaryButton
            onClick={async () => {
              setLoading(true);
              const res = await postFormMessage(collection.id, {
                channelId: selectedChannel.value,
              });
              if (res.id) {
                setLoading(false);
                setIsOpen(false);
                toast.success("Form shared on discord");
              } else {
                setLoading(false);
                const errorMessage =
                  errorLookup[res.message]?.message || res.message;
                toast.error(errorMessage);
                logError("Error sharing form on discord", false);
              }
            }}
            loading={loading}
          >
            Share
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};
