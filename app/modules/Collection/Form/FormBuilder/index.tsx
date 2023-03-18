/* eslint-disable @typescript-eslint/unbound-method */
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { CoverImage } from "@/app/modules/PublicForm";
import { updateFormCollection } from "@/app/services/Collection";
import { Avatar, Box, FileInput, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "../Field";
import Editor from "@/app/common/components/Editor";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";
import { Connect } from "@/app/modules/Sidebar/ProfileButton/ConnectButton";
import Stepper from "@/app/common/components/Stepper";
import { NameInput } from "@/app/modules/PublicForm/FormFields";

function FormBuilder() {
  const {
    localCollection: collection,
    updateCollection,
    currentPage,
    setCurrentPage,
  } = useLocalCollection();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  const [cover, setCover] = useState(collection.formMetadata?.cover || "");
  const [logo, setLogo] = useState(collection.formMetadata?.logo || "");

  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  const [formData, setFormData] = useState({} as any);
  const pages = collection.formMetadata.pages;
  const pageOrder = collection.formMetadata.pageOrder;

  const FieldDraggable = (provided: DroppableProvided) => {
    if (currentPage === "start") {
      return (
        <Box
          style={{
            height: "calc(100vh - 20rem)",
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Stack space="2">
            {logo && <Avatar src={logo} label="" size="20" />}
            <FileInput
              onChange={async (file) => {
                const res = await storeImage(file);
                setLogo(res.imageGatewayURL);
                if (connectedUser) {
                  const newCollection = await updateFormCollection(
                    collection.id,
                    {
                      formMetadata: {
                        ...collection.formMetadata,
                        logo: res.imageGatewayURL,
                      },
                    }
                  );
                  newCollection.id && updateCollection(newCollection);
                }
              }}
            >
              {() => (
                <ClickableTag
                  onClick={() => {}}
                  name={logo ? "Change logo" : "Add Logo"}
                />
              )}
            </FileInput>
            <NameInput
              placeholder="Enter name"
              autoFocus
              value={name}
              rows={Math.floor(name?.length / 60) + 1}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={async () => {
                if (connectedUser && name !== collection.name) {
                  const res = await updateFormCollection(collection.id, {
                    name,
                  });
                  res.id && updateCollection(res);
                }
              }}
            />
            <Box
              width="full"
              borderRadius="large"
              maxHeight="56"
              overflow="auto"
              id="editorContainer"
            >
              <Editor
                value={description}
                onSave={async (value) => {
                  setDescription(value);
                  if (connectedUser) {
                    const res = await updateFormCollection(collection.id, {
                      description: value,
                    });
                    res.id && updateCollection(res);
                  }
                }}
                placeholder={`Edit description`}
                isDirty={true}
              />
            </Box>
          </Stack>
          <Stack direction="horizontal" justify="space-between">
            <Box paddingX="5" paddingBottom="4" width="1/2" />
            <Box paddingX="5" paddingBottom="4" width="1/2">
              <PrimaryButton
                onClick={() => {
                  setCurrentPage("connect");
                }}
              >
                Start
              </PrimaryButton>
            </Box>
          </Stack>
        </Box>
      );
    } else if (currentPage === "connect") {
      return (
        <Box
          style={{
            height: "calc(100vh - 20rem)",
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Text>
            This form requires you to connect your wallet to continue.
          </Text>
          <Stack direction="horizontal" justify="space-between">
            <Box paddingX="5" paddingBottom="4" width="1/2">
              <PrimaryButton variant="transparent">Back</PrimaryButton>
            </Box>
            <Box paddingX="5" paddingBottom="4" width="1/2">
              <Connect />
            </Box>
          </Stack>
        </Box>
      );
    } else if (currentPage === "claimKudos") {
      return (
        <Stack>
          <Text>You are eligible to receive kudos!</Text>
          <PrimaryButton>Claim Kudos</PrimaryButton>
        </Stack>
      );
    } else if (currentPage === "submitted") {
      return (
        <Box
          style={{
            height: "calc(100vh - 20rem)",
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box />
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Stack>
              {collection.formMetadata.updatingResponseAllowed &&
                collection.formMetadata.active &&
                collection.formMetadata.walletConnectionRequired && (
                  <PrimaryButton variant="transparent">
                    Update response
                  </PrimaryButton>
                )}
              {collection.formMetadata.walletConnectionRequired && (
                <PrimaryButton variant="transparent">
                  View response
                </PrimaryButton>
              )}
              {collection.formMetadata.multipleResponsesAllowed &&
                collection.formMetadata.active && (
                  <PrimaryButton variant="transparent">
                    Submit another response
                  </PrimaryButton>
                )}
              <Box paddingX="5" paddingBottom="4" width="full">
                <a href="/" target="_blank">
                  <PrimaryButton>Create your own form</PrimaryButton>
                </a>
              </Box>
            </Stack>
          </Box>
        </Box>
      );
    } else {
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
            })}
            <Box height="4" />
            {provided.placeholder}
          </Box>
          <Stack direction="horizontal" justify="space-between">
            <Box paddingX="5" paddingBottom="4" width="1/2">
              <PrimaryButton
                variant="transparent"
                onClick={() => {
                  setCurrentPage(pageOrder[pageOrder.indexOf(currentPage) - 1]);
                }}
              >
                Back
              </PrimaryButton>
            </Box>
            <Box paddingX="5" paddingBottom="4" width="1/2">
              <PrimaryButton
                onClick={() => {
                  setCurrentPage(pageOrder[pageOrder.indexOf(currentPage) + 1]);
                }}
              >
                Next
              </PrimaryButton>
            </Box>
          </Stack>
          {/* <Box paddingX="5" paddingBottom="4">
            <PrimaryButton
              icon={<IconPlusSmall />}
              onClick={() => {
                setIsAddFieldOpen(true);
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Add Field Button", {
                    user: currentUser?.username,
                  });
              }}
            >
              Add Field
            </PrimaryButton>
          </Box> */}
        </FormBuilderContainer>
      );
    }
  };

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    currentPage,
    collection,
    formData,
  ]);

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
                newCollection.id && updateCollection(newCollection);
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
          <FormContainer
            backgroundColor="background"
            borderRadius="2xLarge"
            padding="8"
            display="flex"
            flexDirection="column"
            style={{
              height: "calc(100vh - 20rem)",
            }}
          >
            <Droppable droppableId="activeFields" type="field">
              {FieldDraggableCallback}
            </Droppable>
            <Stack align="center">
              <Stepper
                steps={pageOrder.length}
                currentStep={pageOrder.indexOf(currentPage)}
                onStepChange={(step) => {
                  setCurrentPage(pageOrder[step]);
                }}
              />
            </Stack>
          </FormContainer>
        </Container>
      </Box>
    </>
  );
}

export default memo(FormBuilder);

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
  height: calc(100vh - 20rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;

const FormContainer = styled(Box)``;
