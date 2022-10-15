import PrimaryButton from "@/app/common/components/PrimaryButton";
import { reorder } from "@/app/common/utils/utils";
import { updateField } from "@/app/services/Collection";
import { Box, Input, Stack, Text, Textarea } from "degen";
import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { TextArea } from "../../Card/Activity/Comment";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SendKudos from "../SendKudos";
import ColumnComponent from "./ColumnComponent";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 2rem;
  padding: 2rem;
`;

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  height: 45rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
  margin-left: 8rem;
`;

export function Form() {
  const {
    localCollection: collection,
    loading,
    updateCollection,
  } = useLocalCollection();

  const [propertyOrder, setPropertyOrder] = useState(collection.propertyOrder);

  useEffect(() => {
    setPropertyOrder(collection.propertyOrder);
  }, [collection]);

  const handleDragCollectionProperty = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination?.droppableId === source.droppableId &&
      destination?.index === source.index
    ) {
      return;
    }

    if (destination?.droppableId === "activeFields") {
      setPropertyOrder(reorder(propertyOrder, source.index, destination.index));
      if (
        collection.properties[draggableId].isPartOfFormView === false ||
        !collection.properties[draggableId].isPartOfFormView
      ) {
        updateCollection({
          ...collection,
          properties: {
            ...collection.properties,
            [draggableId]: {
              ...collection.properties[draggableId],
              isPartOfFormView: true,
            },
          },
        });
        const res = await updateField(collection.id, draggableId, {
          isPartOfFormView: true,
        });
        res && updateCollection(res);
      }
    } else if (destination?.droppableId === "inactiveFields") {
      // setPropertyOrder(reorder(propertyOrder, source.index, destination.index));
      if (collection.properties[draggableId].isPartOfFormView === true) {
        updateCollection({
          ...collection,
          properties: {
            ...collection.properties,
            [draggableId]: {
              ...collection.properties[draggableId],
              isPartOfFormView: false,
            },
          },
        });
        const res = await updateField(collection.id, draggableId, {
          isPartOfFormView: false,
        });
        res && updateCollection(res);
      }
    }
  };

  const DroppableContent = (provided: DroppableProvided) => {
    const [messageOnSubmission, setMessageOnSubmission] = useState("");
    const [currMessageOnSubmission, setCurrMessageOnSubmission] = useState("");

    useEffect(() => {
      setMessageOnSubmission(collection.messageOnSubmission);
      setCurrMessageOnSubmission(collection.messageOnSubmission);
    }, [collection]);

    return (
      <Container {...provided.droppableProps} ref={provided.innerRef}>
        <InactiveFieldsColumnComponent fields={propertyOrder} />
        <Box
          style={{
            width: "80%",
          }}
        >
          <ScrollContainer>
            <ColumnComponent fields={propertyOrder} />
            <Box
              marginTop="16"
              marginBottom="4"
              display="flex"
              flexDirection="column"
              style={{
                width: "80%",
              }}
            >
              <Stack direction="vertical" space="4">
                <Text variant="large">After the form is submitted.</Text>
                <Text variant="label">Show the following message</Text>

                <Textarea
                  label=""
                  value={messageOnSubmission}
                  rows={2}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setMessageOnSubmission(e.target.value);
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <PrimaryButton
                    disabled={currMessageOnSubmission === messageOnSubmission}
                    onClick={async () => {
                      const res = await (
                        await fetch(
                          `${process.env.API_HOST}/collection/v1/${collection.id}`,
                          {
                            method: "PATCH",
                            body: JSON.stringify({
                              messageOnSubmission,
                            }),
                            headers: {
                              "Content-Type": "application/json",
                            },
                            credentials: "include",
                          }
                        )
                      ).json();
                      updateCollection(res);
                    }}
                  >
                    Save
                  </PrimaryButton>
                </Box>

                {!collection.mintkudosTokenId && (
                  <Text variant="label">And</Text>
                )}
                {collection.mintkudosTokenId && (
                  <Text variant="label">And send the following kudos</Text>
                )}

                <SendKudos />
              </Stack>
            </Box>
          </ScrollContainer>
        </Box>
      </Container>
    );
  };

  const DroppableContentCallback = useCallback(DroppableContent, [
    propertyOrder,
  ]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <DragDropContext onDragEnd={handleDragCollectionProperty}>
      <Droppable droppableId="all-fields" direction="horizontal" type="fields">
        {DroppableContentCallback}
      </Droppable>
    </DragDropContext>
  );
}
