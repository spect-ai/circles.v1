import CheckBox from "@/app/common/components/Table/Checkbox";
import { useGlobal } from "@/app/context/globalContext";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { updateFormCollection } from "@/app/services/Collection";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

const Input = styled.input`
  background-color: transparent;
  border: none;
  margin: 0.4rem;
  padding: 0.4rem;
  display: flex;
  border-style: none;
  border-color: transparent;
  border-radius: 0.4rem;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
`;

export function AdditionalSettings() {
  const [multipleResponsesAllowed, setMultipleResponsesAllowed] =
    useState(false);
  const [anonymousResponsesAllowed, setAnonymousResponsesAllowed] =
    useState(false);
  const [updatingResponseAllowed, setUpdatingResponseAllowed] = useState(false);
  const [active, setActive] = useState(false);
  const [walletConnectionRequired, setWalletConnectionRequired] =
    useState(true);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { localCircle: circle } = useCircle();
  const { connectedUser } = useGlobal();

  useEffect(() => {
    setMultipleResponsesAllowed(
      collection.formMetadata.multipleResponsesAllowed
    );
    setUpdatingResponseAllowed(collection.formMetadata.updatingResponseAllowed);
    setActive(collection.formMetadata.active);
    setAnonymousResponsesAllowed(
      collection.formMetadata.allowAnonymousResponses === undefined
        ? false
        : collection.formMetadata.allowAnonymousResponses
    );
    setWalletConnectionRequired(
      collection.formMetadata.walletConnectionRequired
    );
  }, [collection]);

  const automationsMappedToResponder = circle?.automationsIndexedByCollection?.[
    collection?.slug
  ]?.map((a) => {
    return circle?.automations?.[a]?.actions?.find((action) =>
      action?.data?.values?.find((val: any) => val?.type === "responder")
    );
  });

  return (
    <>
      <Text variant="label">Form Settings</Text>
      <Stack direction="vertical" space="4">
        <Box display="flex" flexDirection="column" gap="1">
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              isChecked={multipleResponsesAllowed}
              onClick={async () => {
                if (connectedUser) {
                  setMultipleResponsesAllowed(!multipleResponsesAllowed);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      multipleResponsesAllowed: !multipleResponsesAllowed,
                    },
                  });

                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">Allow multiple responses</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              isChecked={updatingResponseAllowed}
              onClick={async () => {
                if (connectedUser) {
                  setUpdatingResponseAllowed(!updatingResponseAllowed);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      updatingResponseAllowed: !updatingResponseAllowed,
                    },
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">
              Allow changing responses after submission
            </Text>
          </Box>
          {/* <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              isChecked={anonymousResponsesAllowed}
              onClick={async () => {
                if (connectedUser) {
                  setAnonymousResponsesAllowed(!anonymousResponsesAllowed);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      allowAnonymousResponses: !anonymousResponsesAllowed,
                    },
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
              disabled={
                !!collection.formMetadata?.mintkudosTokenId ||
                !!collection.formMetadata?.numOfKudos ||
                automationsMappedToResponder?.filter((a) => a !== undefined)
                  ?.length > 0
              }
            />
            <Text
              variant="base"
              color={
                !!collection.formMetadata?.mintkudosTokenId ||
                !!collection.formMetadata?.numOfKudos ||
                automationsMappedToResponder?.filter((a) => a !== undefined)
                  ?.length > 0
                  ? "textTertiary"
                  : "text"
              }
            >
              Allow users to submit responses anonymously
            </Text>
            {(!!collection.formMetadata?.mintkudosTokenId ||
              !!collection.formMetadata?.numOfKudos ||
              automationsMappedToResponder?.filter((a) => a !== undefined)
                ?.length > 0) && (
              <Tooltip title="Allowing anonymous responses isn't possible when you map users in automations or send them kudos">
                <InfoCircleOutlined style={{ color: "gray" }} />
              </Tooltip>
            )}
          </Box> */}
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              // Necessary for backward compatibility
              isChecked={active === false}
              onClick={async () => {
                if (connectedUser) {
                  const a = !active;
                  setActive(a);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      active: a,
                    },
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">Stop accepting responses on this form</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              isChecked={walletConnectionRequired}
              onClick={async () => {
                if (connectedUser) {
                  if (collection.formMetadata.sybilProtectionEnabled) {
                    toast.error(
                      "Wallet connection is required for Sybil protection, disable that plugin in the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata.ceramicEnabled) {
                    toast.error(
                      "Wallet connection is required for Ceramic, disable that plugin in the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata.paymentConfig) {
                    toast.error(
                      "Wallet connection is required for payments, disable that plugin in the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata?.mintkudosTokenId) {
                    toast.error(
                      "Wallet connection is required for Kudos, disable that plugin in the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata.formRoleGating) {
                    toast.error(
                      "Wallet connection is required for Role Gating, disable that plugin in the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata.surveyTokenId) {
                    toast.error(
                      "Wallet connection is required for Survey, disable that plugin tin the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata.poapDistributionEnabled) {
                    toast.error(
                      "Wallet connection is required for POAP, disable that plugin in the plugins section to disable wallet connection"
                    );
                    return;
                  }
                  if (collection.formMetadata)
                    setWalletConnectionRequired(!walletConnectionRequired);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      walletConnectionRequired: !walletConnectionRequired,
                    },
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">
              Require responders to connect wallet to fill the form
            </Text>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
