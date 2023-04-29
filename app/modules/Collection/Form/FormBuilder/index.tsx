/* eslint-disable @typescript-eslint/unbound-method */
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { CoverImage, StampCard } from "@/app/modules/PublicForm";
import { deleteField, updateFormCollection } from "@/app/services/Collection";
import {
  Box,
  Button,
  FileInput,
  IconPlusSmall,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "../Field";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";
import Stepper from "@/app/common/components/Stepper";
import { CollectionType, FormType, GuildRole, Stamp } from "@/app/types";
import { toast } from "react-toastify";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import { getAllCredentials } from "@/app/services/Credentials/AggregatedCredentials";
import CollectPage from "./CollectPage";
import BuilderStartPage from "./StartPage/Builder";
import CollectPayment from "@/app/modules/PublicForm/Fields/CollectPayment";
import SubmittedPage from "./SubmittedPage";
import { BiLogIn } from "react-icons/bi";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { logError } from "@/app/common/utils/utils";
import { Visible } from "react-grid-system";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

function FormBuilder() {
  const {
    localCollection: collection,
    updateCollection,
    currentPage,
    setCurrentPage,
  } = useLocalCollection();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [showConfirmOnDelete, setShowConfirmOnDelete] = useState(false);

  const [cover, setCover] = useState(collection.formMetadata?.cover || "");
  const [logo, setLogo] = useState(collection.formMetadata?.logo || "");

  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  const [formData, setFormData] = useState({} as any);
  const pages = collection.formMetadata.pages;
  const pageOrder = collection.formMetadata.pageOrder;

  const [hasStamps, setHasStamps] = useState({} as any);
  const [currentScore, setCurrentScore] = useState(0);
  const [stamps, setStamps] = useState([] as Stamp[]);

  const addStamps = async (form: FormType) => {
    const stamps = await getAllCredentials();
    const stampsWithScore = [];
    if (
      form.formMetadata.sybilProtectionEnabled &&
      form.formMetadata.sybilProtectionScores
    ) {
      for (const stamp of stamps) {
        if (form.formMetadata.sybilProtectionScores[stamp.id]) {
          const stampWithScore = {
            ...stamp,
            score: form.formMetadata.sybilProtectionScores[stamp.id],
          };
          stampsWithScore.push(stampWithScore);
        }
      }
      console.log({ stampsWithScore });
      setStamps(stampsWithScore.sort((a, b) => b.score - a.score));
    }
  };

  const { mode } = useTheme();
  const { formActions } = useRoleGate();

  useEffect(() => {
    if (connectedUser) {
      addStamps(collection);
    }
  }, [connectedUser]);

  const handleDragCollectionProperty = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const pages = collection.formMetadata.pages;
    const sourcePage = pages[currentPage];
    const newPage = {
      ...sourcePage,
      properties: Array.from(sourcePage.properties),
    };
    newPage.properties.splice(source.index, 1);
    newPage.properties.splice(destination.index, 0, draggableId);
    const update = {
      ...collection,
      formMetadata: {
        ...collection.formMetadata,
        pages: {
          ...pages,
          [currentPage]: newPage,
        },
      },
    };
    updateCollection(update);
    const res = await updateFormCollection(collection.id, update);
    if (res.id) {
      updateCollection(res);
    } else {
      logError("Error updating field order");
    }
  };

  const fields = pages[currentPage]?.properties;

  return (
    <>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyId={propertyId}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
        {isAddFieldOpen && (
          <AddField
            handleClose={() => setIsAddFieldOpen(false)}
            pageId={currentPage}
          />
        )}
        {showConfirmOnDelete && (
          <ConfirmModal
            title="This will remove existing data associated with this field, if you're looking to avoid this please set the field as inactive. Are you sure you want to delete this field?"
            handleClose={() => setShowConfirmOnDelete(false)}
            onConfirm={async () => {
              setShowConfirmOnDelete(false);
              const res: CollectionType = await deleteField(
                collection.id,
                (propertyId as string).trim()
              );
              if (res.id) {
                updateCollection(res);
              } else {
                logError("Error deleting field");
              }
            }}
            onCancel={() => setShowConfirmOnDelete(false)}
          />
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
          <Stack direction="horizontal">
            <FormContainer
              backgroundColor="background"
              borderRadius="2xLarge"
              padding={{
                xs: "2",
                md: "8",
              }}
              display="flex"
              flexDirection="column"
              style={{
                minHeight: "calc(100vh - 20rem)",
              }}
              width="full"
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
              {currentPage === "start" && (
                <BuilderStartPage setCurrentPage={setCurrentPage} />
              )}
              {currentPage === "connect" && (
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
                          <Stack direction="horizontal" space="1" wrap>
                            <Text weight="bold">
                              You require one of the following roles on
                            </Text>
                            <a href="https://guild.xyz">
                              <Text font="mono" weight="bold" color="accent">
                                guild.xyz
                              </Text>
                            </a>
                            <Text weight="bold">
                              to fill this form. Sign in to check your role
                            </Text>
                          </Stack>
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
                            {stamps?.map((stamp: Stamp, index: number) => {
                              return (
                                <StampCard mode={mode} key={index}>
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
                                    {hasStamps[stamp.id] && (
                                      <Tag tone="green">Verified</Tag>
                                    )}
                                    <Text variant="large">{stamp.score}%</Text>
                                  </Box>
                                </StampCard>
                              );
                            })}
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
              )}
              {currentPage === "collect" && (
                <CollectPage
                  form={collection}
                  preview
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
              )}
              {currentPage === "submitted" && (
                <SubmittedPage
                  form={collection}
                  setCurrentPage={setCurrentPage}
                  preview
                />
              )}
              {!["start", "connect", "collect", "submitted"].includes(
                currentPage
              ) && (
                <FormBuilderContainer>
                  <DragDropContext onDragEnd={handleDragCollectionProperty}>
                    <Droppable droppableId="droppable">
                      {(provided) => (
                        <Box
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <Stack>
                            {fields?.map((field, idx) => {
                              if (
                                collection.properties[field]?.isPartOfFormView
                              ) {
                                return (
                                  <FieldComponent
                                    id={field}
                                    index={idx}
                                    key={field}
                                    setIsEditFieldOpen={setIsEditFieldOpen}
                                    setIsAddFieldOpen={setIsAddFieldOpen}
                                    setPropertyId={setPropertyId}
                                    formData={formData}
                                    setFormData={setFormData}
                                    setShowConfirmOnDelete={
                                      setShowConfirmOnDelete
                                    }
                                  />
                                );
                              }
                            })}
                          </Stack>
                          <Box height="4" />
                          {!fields?.length && (
                            <Stack align="center">
                              <Text variant="label">
                                There are no fields in this page.
                              </Text>
                              <Box width="1/3">
                                <PrimaryButton
                                  onClick={() => {
                                    if (!formActions("manageSettings")) {
                                      toast.error(
                                        "You do not have permission to edit fields, make sure your role has permission to manage settings"
                                      );
                                      return;
                                    }
                                    setIsAddFieldOpen(true);
                                  }}
                                >
                                  Add a field
                                </PrimaryButton>
                              </Box>
                            </Stack>
                          )}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {collection.formMetadata.paymentConfig &&
                    !pages[pageOrder[pageOrder.indexOf(currentPage) + 1]]
                      .movable && (
                      <Box marginBottom="8">
                        <CollectPayment
                          paymentConfig={collection.formMetadata.paymentConfig}
                          circleSlug={collection.parents[0].slug}
                          circleId={collection.parents[0].id}
                          data={formData}
                          setData={setFormData}
                        />
                      </Box>
                    )}
                  <Visible xs sm>
                    <Box width="full" marginY="4" paddingX="3">
                      <PrimaryButton
                        onClick={() => {
                          if (!formActions("manageSettings")) {
                            toast.error(
                              "You do not have permission to edit fields, make sure your role has permission to manage settings"
                            );
                            return;
                          }
                          setIsAddFieldOpen(true);
                        }}
                        icon={<IconPlusSmall size="4" />}
                        center
                      >
                        Add a field
                      </PrimaryButton>
                    </Box>
                  </Visible>
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
              )}
            </FormContainer>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default memo(FormBuilder);

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
    padding: 0rem 1%;
    margin-top: -6rem;
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
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

const FormContainer = styled(Box)``;
