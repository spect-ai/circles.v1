import { Box } from "degen";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import FormBuilder from "./FormBuilder";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";
// eslint-disable-next-line import/no-named-as-default
import SkeletonLoader from "../SkeletonLoader";

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  display: flex;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 0.5rem;
    margin-top: 0rem;
    height: calc(100vh - 4rem);
  }
  flex-direction: row;
  padding: 1.5rem;
  margin-top: 1rem;
  height: calc(100vh - 7rem);
`;

const FormContainer = styled(Box)`
  @media (max-width: 992px) {
    width: 100%;
  }
  width: 80%;
`;

const Form = () => {
  const {
    localCollection: collection,
    updateCollection,
    loading,
    currentPage,
  } = useLocalCollection();

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

    const { pages } = collection.formMetadata;

    const sourcePage = pages[currentPage];
    const newPage = {
      ...sourcePage,
      properties: Array.from(sourcePage.properties),
    };
    newPage.properties.splice(source.index, 1);
    newPage.properties.splice(destination.index, 0, draggableId);
    updateCollection({
      ...collection,
      formMetadata: {
        ...collection.formMetadata,
        pages: {
          ...pages,
          [currentPage]: newPage,
        },
      },
    });
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <DragDropContext onDragEnd={handleDragCollectionProperty}>
      <Droppable droppableId="all-fields" direction="horizontal" type="fields">
        {(provided: DroppableProvided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            <ScrollContainer>
              <FormContainer>
                <FormBuilder />
              </FormContainer>
              <InactiveFieldsColumnComponent />
            </ScrollContainer>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Form;
