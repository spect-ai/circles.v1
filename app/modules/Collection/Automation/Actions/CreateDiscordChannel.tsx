import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { fetchGuildChannels, getGuildRoles } from "@/app/services/Discord";
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
  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
        }[]
      | undefined
    >();

  const { circle } = useCircle();
  const toggleSelectedRole = (roleId: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [roleId]: !selectedRoles[roleId],
    });
  };

  useEffect(() => {
    if (circle) {
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
      if (circle?.discordGuildId) void getGuildChannels();

      const fetchGuildRoles = async () => {
        const data = await getGuildRoles(circle?.discordGuildId);
        data && setDiscordRoles(data.roles);
        console.log({ data });
      };
      if (circle?.discordGuildId) void fetchGuildRoles();
    }
  }, [circle?.discordGuildId]);

  if (!circle?.discordGuildId)
    return (
      <Box
        width={{
          xs: "full",
          md: "1/2",
        }}
        onClick={() => {
          console.log({ origin });
          window.open(
            `https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
            "_blank"
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
            circleId: circle.id,
          },
        });
      }}
      width="full"
    >
      <Box marginBottom="2">
        <Text variant="label">Channel Category</Text>
      </Box>
      <Dropdown
        options={categoreyOptions}
        selected={selectedCategory}
        onChange={(value) => {
          setSelectedCategory(value);
        }}
        multiple={false}
      />
      <Box marginTop="2" marginBottom="2">
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
          if (collection.properties[value.value]) setChannelNameType("mapping");
          else setChannelNameType("value");
          setChannelName(value);
        }}
        multiple={false}
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

          {addResponder && (
            <Box marginTop="4" marginBottom="-4">
              <Editor
                value={
                  ":::tip\nEnsure you have a discord field added to your form which the user will use to connect their discord account."
                }
                disabled={true}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
