import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconPlug, IconSearch, Input, Stack, Tag, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getSurveyConditionInfo,
  getSurveyDistributionInfo,
} from "@/app/services/SurveyProtocol";
import { matchSorter } from "match-sorter";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { ConditionInfo, DistributionInfo, UserType } from "@/app/types";
import isWhitelisted from "@/app/services/Whitelist";
import { useCircle } from "../Circle/CircleContext";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";
import DistributeERC20 from "./erc20";
import Ceramic from "./ceramic";
import SybilResistance from "./gtcpassport";
import RoleGate from "./guildxyz";
import SendKudos from "./mintkudos";
import Payments from "./payments";
import { PluginType, SpectPlugin, spectPlugins } from "./Plugins";
import Poap from "./poap";
import GoogleCaptcha from "./captcha";
import ResponderProfile from "./responderProfile";

const PluginContainer = styled(motion.div)`
  @media (max-width: 768px) {
    width: calc(100% / 2 - 1rem);
  }
  @media (max-width: 480px) {
    width: 100%;
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
`;

const PluginAdded = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0 1rem 0 1rem;
`;

const PluginCard = ({
  plugin,
  onClick,
  added,
}: {
  plugin: SpectPlugin;
  onClick: () => void;
  added?: boolean;
}) => (
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
    <Box padding="4">
      <Stack>
        <Text weight="bold">{plugin.name}</Text>
        <Text size="extraSmall">{plugin.description}</Text>
        {/* <a href={plugin.docs} target="_blank">
            <Text color="accent">View Docs</Text>
          </a> */}
      </Stack>
    </Box>
  </PluginContainer>
);

PluginCard.defaultProps = {
  added: false,
};

const ViewPlugins = () => {
  const { registry } = useCircle();
  const [isOpen, setIsOpen] = useState(false);
  const [isPluginOpen, setIsPluginOpen] = useState(false);
  const [pluginOpen, setPluginOpen] = useState("");
  const [surveyConditions, setSurveyConditions] = useState<ConditionInfo>();
  const [surveyDistributionInfo, setSurveyDistributionInfo] =
    useState<DistributionInfo>();
  const { localCollection: collection } = useLocalCollection();

  const [searchText, setSearchText] = useState("");
  const [filteredPlugins, setFilteredPlugins] = useState(
    Object.keys(spectPlugins)
  );
  const [showAdded, setShowAdded] = useState(false);
  const [numPluginsAdded, setNumPlugnsAdded] = useState(0);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  useEffect(() => {
    setFilteredPlugins(Object.keys(spectPlugins));
  }, []);

  useEffect(() => {
    if (isOpen) {
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
            if (res) {
              setSurveyConditions(res);
            }
          })
          .catch((err) => console.error({ err }));
        getSurveyDistributionInfo(
          collection.formMetadata.surveyChain?.value || "80001",
          registry[collection.formMetadata.surveyChain?.value || "80001"]
            .surveyHubAddress,
          collection.formMetadata.surveyTokenId
        )
          .then((res) => {
            if (res) {
              setSurveyDistributionInfo(res);
            }
          })
          .catch((err) => console.error({ err }));
      }
    }
  }, [isOpen, collection]);

  const onClick = (pluginName: PluginType) => {
    switch (pluginName) {
      case "poap":
      case "guildxyz":
      case "gtcpassport":
      case "mintkudos":
      case "payments":
      case "erc20":
      case "ceramic":
      case "googleCaptcha":
      case "responderProfile":
        setIsPluginOpen(true);
        setPluginOpen(pluginName);
        break;
      default:
        break;
    }
  };

  const isPluginAdded = (pluginName: PluginType) => {
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
        return collection.formMetadata.allowAnonymousResponses === false;
      default:
        return false;
    }
  };

  useEffect(() => {
    setNumPlugnsAdded(
      Object.keys(spectPlugins).filter((pluginName) =>
        isPluginAdded(pluginName as PluginType)
      )?.length
    );
  }, [collection.formMetadata]);

  return (
    <Box>
      <PrimaryButton
        variant="tertiary"
        onClick={() => {
          process.env.NODE_ENV === "production" &&
            mixpanel.track("Add Plugins", {
              collection: collection.slug,
              circle: collection.parents[0].slug,
              user: currentUser?.username,
            });

          setIsOpen(true);
        }}
        icon={<IconPlug color="text" />}
      >
        {numPluginsAdded > 0
          ? ` Plugins (${numPluginsAdded} added)`
          : "Add Plugins"}
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Plugins"
            size="large"
            key="plugins"
          >
            <Box padding="8">
              <Stack>
                <Stack direction="horizontal" space="4" align="center">
                  <Input
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      const filtered = matchSorter(
                        Object.values(spectPlugins),
                        e.target.value,
                        {
                          keys: ["name", "id", "tags"],
                        }
                      );
                      setFilteredPlugins(filtered.map((p) => p.id));
                    }}
                    label=""
                    width="1/2"
                    prefix={<IconSearch size="4" />}
                  />
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      if (!showAdded) {
                        setFilteredPlugins(
                          Object.keys(spectPlugins).filter((pluginName) =>
                            isPluginAdded(pluginName as PluginType)
                          )
                        );
                      } else {
                        setFilteredPlugins(Object.keys(spectPlugins));
                      }
                      setShowAdded(!showAdded);
                    }}
                  >
                    <Tag tone={showAdded ? "accent" : "secondary"} hover>
                      {showAdded ? "Show All" : "Show Added"}
                    </Tag>
                  </Box>
                </Stack>
                <Stack direction="horizontal" wrap space="4">
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
                      added={isPluginAdded(pluginName as PluginType)}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
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
          <ResponderProfile
            handleClose={() => setIsPluginOpen(false)}
            key="responderProfile"
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ViewPlugins;
