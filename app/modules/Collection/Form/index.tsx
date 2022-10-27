import PrimaryButton from "@/app/common/components/PrimaryButton";
import { reorder } from "@/app/common/utils/utils";
import { updateField, updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, Text, Textarea } from "degen";
import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SendKudos from "../SendKudos";
import { AdditionalSettings } from "./AdditionalSettings";
import FormBuilder from "./FormBuilder";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";
import { Notifications } from "./Notifications";

const Container = styled.div`
  width: 100%;
`;

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  display: flex;
  width: 100%;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 0.5rem;
    margin-top: 0rem;
  }
  flex-direction: row;
  padding: 2rem;
  margin-top: 2rem;

  height: calc(100vh - 9rem);
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
      const newPropertyOrder = reorder(
        propertyOrder,
        source.index,
        destination.index
      );
      setPropertyOrder(newPropertyOrder);
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
        console.log({ res });
        if (res.id) updateCollection(res);
        else toast.error(`Request failed with error ${res.message}`);
      } else {
        updateCollection({
          ...collection,
          propertyOrder: newPropertyOrder,
        });
        const res = await updateFormCollection(collection.id, {
          propertyOrder: newPropertyOrder,
        });
        console.log({ res });
        if (res.id) updateCollection(res);
        else toast.error(`Request failed with error ${res.message}`);
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
        console.log({ res });
        if (res.id) updateCollection(res);
        else toast.error(`Request failed with error ${res.message}`);
      }
    }
  };

  const DroppableContent = (provided: DroppableProvided) => {
    const [messageOnSubmission, setMessageOnSubmission] = useState("");
    const [currMessageOnSubmission, setCurrMessageOnSubmission] = useState("");

    useEffect(() => {
      setMessageOnSubmission(collection.messageOnSubmission);
      setCurrMessageOnSubmission(collection.messageOnSubmission);
    }, []);

    return (
      <Container {...provided.droppableProps} ref={provided.innerRef}>
        <ScrollContainer>
          <InactiveFieldsColumnComponent fields={propertyOrder} />
          <Box
            width="full"
            paddingLeft={{
              xs: "0",
              lg: "8",
            }}
          >
            <FormBuilder fields={propertyOrder} />
            <Box
              marginTop="16"
              marginBottom="4"
              display="flex"
              flexDirection="column"
              style={{
                width: "100%",
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
                      const res = await updateFormCollection(collection.id, {
                        messageOnSubmission,
                      });
                      console.log({ res });
                      if (res.id) {
                        toast.success("Saved!");
                        setCurrMessageOnSubmission(messageOnSubmission);
                        updateCollection(res);
                      } else
                        toast.error(
                          `Request failed with error : ${res?.message}`
                        );
                    }}
                  >
                    Save
                  </PrimaryButton>
                </Box>
                <SendKudos />
                <AdditionalSettings />
                <Notifications />
              </Stack>
            </Box>
          </Box>
        </ScrollContainer>
      </Container>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
