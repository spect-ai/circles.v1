import React, { useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import EditableField from "./EditableField";
import { Box, Stack, Text, useTheme } from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Editor from "@/app/common/components/Editor";
import { addField, updateFormCollection } from "@/app/services/Collection";
import { logError } from "@/app/common/utils/utils";
import { v4 as uuid } from "uuid";

type Props = {
  pageId: string;
  fields: string[];
  setShowConfirmOnDelete: (show: boolean) => void;
  setPropertyId: (id: string | null) => void;
};

const Page = ({
  fields,
  pageId,
  setShowConfirmOnDelete,
  setPropertyId,
}: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const formPage = collection.formMetadata.pages[pageId];

  const [loading, setLoading] = useState("none");

  if (pageId === "submitted")
    return (
      <Box>
        <Box padding="8">
          <Stack align="center" space="16">
            <Editor value={collection.formMetadata.messageOnSubmission} />
            {/* <Stack align={"center"}>
              <Text variant="label" align="center">
                Powered By
              </Text>
              <a
                href="https://spect.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mode == "dark" ? (
                  <Image
                    src={"/logo2.svg"}
                    alt="dark-mode-logo"
                    height={"35"}
                    width="138"
                  />
                ) : (
                  <Image
                    src={"/logo1.svg"}
                    alt="light-mode-logo"
                    height={"35"}
                    width="138"
                  />
                )}
              </a>{" "}
              <Text variant="large" align="center">
                💪 Powerful Web3 Forms, Projects and Automations 🤝
              </Text>
              <a href="/" target="_blank">
                <PrimaryButton>Build With Spect</PrimaryButton>
              </a>
            </Stack> */}
          </Stack>
        </Box>
        <PageDivder>
          <div className="container">
            <div className="border" />
            <div className="content">
              <Text color="accent" variant="label">
                {formPage.name}
              </Text>
            </div>
            <div className="border" />
          </div>
        </PageDivder>
      </Box>
    );

  if (pageId === "start")
    return (
      <Box>
        <PageDivder>
          <div className="container">
            <div className="border" />
            <div className="content">
              <Text color="accent" variant="label">
                {formPage.name}
              </Text>
            </div>
            <div className="border" />
          </div>
        </PageDivder>
      </Box>
    );

  return (
    <Droppable droppableId={pageId}>
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.droppableProps}>
          <Box minHeight="32">
            <Stack space="8">
              {fields.map((field, index) => {
                const property = collection.properties[field];
                return (
                  <EditableField
                    key={property.id}
                    id={field}
                    index={index}
                    setShowConfirmOnDelete={setShowConfirmOnDelete}
                    setPropertyId={setPropertyId}
                  />
                );
              })}
              {provided.placeholder}
              <Box marginY="8">
                <Stack direction="horizontal">
                  <PrimaryButton
                    loading={loading === "field"}
                    variant="tertiary"
                    width="fit"
                    onClick={async () => {
                      setLoading("field");
                      const fieldId = uuid();
                      const res = await addField(
                        collection.id,
                        {
                          id: fieldId,
                          name: "Untitled Field",
                          type: "shortText" as "shortText",
                          isPartOfFormView: true,
                        },
                        pageId
                      );
                      if (res.id) {
                        updateCollection(res);
                      } else {
                        logError("Failed to update collection");
                      }
                      setLoading("none");
                    }}
                  >
                    <Text color="accent">Add field</Text>
                  </PrimaryButton>
                  <PrimaryButton
                    loading={loading === "page"}
                    variant="tertiary"
                    width="fit"
                    onClick={async () => {
                      setLoading("page");
                      const pageOrder = collection.formMetadata.pageOrder;
                      const lastIndex = collection.formMetadata.pages["collect"]
                        ? pageOrder.length - 2
                        : pageOrder.length - 1;
                      const fieldId = `page-${lastIndex + 1}`;
                      const update = {
                        ...collection,
                        formMetadata: {
                          ...collection.formMetadata,
                          pages: {
                            ...collection.formMetadata.pages,
                            [fieldId]: {
                              id: fieldId,
                              name: `Page ${lastIndex + 1}`,
                              properties: [],
                            },
                          },
                          pageOrder: [
                            ...pageOrder.slice(0, lastIndex),
                            fieldId,
                            ...pageOrder.slice(lastIndex),
                          ],
                        },
                      };
                      updateCollection(update);
                      const res = await updateFormCollection(
                        collection.id,
                        update
                      );
                      if (!res.id) {
                        logError("Failed to update collection");
                      }
                      setLoading("none");
                    }}
                  >
                    <Text color="accent">Add page</Text>
                  </PrimaryButton>
                  <PrimaryButton
                    loading={loading === "text"}
                    variant="tertiary"
                    width="fit"
                    onClick={async () => {
                      setLoading("text");
                      const fieldId = uuid();
                      const res = await addField(
                        collection.id,
                        {
                          id: fieldId,
                          name: "read-only",
                          type: "readonly" as "readonly",
                          isPartOfFormView: true,
                        },
                        pageId
                      );
                      if (res.id) {
                        updateCollection(res);
                      }
                      if (!res.id) {
                        logError("Failed to update collection");
                      }
                      setLoading("none");
                    }}
                  >
                    <Text color="accent">Add text</Text>
                  </PrimaryButton>
                </Stack>
              </Box>
            </Stack>
          </Box>
          <PageDivder>
            <div className="container">
              <div className="border" />
              <div className="content">
                <Text color="accent" variant="label">
                  {formPage.name}
                </Text>
              </div>
              <div className="border" />
            </div>
          </PageDivder>
        </Box>
      )}
    </Droppable>
  );
};

const PageDivder = styled.div`
  .container {
    display: flex;
    align-items: center;
  }

  .border {
    border-bottom: 1px solid rgb(255, 255, 255, 0.1);
    width: 100%;
  }

  .content {
    padding: 0 5px 0 5px;
    width: 50%;
    text-align: center;
  }
`;

export default Page;
