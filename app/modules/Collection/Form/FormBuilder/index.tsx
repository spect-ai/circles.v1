/* eslint-disable @typescript-eslint/unbound-method */
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { CoverImage } from "@/app/modules/PublicForm";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Button, FileInput, Stack, Tag, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";
import Stepper from "@/app/common/components/Stepper";
import { FormType, GuildRole, Stamp } from "@/app/types";
import { toast } from "react-toastify";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import { getAllCredentials } from "@/app/services/Credentials/AggregatedCredentials";
import CollectPayment from "@/app/modules/PublicForm/Fields/CollectPayment";
import { BiLogIn } from "react-icons/bi";
import CollectPage from "./CollectPage";
import BuilderStartPage from "./StartPage/Builder";
import SubmittedPage from "./SubmittedPage";
import FieldComponent from "../Field";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import AddField from "../../AddField";

const StampScrollContainer = styled(Box)`
  overflow-y: auto;
  height: 10rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Container = styled(Box)`
  overflow-y: auto;
  padding: 2rem 15%;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: -10rem;

  @media (max-width: 768px) {
    padding: 0rem 5%;
    margin-top: -16rem;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 2rem 10%;
    margin-top: -12rem;
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: 2rem 15%;
    margin-top: -10rem;
  }
`;

const CoverImageButtonContainer = styled(Box)`
  margin-bottom: -2rem;
`;

const FormBuilderContainer = styled(Box)`
  min-height: calc(100vh - 20rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;
const StampCard = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormBuilder = () => {
  const {
    localCollection: collection,
    updateCollection,
    currentPage,
    setCurrentPage,
  } = useLocalCollection();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  const [cover, setCover] = useState(collection.formMetadata?.cover || "");
  const [logo] = useState(collection.formMetadata?.logo || "");

  const [connectedUser] = useAtom(connectedUserAtom);

  const [formData, setFormData] = useState<Record<string, unknown>>();
  const { pages } = collection.formMetadata;
  const { pageOrder } = collection.formMetadata;

  const [hasStamps] = useState<Record<string, boolean>>();
  const [currentScore] = useState(0);
  const [stamps, setStamps] = useState([] as Stamp[]);

  const addStamps = async (form: FormType) => {
    const stamps2: Stamp[] = await getAllCredentials();
    const stampsWithScore: Stamp[] = [];
    if (
      form.formMetadata.sybilProtectionEnabled &&
      form.formMetadata.sybilProtectionScores
    ) {
      stamps2.forEach((stamp) => {
        if (
          form.formMetadata.sybilProtectionScores &&
          form.formMetadata.sybilProtectionScores[stamp.id]
        ) {
          const stampWithScore = {
            ...stamp,
            score: form.formMetadata.sybilProtectionScores[stamp.id],
          };
          stampsWithScore.push(stampWithScore);
        }
      });
      setStamps(stampsWithScore.sort((a, b) => b.score - a.score));
    }
  };

  const { mode } = useTheme();

  useEffect(() => {
    if (connectedUser) {
      addStamps(collection);
    }
  }, [connectedUser]);

  return (
    <>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
        {isAddFieldOpen && (
          <AddField handleClose={() => setIsAddFieldOpen(false)} />
        )}
      </AnimatePresence>
      <Box
        paddingX={{
          xs: "1",
          md: "2",
        }}
      >
        <CoverImageButtonContainer>
          <FileInput
            onChange={async (file) => {
              const res = await storeImage(file);
              setCover(res.imageGatewayURL);
              if (connectedUser) {
                const newCollection = await updateFormCollection(
                  collection.id,
                  {
                    formMetadata: {
                      ...collection.formMetadata,
                      cover: res.imageGatewayURL,
                    },
                  }
                );
                if (!newCollection.id) {
                  toast.error(
                    "Error updating collection, refresh and try again"
                  );
                } else updateCollection(newCollection);
              }
            }}
          >
            {() => (
              <ClickableTag
                style={{ marginLeft: "1rem" }}
                onClick={() => {}}
                name={logo ? "Change Cover" : "Add Cover"}
              />
            )}
          </FileInput>
        </CoverImageButtonContainer>
        <CoverImage src={cover} backgroundColor="accentSecondary" />
        <Container>
          <Box
            backgroundColor="background"
            borderRadius="2xLarge"
            padding="8"
            display="flex"
            flexDirection="column"
            style={{
              minHeight: "calc(100vh - 20rem)",
            }}
          >
            <Stack align="center">
              <Stepper
                steps={pageOrder.length}
                currentStep={pageOrder.indexOf(currentPage)}
                onStepChange={(step) => {
                  setCurrentPage(pageOrder[step]);
                }}
              />
              <Box marginBottom="4" />
            </Stack>
            <Droppable droppableId="activeFields" type="field">
              {(provided) => {
                if (currentPage === "start") {
                  return <BuilderStartPage setCurrentPage={setCurrentPage} />;
                }
                if (currentPage === "connect") {
                  return (
                    <Box
                      style={{
                        height: "calc(100vh - 20rem)",
                      }}
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <motion.div
                        className="box"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5,
                          ease: [0, 0.71, 0.2, 1.01],
                        }}
                      >
                        {!collection.formMetadata.hasRole &&
                          collection.formMetadata.formRoleGating && (
                            <Box
                              display="flex"
                              flexDirection="column"
                              padding="4"
                              marginTop="4"
                              gap="4"
                            >
                              {" "}
                              <Text weight="bold">
                                You require one of the following roles to fill
                                this form
                              </Text>
                              <Stack space="2">
                                {collection.formMetadata.formRoleGating?.map(
                                  (role: GuildRole) => (
                                    <Tag tone="accent" key={role.id}>
                                      {role.name}
                                    </Tag>
                                  )
                                )}
                              </Stack>
                              <Text variant="label">
                                You do not have the correct roles to access this
                                form
                              </Text>{" "}
                              <Box display="flex" flexDirection="row" gap="4">
                                <Button
                                  variant="tertiary"
                                  size="small"
                                  onClick={async () => {
                                    const externalCircleData = await (
                                      await fetch(
                                        `${process.env.API_HOST}/circle/external/v1/${collection.parents[0].id}/guild`,
                                        {
                                          headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                          },
                                          credentials: "include",
                                        }
                                      )
                                    ).json();
                                    if (!externalCircleData.urlName) {
                                      toast.error(
                                        "Error fetching guild, please visit guild.xyz and find the roles or contact support"
                                      );
                                    }
                                    window.open(
                                      `https://guild.xyz/${externalCircleData.urlName}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  How do I get these roles?
                                </Button>
                              </Box>
                            </Box>
                          )}
                        {collection.formMetadata.sybilProtectionEnabled &&
                          !collection.formMetadata.hasPassedSybilCheck && (
                            <Box
                              display="flex"
                              flexDirection="column"
                              padding="4"
                              marginTop="4"
                              gap="4"
                            >
                              {" "}
                              <Text weight="bold">
                                This form is sybil protected. You must have a
                                minimum score of 100% to fill this collection.
                                Please check the assigned scores below.
                              </Text>
                              <Text variant="label">
                                Your current score: {currentScore}%
                              </Text>
                              <StampScrollContainer>
                                {stamps?.map((stamp: Stamp) => (
                                  <StampCard mode={mode} key={stamp.id}>
                                    <Box
                                      display="flex"
                                      flexDirection="row"
                                      width="full"
                                      alignItems="center"
                                      gap="4"
                                    >
                                      <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        width="full"
                                        paddingRight="4"
                                      >
                                        <Box
                                          width="8"
                                          height="8"
                                          flexDirection="row"
                                          justifyContent="flex-start"
                                          alignItems="center"
                                          marginRight="4"
                                        >
                                          {mode === "dark"
                                            ? PassportStampIcons[
                                                stamp.providerName
                                              ]
                                            : PassportStampIconsLightMode[
                                                stamp.providerName
                                              ]}
                                        </Box>
                                        <Box>
                                          <Text as="h1">{stamp.stampName}</Text>
                                          <Text variant="small">
                                            {stamp.stampDescription}
                                          </Text>
                                        </Box>
                                      </Box>{" "}
                                      {hasStamps && hasStamps[stamp.id] && (
                                        <Tag tone="green">Verified</Tag>
                                      )}
                                      <Text variant="large">
                                        {stamp.score}%
                                      </Text>
                                    </Box>
                                  </StampCard>
                                ))}
                              </StampScrollContainer>
                              <Box display="flex" flexDirection="row" gap="4">
                                <Button
                                  variant="tertiary"
                                  size="small"
                                  onClick={() =>
                                    window.open(
                                      "https://passport.gitcoin.co/",
                                      "_blank"
                                    )
                                  }
                                >
                                  Get Stamps
                                </Button>
                              </Box>
                            </Box>
                          )}
                      </motion.div>

                      <Stack direction="horizontal" justify="space-between">
                        <Box paddingX="5" paddingBottom="4" width="1/2">
                          <PrimaryButton
                            variant="transparent"
                            onClick={() => {
                              setCurrentPage(
                                pageOrder[pageOrder.indexOf(currentPage) - 1]
                              );
                            }}
                          >
                            Back
                          </PrimaryButton>
                        </Box>
                        <Box paddingX="5" paddingBottom="4" width="1/2">
                          <PrimaryButton
                            icon={<BiLogIn size="16" />}
                            onClick={() => {
                              setCurrentPage(
                                pageOrder[pageOrder.indexOf(currentPage) + 1]
                              );
                            }}
                          >
                            Sign In
                          </PrimaryButton>
                        </Box>
                      </Stack>
                    </Box>
                  );
                }
                if (currentPage === "collect") {
                  return (
                    <CollectPage
                      form={collection}
                      preview
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                    />
                  );
                }
                if (currentPage === "submitted") {
                  return (
                    <SubmittedPage
                      form={collection}
                      setCurrentPage={setCurrentPage}
                    />
                  );
                }
                const fields = pages[currentPage]?.properties;
                return (
                  <FormBuilderContainer>
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {fields?.map((field, idx) => {
                        if (collection.properties[field]?.isPartOfFormView) {
                          return (
                            <FieldComponent
                              id={field}
                              index={idx}
                              key={field}
                              setIsEditFieldOpen={setIsEditFieldOpen}
                              setPropertyName={setPropertyName}
                              formData={formData}
                              setFormData={setFormData}
                            />
                          );
                        }
                        return null;
                      })}
                      <Box height="4" />
                      {provided.placeholder}
                    </Box>
                    {collection.formMetadata.paymentConfig &&
                      !pages[pageOrder[pageOrder.indexOf(currentPage) + 1]]
                        .movable &&
                      formData && (
                        <Box marginBottom="8">
                          <CollectPayment
                            paymentConfig={
                              collection.formMetadata.paymentConfig
                            }
                            circleSlug={collection.parents[0].slug}
                            circleId={collection.parents[0].id}
                            data={formData}
                            setData={setFormData}
                          />
                        </Box>
                      )}
                    <Stack direction="horizontal" justify="space-between">
                      <Box paddingX="5" paddingBottom="4" width="1/2">
                        <PrimaryButton
                          variant="transparent"
                          onClick={() => {
                            setCurrentPage(
                              pageOrder[pageOrder.indexOf(currentPage) - 1]
                            );
                          }}
                        >
                          Back
                        </PrimaryButton>
                      </Box>
                      <Box paddingX="5" paddingBottom="4" width="1/2">
                        <PrimaryButton
                          onClick={() => {
                            setCurrentPage(
                              pageOrder[pageOrder.indexOf(currentPage) + 1]
                            );
                          }}
                        >
                          Next
                        </PrimaryButton>
                      </Box>
                    </Stack>
                  </FormBuilderContainer>
                );
              }}
            </Droppable>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default memo(FormBuilder);
