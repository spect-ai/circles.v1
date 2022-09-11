import EditTag from "@/app/common/components/EditTag";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/registry";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Registry, Token } from "@/app/types";
import { Box, IconEth, Input, Stack, Tag, Text } from "degen";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalCard } from "../../../Project/CreateCardModal/hooks/LocalCardContext";

export type props = {
  templateId: string;
  propertyId: string;
};

function CardReward({ templateId, propertyId }: props) {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    onCardUpdate,
    fetchCardActions,
    card,
    cardId,
    properties,
    updatePropertyState,
    project,
  } = useLocalCard();
  const { canTakeAction } = useRoleGate();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const [template, setTemplate] = useState(templateId || "Task");
  const [propertyInProjectTemplate, setPropertyInProjectTemplate] = useState(
    project?.cardTemplates[templateId || "Task"].properties[propertyId]
  );
  const [localProperty, setLocalProperty] = useState(
    properties[propertyId].value
  );
  const cardProperty = properties[propertyId];

  useEffect(() => {
    if (properties[propertyId].value) {
      setLocalProperty(properties[propertyId].value);
    } else if (properties[propertyId].default) {
      setLocalProperty(properties[propertyId].default);
    }
  }, [properties]);

  return (
    <EditTag
      tourId="create-card-modal-reward"
      name={
        localProperty?.value && localProperty?.value !== 0
          ? `${localProperty?.value} ${localProperty?.token?.symbol}`
          : `No ${cardProperty?.name}`
      }
      modalTitle={`Set ${propertyInProjectTemplate?.name}`}
      label={`${propertyInProjectTemplate?.name}`}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={<IconEth color="accent" size="5" />}
      //disabled={!canTakeAction("cardReward")}
      handleClose={() => {
        if (
          parseFloat(localProperty?.value) !==
            card?.properties[propertyId]?.value?.value ||
          localProperty?.token.symbol !==
            card?.properties[propertyId]?.value?.token?.symbol ||
          localProperty?.chain.chainId !==
            card?.properties[propertyId]?.value?.chain?.chainId
        ) {
          void onCardUpdate();
          cardId && void fetchCardActions();
        }
        setModalOpen(false);
      }}
    >
      <Box height="96">
        <Box padding="8">
          <Stack>
            <Text size="extraLarge" weight="semiBold">
              Chain
            </Text>
            <Stack direction="horizontal" wrap>
              {getFlattenedNetworks(registry as Registry)?.map((aChain) => (
                <Box
                  key={aChain.name}
                  onClick={() => {
                    updatePropertyState("reward", {
                      ...localProperty,
                      chain: aChain,
                      token:
                        (registry &&
                          registry[aChain.chainId].tokenDetails["0x0"]) ||
                        ({} as Token),
                    });
                  }}
                  cursor="pointer"
                >
                  <Tag
                    hover
                    tone={
                      localProperty?.chain?.chainId === aChain.chainId
                        ? "accent"
                        : "secondary"
                    }
                  >
                    <Text
                      color={
                        localProperty?.chain?.chainId === aChain.chainId
                          ? "accent"
                          : "inherit"
                      }
                    >
                      {aChain.name}
                    </Text>
                  </Tag>
                </Box>
              ))}
            </Stack>
            <Text size="extraLarge" weight="semiBold">
              Token
            </Text>
            <Stack direction="horizontal" wrap>
              {getFlattenedCurrencies(
                registry as Registry,
                localProperty?.chain?.chainId
              ).map((aToken) => (
                <Box
                  key={aToken.address}
                  onClick={() => {
                    updatePropertyState("reward", {
                      ...localProperty,
                      token: aToken,
                    });
                  }}
                  cursor="pointer"
                >
                  <Tag
                    hover
                    tone={
                      localProperty?.token?.address === aToken.address
                        ? "accent"
                        : "secondary"
                    }
                  >
                    <Text
                      color={
                        localProperty?.token?.address === aToken.address
                          ? "accent"
                          : "inherit"
                      }
                    >
                      {aToken.symbol}
                    </Text>
                  </Tag>
                </Box>
              ))}
            </Stack>
            <Text size="extraLarge" weight="semiBold">
              Value
            </Text>
            <Input
              label=""
              units={localProperty?.token?.symbol}
              min={0}
              placeholder="10"
              type="number"
              value={localProperty?.value}
              onChange={(e) => {
                console.log(e.target.value);
                updatePropertyState("reward", {
                  ...localProperty,
                  value: e.target.value,
                });
              }}
            />
            {/* <Button width="full" size="small">
          Save
        </Button> */}
          </Stack>
        </Box>
      </Box>
    </EditTag>
  );
}

export default memo(CardReward);
