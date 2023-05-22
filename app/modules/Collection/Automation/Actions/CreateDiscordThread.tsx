import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import {
  fetchGuildChannels,
  getGuildRoles,
  guildIsConnected,
} from "@/app/services/Discord";
import { Action, CollectionType, Option } from "@/app/types";
import { Box, Input, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import { useLocation } from "react-use";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import Dropdown from "@/app/common/components/Dropdown";
import CreatableDropdown from "@/app/common/components/CreatableDropdown";
import Editor from "@/app/common/components/Editor";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { linkDiscord } from "@/app/services/Collection";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { logError } from "@/app/common/utils/utils";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
  manualAction?: boolean;
  handleClose?: () => void;
};

export default function CreateDiscordThread({
  setAction,
  actionMode,
  action,
  collection,
  manualAction,
  handleClose,
}: Props) {
  const { origin } = useLocation();
  const { setLocalCollection, localCollection } = useLocalCollection();
  const router = useRouter();
  const [linking, setLinking] = useState(false);
  const [threadName, setThreadName] = useState(action?.data?.threadName || "");
  const [channelOptions, setChannelOptions] = useState<Option[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Option>(
    action?.data?.selectedChannel || {}
  );
  const [threadNameType, setThreadNameType] = useState<"mapping" | "value">(
    action?.data?.threadNameType || "value"
  );
  const [addResponder, setAddResponder] = useState(
    action?.data?.addResponder || false
  );
  const [addStakeholder, setAddStakeholder] = useState(
    action?.data?.addStakeholder || false
  );
  const [stakeholdersToAdd, setStakeholdersToAdd] = useState(
    action?.data?.stakeholdersToAdd || []
  );
  const [selectedRoles, setSelectedRoles] = useState(
    (action.data?.rolesToAdd || {}) as { [roleId: string]: boolean }
  );
  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
        }[]
      | undefined
    >();
  const [isPrivate, setIsPrivate] = useState(action?.data?.isPrivate || false);
  const [addDiscordRoles, setAddDiscordRoles] = useState(
    Object.values(action?.data?.rolesToAdd || {}).some((r) => r)
  );
  const [discordIsConnected, setDiscordIsConnected] = useState(false);

  const { circle, justAddedDiscordServer } = useCircle();
  const toggleSelectedRole = (roleId: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [roleId]: !selectedRoles[roleId],
    });
  };

  const toggleSelectedProperty = (propertyName: string) => {
    setStakeholdersToAdd(
      stakeholdersToAdd.includes(propertyName)
        ? stakeholdersToAdd.filter((p: string) => p !== propertyName)
        : [...stakeholdersToAdd, propertyName]
    );
  };

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
          false,
          [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessagesInThreads,
            PermissionFlagsBits.CreatePublicThreads,
            PermissionFlagsBits.CreatePrivateThreads,
          ]
        );
        const channelOptions = channels?.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }));
        setChannelOptions(channelOptions);
      };
      void getGuildChannels();

      const fetchGuildRoles = async () => {
        const roles = await getGuildRoles(circle?.discordGuildId, true);
        roles && setDiscordRoles(roles);
      };
      void fetchGuildRoles();
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
    );
  return (
    <Box
      marginTop="2"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            threadName,
            selectedChannel,
            threadNameType,
            isPrivate,
            rolesToAdd: selectedRoles,
            addResponder,
            addStakeholder,
            stakeholdersToAdd,
            circleId: circle?.id,
          },
        });
      }}
      width="full"
    >
      {" "}
      <Box marginTop="2" marginBottom="2">
        <Text variant="label">Thread Name</Text>
      </Box>
      {!manualAction && (
        <CreatableDropdown
          placeholder="Select a field to map from or enter any custom value..."
          options={
            Object.entries(collection.properties)
              .filter(([propertyId, property]) => property.type === "shortText")
              .map(([propertyId, property]) => ({
                label: `Map from value in "${property.name}"`,
                value: property.id,
              })) || []
          }
          selected={threadName}
          onChange={(value) => {
            if (collection.properties[value?.value])
              setThreadNameType("mapping");
            else setThreadNameType("value");
            setThreadName(value);
          }}
          multiple={false}
          portal={false}
        />
      )}
      {manualAction && (
        <Input
          label
          hideLabel
          onChange={(e) => {
            setThreadName(e.target.value);
            setThreadNameType("value");
          }}
          value={threadName}
          placeholder="Card Name or whatever else"
        />
      )}
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
        portal={false}
      />
      <Box
        display="flex"
        flexDirection="row"
        gap="2"
        justifyContent="flex-start"
        alignItems="center"
        marginTop="2"
      >
        <CheckBox
          isChecked={isPrivate}
          onClick={() => {
            setIsPrivate(!isPrivate);
            setSelectedRoles({});
            setStakeholdersToAdd([]);
            setAddDiscordRoles(false);
            setAddStakeholder(false);
          }}
        />
        <Text variant="base">Private Thread</Text>
      </Box>
      <Box marginLeft="4">
        {isPrivate && (
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
            marginTop="2"
          >
            <CheckBox
              isChecked={addDiscordRoles}
              onClick={() => {
                setAddDiscordRoles(!addDiscordRoles);
              }}
            />
            <Text variant="small">Add Discord role holders to thread</Text>
          </Box>
        )}
        {isPrivate && addDiscordRoles && (
          <>
            <Box marginTop="4" marginBottom="2">
              <Text variant="label">Pick who to add to private thread</Text>
            </Box>
            <Stack direction="horizontal" wrap>
              {discordRoles?.map((role) => {
                return (
                  <Box
                    key={role.id}
                    cursor="pointer"
                    onClick={() => toggleSelectedRole(role.id)}
                  >
                    {selectedRoles[role.id] ? (
                      <Tag tone={"accent"} hover>
                        <Box paddingX="2">{role.name}</Box>
                      </Tag>
                    ) : (
                      <Tag hover>
                        <Box paddingX="2">{role.name}</Box>
                      </Tag>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </>
        )}
        {isPrivate && collection.collectionType === 0 && (
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
            marginTop="4"
          >
            <CheckBox
              isChecked={addResponder}
              onClick={() => {
                setAddResponder(!addResponder);
              }}
            />
            <Text variant="small">Add Responder</Text>
          </Box>
        )}
        {isPrivate && addResponder && (
          <Box marginTop="4" marginBottom="-4">
            <Editor
              value={
                ":::tip\nEnsure you have a discord field in your form which the user will use to connect their discord account."
              }
              disabled={true}
              version={1}
            />
          </Box>
        )}
        {isPrivate && collection.collectionType === 1 && (
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
            marginTop="4"
          >
            <CheckBox
              isChecked={addStakeholder}
              onClick={() => {
                setAddStakeholder(!addStakeholder);
              }}
            />
            <Text variant="small">
              {manualAction
                ? `Add stakeholders from this card`
                : `Add stakeholders from cards dynamically`}
            </Text>
          </Box>
        )}
        {addStakeholder &&
          isPrivate &&
          !Object.values(collection.properties)?.some((p) =>
            ["user", "user[]"].includes(p.type)
          ) && (
            <Box marginTop="4" marginBottom="2">
              <Text variant="small" color="yellow">
                {`Looks like there are no user fields in "${collection.name}" currently. Please add a field of type "Single User" or "Multi User" to add stakeholders dynamically.`}
              </Text>
            </Box>
          )}
        {addStakeholder &&
          isPrivate &&
          Object.values(collection.properties)?.some((p) =>
            ["user", "user[]"].includes(p.type)
          ) && (
            <>
              <Box marginTop="4" marginBottom="2">
                <Text variant="label">
                  Pick stakeholders to add to private thread from the user
                  fields in the collection
                </Text>
              </Box>
              <Stack direction="horizontal" wrap>
                {Object.values(collection.properties)
                  ?.filter((p) => ["user", "user[]"].includes(p.type))
                  ?.map((p) => {
                    return (
                      <Box
                        key={p.name}
                        cursor="pointer"
                        onClick={() => toggleSelectedProperty(p.name)}
                      >
                        {stakeholdersToAdd.includes(p.name) ? (
                          <Tag tone={"accent"} hover>
                            <Box paddingX="2">{p.name}</Box>
                          </Tag>
                        ) : (
                          <Tag hover>
                            <Box paddingX="2">{p.name}</Box>
                          </Tag>
                        )}
                      </Box>
                    );
                  })}
              </Stack>
            </>
          )}
      </Box>
      {manualAction && (
        <Box
          display="flex"
          flexDirection="row"
          gap="2"
          justifyContent="flex-end"
          alignItems="center"
          marginTop="4"
        >
          {" "}
          <Box width="48">
            <PrimaryButton
              loading={linking}
              onClick={async () => {
                setLinking(true);

                try {
                  const res = await linkDiscord(
                    collection.id,
                    router.query.cardSlug as string,
                    {
                      threadName,
                      selectedChannel,
                      isPrivate,
                      rolesToAdd: selectedRoles,
                      stakeholdersToAdd,
                    }
                  );
                  if (!res.error) {
                    setLocalCollection(res);
                    if (handleClose) handleClose();
                  }
                } catch (e) {
                  logError("Something went wrong while linking discord");
                  console.log(e);
                }
                setLinking(false);
              }}
            >
              Link Thread
            </PrimaryButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
