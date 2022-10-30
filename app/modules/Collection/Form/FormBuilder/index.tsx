/* eslint-disable @typescript-eslint/unbound-method */
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { storeImage } from "@/app/common/utils/ipfs";
import { useGlobal } from "@/app/context/globalContext";
import {
  CoverImage,
  DescriptionInput,
  NameInput,
} from "@/app/modules/PublicForm";
import { updateFormCollection } from "@/app/services/Collection";
import { Avatar, Box, FileInput, Stack, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useCallback, useEffect, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "../Field";

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

  const [cover, setCover] = useState(collection.cover || "");
  const [logo, setLogo] = useState(collection.logo || "");

  const { connectedUser } = useGlobal();
  const { mode } = useTheme();

  console.log({ collection });

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
      {provided.placeholder}
    </Box>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    fields,
    collection.properties,
  ]);

  useEffect(() => {}, []);

  return (
    <>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
      </AnimatePresence>
      <Box
        paddingX={{
          xs: "1",
          md: "4",
        }}
      >
        <CoverImageButtonContainer>
          <FileInput
            onChange={async (file) => {
              const res = await storeImage(file);
              console.log({ res });
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
          <FormContainer backgroundColor="background">
            <Box width="full" marginBottom="2" padding="4">
              <Stack space="2">
                {logo && <Avatar src={logo} label="" size="20" />}
                <FileInput
                  onChange={async (file) => {
                    const res = await storeImage(file);
                    console.log({ res });
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
                <DescriptionInput
                  mode={mode}
                  placeholder="Enter description"
                  autoFocus
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  onBlur={async () => {
                    if (connectedUser) {
                      const res = await updateFormCollection(collection.id, {
                        description,
                      });
                      res.id && updateCollection(res);
                    }
                  }}
                />
              </Stack>
            </Box>
            <Droppable droppableId="activeFields" type="field">
              {FieldDraggableCallback}
            </Droppable>
          </FormContainer>
        </Container>
      </Box>
    </>
  );
}

export default memo(FormBuilder);

const Container = styled(Box)`
  overflow-y: auto;
  padding: 2rem 14rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: -10rem;

  @media (max-width: 768px) {
    padding: 0rem 1rem;
    margin-top: -16rem;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 2rem 4rem;
    margin-top: -12rem;
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: 2rem 8rem;
    margin-top: -10rem;
  }
`;

const CoverImageButtonContainer = styled(Box)`
  margin-bottom: -2rem;
`;

const FormContainer = styled(Box)``;
