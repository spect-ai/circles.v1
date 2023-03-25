import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
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
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import CheckBox from "@/app/common/components/Table/Checkbox";
import CreatableDropdown from "@/app/common/components/CreatableDropdown";
import Editor from "@/app/common/components/Editor";
import { useLocation } from "react-use";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function CreateDiscordChannel({
  setAction,
  actionMode,
  action,
  collection,
}: Props) {
  const { origin } = useLocation();
  const [channelName, setChannelName] = useState(
    action?.data?.channelName || ""
  );
  const [categoreyOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option>(
    action?.data?.channelCategory || {}
  );
  const [channelNameType, setChannelNameType] = useState<"mapping" | "value">(
    action?.data?.channelNameType || "value"
  );
  const [isPrivate, setIsPrivate] = useState(action?.data?.isPrivate || false);
  const [addResponder, setAddResponder] = useState(
    action?.data?.addResponder || false
  );
  const [selectedRoles, setSelectedRoles] = useState(
    (action.data?.rolesToAdd || {}) as { [roleId: string]: boolean }
  );
  const [addStakeholder, setAddStakeholder] = useState(
    action?.data?.addStakeholder || false
  );
  const [stakeholdersToAdd, setStakeholdersToAdd] = useState(
    action?.data?.stakeholdersToAdd || []
  );
  const [discordIsConnected, setDiscordIsConnected] = useState(false);
  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
        }[]
      | undefined
    >();

  const { circle, justAddedDiscordServer } = useCircle();
  const toggleSelectedRole = (roleId: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [roleId]: !selectedRoles[roleId],
    });
  };

  useEffect(() => {
    if (circle?.discordGuildId) {
      const discordIsConnected = async () => {
        const res = await guildIsConnected(circle?.discordGuildId);
        setDiscordIsConnected(res);
      };
      void discordIsConnected();
    }
  }, [circle?.discordGuildId, justAddedDiscordServer]);

  useEffect(() => {
    if (!discordIsConnected || !circle?.discordGuildId) return;
    const getGuildChannels = async () => {
      const data = await fetchGuildChannels(
        circle?.discordGuildId,
        "GUILD_CATEGORY"
      );
      const categoryOptions = data.guildChannels?.map((channel: any) => ({
        label: channel.name,
        value: channel.id,
      }));
      setCategoryOptions(categoryOptions);
    };
    void getGuildChannels();

    const fetchGuildRoles = async () => {
      const data = await getGuildRoles(circle?.discordGuildId);
      data && setDiscordRoles(data.roles);
      console.log({ data });
    };
    void fetchGuildRoles();
  }, [discordIsConnected]);

  const toggleSelectedProperty = (propertyName: string) => {
    setStakeholdersToAdd(
      stakeholdersToAdd.includes(propertyName)
        ? stakeholdersToAdd.filter((p: string) => p !== propertyName)
        : [...stakeholdersToAdd, propertyName]
    );
  };

  if (!discordIsConnected)
    return (
      <Box
        width="48"
        paddingTop="4"
        onClick={() => {
          window.open(
            `https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}`,
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
            channelName,
            channelCategory: selectedCategory,
            channelNameType,
            isPrivate: isPrivate,
            addResponder: addResponder,
            rolesToAdd: selectedRoles,
            addStakeholder,
            stakeholdersToAdd,
            circleId: circle?.id,
          },
        });
      }}
      width="full"
    >
      <Box marginBottom="2">
        <Text variant="label">Channel Name</Text>
      </Box>
      <CreatableDropdown
        options={
          Object.entries(collection.properties)
            .filter(([propertyId, property]) => property.type === "shortText")
            .map(([propertyId, property]) => ({
              label: `Map from value in "${property.name}"`,
              value: property.name,
            })) || []
        }
        selected={channelName}
        onChange={(value) => {
          if (collection.properties[value?.value])
            setChannelNameType("mapping");
          else setChannelNameType("value");
          setChannelName(value);
        }}
        multiple={false}
        portal={false}
      />
      <Box marginTop="2">
        <Text variant="label">Channel Category</Text>
      </Box>
      <Dropdown
        options={categoreyOptions}
        selected={selectedCategory}
        onChange={(value) => {
          setSelectedCategory(value);
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
          }}
        />
        <Text variant="base">Private Channel</Text>
      </Box>
      {isPrivate && (
        <>
          <Box marginTop="4" marginBottom="2">
            <Text variant="label">Pick who to add to private channel</Text>
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
            })}{" "}
          </Stack>
          {collection.collectionType === 0 && (
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

          {addResponder && (
            <Box marginTop="4" marginBottom="-4">
              <Editor
                value={
                  ":::tip\nEnsure you have a discord field in your form which the user will use to connect their discord account."
                }
                disabled={true}
              />
            </Box>
          )}
          {collection.collectionType === 1 && (
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
                Add stakeholders from cards dynamically
              </Text>
            </Box>
          )}

          {addStakeholder &&
            !Object.values(collection.properties)?.some((p) =>
              ["user", "user[]"].includes(p.type)
            ) && (
              <Box marginTop="4" marginBottom="2">
                <Text variant="small" color="yellow">
                  {`Looks like there are no user fields in ${collection.name} currently. Please add a field of type "user" or "user[]" to add stakeholders dynamically.`}
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
        </>
      )}
    </Box>
  );
}
