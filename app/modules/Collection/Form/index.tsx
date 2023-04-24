import { Box } from "degen";
import styled from "styled-components";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import FormBuilder from "./FormBuilder";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";

export function Form() {
  const { loading, scrollContainerRef } = useLocalCollection();

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <ScrollContainer ref={scrollContainerRef}>
      <FormContainer>
        <FormBuilder />
      </FormContainer>
      <InactiveFieldsColumnComponent />
    </ScrollContainer>
  );
}

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
    height: calc(100vh - 9rem);
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
