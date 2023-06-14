import Modal from "@/app/common/components/Modal";
import { Box, IconSearch, Input, Stack, Tag, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCircle } from "../Circle/CircleContext";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";
import DistributeERC20 from "./erc20";
import Ceramic from "./ceramic";
import SybilResistance from "./gtcpassport";
import RoleGate from "./guildxyz";
import SendKudos from "./mintkudos";
import Payments from "./payments";
import {
  PluginType,
  SpectPlugin,
  getGroupedPlugins,
  spectPlugins,
} from "./Plugins";
import { isWhitelisted } from "@/app/services/Whitelist";
import {
  getSurveyConditionInfo,
  getSurveyDistributionInfo,
} from "@/app/services/SurveyProtocol";
import Poap from "./poap";
import GoogleCaptcha from "./captcha";
import { matchSorter } from "match-sorter";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { CollectionType, UserType } from "@/app/types";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { toast } from "react-toastify";
import DiscordRoleGate from "./DiscordRole";
import Zealy from "./zealy";
import AddLookup from "./responderProfile/AddLookup";

type Props = {
  handleClose: () => void;
};

export const isPluginAdded = (
  pluginName: PluginType,
  collection: CollectionType
) => {
  switch (pluginName) {
    case "poap":
      return !!collection.formMetadata.poapEventId;
    case "guildxyz":
      return !!collection.formMetadata.formRoleGating?.length;
    case "gtcpassport":
      return collection.formMetadata.sybilProtectionEnabled === true;
    case "mintkudos":
      return !!collection.formMetadata.mintkudosTokenId;
    case "payments":
      return !!collection.formMetadata.paymentConfig;
    case "erc20":
      return !!(
        collection.formMetadata.surveyTokenId ||
        collection.formMetadata.surveyTokenId === 0
      );
    case "ceramic":
      return !!collection.formMetadata.ceramicEnabled;
    case "googleCaptcha":
      return collection.formMetadata.captchaEnabled === true;
    case "responderProfile":
      return (
        collection.formMetadata.lookup?.verifiedAddress === true ||
        !!collection.formMetadata.lookup?.tokens?.length ||
        collection.formMetadata.lookup?.communities === true
      );
    case "discordRole":
      return !!collection.formMetadata.discordRoleGating?.length;
    case "zealy":
      return !!collection.formMetadata.zealyXP;
    default:
      return false;
  }
};

export default function ViewPlugins({ handleClose }: Props) {
  const { mode } = useTheme();
  const { registry, circle } = useCircle();
  const { canDo } = useRoleGate();

  const [isPluginOpen, setIsPluginOpen] = useState(false);
  const [pluginOpen, setPluginOpen] = useState("");
  const [surveyConditions, setSurveyConditions] = useState<any>({});
  const [surveyDistributionInfo, setSurveyDistributionInfo] = useState<any>({});
  const { localCollection: collection } = useLocalCollection();

  const [filteredPlugins, setFilteredPlugins] = useState(
    Object.keys(spectPlugins)
  );
  const [showAdded, setShowAdded] = useState(false);
  const [zealySetupMode, setZealySetupMode] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { data: currentUser, refetch: fetchUser } = useQuery<UserType>(
    "getMyUser",
    {
      enabled: false,
    }
  );
  const groupedPlugins = getGroupedPlugins();
  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    updateFilteredPlugins(searchTerm, showAdded, selectedGroups);
  }, []);

  useEffect(() => {
    if (
      (collection.formMetadata.surveyTokenId ||
        collection.formMetadata.surveyTokenId === 0) &&
      registry
    ) {
      getSurveyConditionInfo(
        collection.formMetadata.surveyChain?.value || "80001",
        registry[collection.formMetadata.surveyChain?.value || "80001"]
          .surveyHubAddress,
        collection.formMetadata.surveyTokenId
      )
        .then((res) => {
          console.log({ res });
          if (res) {
            setSurveyConditions(res);
          }
        })
        .catch((err) => console.log({ err }));
      getSurveyDistributionInfo(
        collection.formMetadata.surveyChain?.value || "80001",
        registry[collection.formMetadata.surveyChain?.value || "80001"]
          .surveyHubAddress,
        collection.formMetadata.surveyTokenId
      )
        .then((res) => {
          console.log({ res });

          if (res) {
            setSurveyDistributionInfo(res);
          }
        })
        .catch((err) => console.log({ err }));
    }
  }, [collection]);

  const onClick = (pluginName: PluginType) => {
    switch (pluginName) {
      case "poap":
      case "guildxyz":
      case "gtcpassport":
      case "mintkudos":
      case "erc20":
      case "ceramic":
      case "googleCaptcha":
      case "responderProfile":
      case "discordRole":
        setIsPluginOpen(true);
        setPluginOpen(pluginName);
        break;
      case "payments":
        setIsPluginOpen(true);
        setPluginOpen(pluginName);
        break;
      case "zealy":
        if (!circle?.hasSetupZealy) {
          if (!canDo("manageCircleSettings")) {
            toast.error(
              "A steward must setup Zealy first before the plugin can be added."
            );
            return;
          } else {
            setZealySetupMode(true);
          }
        }
        setIsPluginOpen(true);
        setPluginOpen(pluginName);
      default:
        break;
    }
  };

  const updateFilteredPlugins = (
    searchTerm: string,
    showAdded: boolean,
    groups: string[]
  ) => {
    let filtered = matchSorter(Object.values(spectPlugins), searchTerm, {
      keys: ["name"],
    });
    filtered = filtered.filter((plugin) => {
      if (showAdded) {
        return isPluginAdded(plugin.id as PluginType, collection);
      } else {
        return true;
      }
    });
    filtered = filtered.filter((plugin) => {
      if (groups.length) {
        return plugin.groups.some((group) => groups.includes(group));
      } else {
        return true;
      }
    });
    setFilteredPlugins(filtered.map((p) => p.id));
  };

  return (
    <>
      <Modal
        handleClose={handleClose}
        title="Plugins"
        size="large"
        key="plugins"
        height="90vh"
      >
        <Box
          padding={{
            xs: "4",
            md: "8",
          }}
        >
          <Stack direction="horizontal" wrap>
            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
              space="4"
              align="flex-start"
            >
              <Input
                placeholder="Search"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateFilteredPlugins(
                    e.target.value,
                    showAdded,
                    selectedGroups
                  );
                }}
                label=""
                width="1/2"
                prefix={<IconSearch size="4" />}
              />

              <Stack direction="horizontal" space="2" wrap>
                <GroupTag
                  mode={mode}
                  selected={showAdded}
                  cursor="pointer"
                  onClick={() => {
                    setShowAdded(!showAdded);
                    updateFilteredPlugins(
                      searchTerm,
                      !showAdded,
                      selectedGroups
                    );
                  }}
                >
                  <Text>Show Added</Text>
                </GroupTag>
                {Object.keys(groupedPlugins).map((group) => (
                  <GroupTag
                    mode={mode}
                    selected={selectedGroups.includes(group)}
                    onClick={() => {
                      let groups = [...selectedGroups];
                      if (groups.includes(group)) {
                        groups = groups.filter((g) => g !== group);
                      } else {
                        groups.push(group);
                      }
                      setSelectedGroups(groups);
                      updateFilteredPlugins(searchTerm, showAdded, groups);
                    }}
                    cursor="pointer"
                  >
                    <Text>{group}</Text>
                  </GroupTag>
                ))}
              </Stack>
            </Stack>
            {/* <Stack direction="horizontal" wrap space="4"> */}
            {filteredPlugins.map((pluginName) => (
              <PluginCard
                key={pluginName}
                plugin={spectPlugins[pluginName]}
                onClick={async () => {
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track(`${pluginName} plugin open`, {
                      collection: collection.slug,
                      circle: collection.parents[0].slug,
                      user: currentUser?.username,
                    });
                  if (pluginName === "erc20") {
                    const res = await isWhitelisted("Survey Protocol");
                    if (!res) {
                      window.open(
                        "https://circles.spect.network/r/9991d6ed-f3c8-425a-8b9e-0f598514482c",
                        "_blank"
                      );
                    } else {
                      onClick(pluginName as PluginType);
                    }
                  } else {
                    onClick(pluginName as PluginType);
                  }
                }}
                added={isPluginAdded(pluginName as PluginType, collection)}
              />
            ))}
            {/* </Stack> */}
          </Stack>
        </Box>
      </Modal>
      <AnimatePresence>
        {isPluginOpen && pluginOpen === "guildxyz" && (
          <RoleGate handleClose={() => setIsPluginOpen(false)} key="guildxyz" />
        )}
        {isPluginOpen && pluginOpen === "gtcpassport" && (
          <SybilResistance
            handleClose={() => setIsPluginOpen(false)}
            key="gtcpassport"
          />
        )}
        {isPluginOpen && pluginOpen === "mintkudos" && (
          <SendKudos
            handleClose={() => setIsPluginOpen(false)}
            key="mintkudos"
          />
        )}
        {isPluginOpen && pluginOpen === "payments" && (
          <Payments handleClose={() => setIsPluginOpen(false)} key="payments" />
        )}

        {isPluginOpen && pluginOpen === "erc20" && (
          <DistributeERC20
            handleClose={() => setIsPluginOpen(false)}
            key="erc20"
            distributionInfo={surveyDistributionInfo}
            conditionInfo={surveyConditions}
          />
        )}
        {isPluginOpen && pluginOpen === "ceramic" && (
          <Ceramic handleClose={() => setIsPluginOpen(false)} key="ceramic" />
        )}
        {isPluginOpen && pluginOpen === "poap" && (
          <Poap handleClose={() => setIsPluginOpen(false)} key="poap" />
        )}
        {isPluginOpen && pluginOpen === "googleCaptcha" && (
          <GoogleCaptcha
            handleClose={() => setIsPluginOpen(false)}
            key="googleCaptcha"
          />
        )}
        {isPluginOpen && pluginOpen === "responderProfile" && (
          <AddLookup
            handleClose={() => setIsPluginOpen(false)}
            key="responderProfile"
          />
        )}
        {isPluginOpen && pluginOpen === "discordRole" && (
          <DiscordRoleGate
            handleClose={() => setIsPluginOpen(false)}
            key="discordRole"
          />
        )}
        {isPluginOpen && pluginOpen === "zealy" && (
          <Zealy
            handleClose={() => setIsPluginOpen(false)}
            setupMode={zealySetupMode}
            setSetupMode={setZealySetupMode}
            key="zealy"
          />
        )}
      </AnimatePresence>
    </>
  );
}

const PluginCard = ({
  plugin,
  onClick,
  added,
}: {
  plugin: SpectPlugin;
  onClick: () => void;
  added?: boolean;
}) => {
  return (
    <PluginContainer
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ position: "relative" }}
    >
      {added && (
        <PluginAdded>
          <Text color="accent" size="large" weight="semiBold">
            Added
          </Text>
        </PluginAdded>
      )}
      <PluginImage src={plugin.image} />
      <Box
        padding={{
          xs: "2",
          md: "4",
        }}
      >
        <Stack>
          <Text weight="bold" align="center">
            {plugin.name}
          </Text>
          <Text size="extraSmall" align="center">
            {plugin.description}
          </Text>
          {/* <a href={plugin.docs} target="_blank">
            <Text color="accent">View Docs</Text>
          </a> */}
        </Stack>
      </Box>
    </PluginContainer>
  );
};

const PluginContainer = styled(motion.div)`
  @media (max-width: 768px) {
    width: calc(100% / 2 - 0.5rem);
  }
  width: calc(100% / 3 - 1rem);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

const PluginImage = styled.img`
  width: 100%;
  height: 14rem;
  object-fit: cover;
  border-radius: 1rem 1rem 0 0;

  @media (max-width: 768px) {
    height: 7rem;
  }
`;

const PluginAdded = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0 1rem 0 1rem;
`;

export const GroupTag = styled(Box)<{ mode: string; selected: boolean }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.selected
        ? "rgb(191, 90, 242)"
        : props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.5rem 0.8rem;
  justify-content: center;
  align-items: center;
  overflow: auto;
  height: 2.5rem;
`;
