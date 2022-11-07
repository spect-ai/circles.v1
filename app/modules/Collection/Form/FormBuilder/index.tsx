/* eslint-disable @typescript-eslint/unbound-method */
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { useGlobal } from "@/app/context/globalContext";
import { CoverImage, NameInput } from "@/app/modules/PublicForm";
import { updateFormCollection } from "@/app/services/Collection";
import { Avatar, Box, FileInput, IconPlusSmall, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "../Field";
import mixpanel from "@/app/common/utils/mixpanel";
import Editor from "@/app/common/components/Editor";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";

type Props = {
  fields: string[];
};

function FormBuilder({ fields }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  const [cover, setCover] = useState(collection.cover || "");
  const [logo, setLogo] = useState(collection.logo || "");

  const { connectedUser } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const FieldDraggable = (provided: DroppableProvided) => (
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
            />
          );
        }
      })}
      <Box height="4" />
      {provided.placeholder}
    </Box>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    fields,
    collection.properties,
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
                    cover: res.imageGatewayURL,
                  }
                );
                newCollection.id && updateCollection(newCollection);
              }
            }}
          >
            {() => (
              <ClickableTag
                onClick={() => {}}
                name={logo ? "Change Cover" : "Add Cover"}
              />
            )}
          </FileInput>
        </CoverImageButtonContainer>
        <CoverImage src={cover} backgroundColor="accentSecondary" />
        <Container>
          <FormContainer backgroundColor="background" borderRadius="2xLarge">
            <Box width="full" marginBottom="2" padding="4">
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
                          logo: res.imageGatewayURL,
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
            </Box>
            <Droppable droppableId="activeFields" type="field">
              {FieldDraggableCallback}
            </Droppable>
            <Box paddingX="5" paddingBottom="4">
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
            </Box>
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

const FormContainer = styled(Box)``;
