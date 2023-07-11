import { Box, Stack } from "degen";
import React from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "./Components/FieldComponent";
import styled from "@emotion/styled";
import {
  FormProvider,
  Form,
  Page,
  Button,
  SpectProps,
  DeformProps,
  GFormProps,
  TypeformProps,
} from "@avp1598/vibes";

type Props = {
  themeSelected: "spect" | "deform" | "gform" | "typeform";
};

const themeMapper = {
  spect: SpectProps,
  deform: DeformProps,
  gform: GFormProps,
  typeform: TypeformProps,
};

const FormPreview = ({ themeSelected }: Props) => {
  const { localCollection: collection } = useLocalCollection();
  return (
    // <Themes theme="spect" />
    <ScrollContainer>
      <FormProvider
        formProps={themeMapper[themeSelected].formProps}
        pageProps={themeMapper[themeSelected].pageProps}
        fieldProps={themeMapper[themeSelected].fieldProps}
        buttonProps={themeMapper[themeSelected].buttonProps}
        textProps={themeMapper[themeSelected].textProps}
        logoProps={themeMapper[themeSelected].logoProps}
        optionProps={themeMapper[themeSelected].optionProps}
      >
        <Form>
          <Page>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
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
              <Stack direction="horizontal" justify="space-between">
                <div
                  style={{
                    width: "25%",
                  }}
                >
                  <Button variant="tertiary">Back</Button>
                </div>
                <div
                  style={{
                    width: "25%",
                  }}
                >
                  <Button variant="primary">Next</Button>
                </div>
              </Stack>
            </div>
          </Page>
        </Form>
      </FormProvider>
    </ScrollContainer>
  );
};

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 768px) {
    height: calc(100vh - 15rem);
  }
  height: calc(100vh - 15rem);
  border-radius: 1rem;
  margin: 0rem 2rem;
`;

export default FormPreview;
