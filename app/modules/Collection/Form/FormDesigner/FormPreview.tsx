import { Box, Stack } from "degen";
import React from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "./Components/FieldComponent";
import Stepper from "@/app/common/components/Stepper";
import styled from "@emotion/styled";

type Props = {};

const FormPreview = (props: Props) => {
  const { localCollection: collection } = useLocalCollection();
  return (
    <div
      className="w-full rounded-lg shadow-xl"
      style={{
        height: "calc(100vh - 16rem)",
      }}
    >
      <Stack>
        <Box
          backgroundColor="accentSecondary"
          height="64"
          borderRadius="2xLarge"
        />
        <Container embed={false}>
          <Stack align="center">
            <FormContainer
              backgroundColor="background"
              borderRadius="2xLarge"
              display="flex"
              flexDirection="column"
              width="2/3"
            >
              <Stack align="center">
                <div className="scale-[0.8]">
                  <Stepper
                    steps={4}
                    currentStep={2}
                    onStepChange={(step) => {}}
                  />
                </div>
                <Box marginBottom="4" />
              </Stack>
              <Stack>
                {collection.propertyOrder?.map((field, idx) => {
                  if (collection.properties[field]?.isPartOfFormView) {
                    return (
                      <FieldComponent
                        id={field}
                        formData={{}}
                        setFormData={() => {}}
                      />
                    );
                  }
                })}
              </Stack>
            </FormContainer>
          </Stack>
        </Container>
      </Stack>
    </div>
  );
};

const Container = styled(Box)<{ embed: boolean }>`
  margin-top: ${(props) => (props.embed ? "0rem" : "-8rem")};
`;

const FormContainer = styled(Box)`
  padding: 0.5rem;
  margin-bottom: 2rem;
`;

export default FormPreview;
