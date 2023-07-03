import React, { useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import EditableField from "./EditableField";
import {
  Box,
  Button,
  IconDocumentAdd,
  IconPlusSmall,
  IconTrash,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Editor from "@/app/common/components/Editor";
import { addField, updateFormCollection } from "@/app/services/Collection";
import { logError } from "@/app/common/utils/utils";
import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { RxFileText, RxText } from "react-icons/rx";
import { useScroll } from "react-use";
import { GuildRole, Stamp } from "@/app/types";
import { StampCard } from "@/app/modules/PublicForm";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";

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
  const {
    localCollection: collection,
    updateCollection,
    scrollContainerRef,
  } = useLocalCollection();
  const formPage = collection.formMetadata.pages[pageId];

  const [loading, setLoading] = useState("none");
  const [hover, setHover] = useState("none");

  const { formActions } = useRoleGate();
  const { y } = useScroll(scrollContainerRef);
  const { mode } = useTheme();

  const onAddField = async (type: string) => {
    const fieldId = uuid();
    const tempCollection = collection;
    updateCollection({
      ...tempCollection,
      properties: {
        ...tempCollection.properties,
        [fieldId]: {
          id: fieldId,
          name: "Untitled Field",
          type: type as "shortText",
          isPartOfFormView: true,
        },
      },
      propertyOrder: [...tempCollection.propertyOrder, fieldId],
      formMetadata: {
        ...tempCollection.formMetadata,
        pages: {
          ...tempCollection.formMetadata.pages,
          [pageId]: {
            ...tempCollection.formMetadata.pages[pageId],
            properties: [
              ...tempCollection.formMetadata.pages[pageId].properties,
              fieldId,
            ],
          },
        },
      },
    });
    const res = await addField(
      collection.id,
      {
        id: fieldId,
        name: "Untitled Field",
        type: type as "shortText",
        isPartOfFormView: true,
      },
      pageId
    );
    if (res.id) {
      updateCollection(res);
    } else {
      logError("Failed to update collection");
      updateCollection(tempCollection);
    }
  };

  const onAddPage = async () => {
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
    const res = await updateFormCollection(collection.id, update);
    if (!res.id) {
      logError("Failed to update collection");
    }
    setLoading("none");
  };

  const onPageDelete = async (id: string) => {
    const pages = collection.formMetadata.pages;
    const pageOrder = collection.formMetadata.pageOrder;
    if (!formActions("manageSettings")) {
      toast.error(
        "You do not have permission to add fields, make sure your role has permission to manage settings"
      );
      return;
    }
    const newPages = { ...pages };
    const page = newPages[id];
    if (page.properties.length > 0) {
      toast.error("Cannot delete a page with fields");
      return;
    }
    delete newPages[id];
    const pageIndex = pageOrder.indexOf(id);
    const newPageOrder = [...pageOrder];
    newPageOrder.splice(pageIndex, 1);

    const update = {
      formMetadata: {
        ...collection.formMetadata,
        pages: newPages,
        pageOrder: newPageOrder,
      },
    };
    updateCollection({
      ...collection,
      ...update,
    });
    updateFormCollection(collection.id, update);
  };

  if (pageId === "submitted")
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
        <Box padding="8">
          <Stack align="center" space="16">
            <Editor
              value={collection.formMetadata.messageOnSubmission}
              version={1}
            />
          </Stack>
        </Box>
      </Box>
    );

  if (pageId === "start")
    return (
      <Box>
        {/* <PageDivder>
          <div className="container">
            <div className="border" />
            <div className="content">
              <Text color="accent" variant="label">
                {formPage.name}
              </Text>
            </div>
            <div className="border" />
          </div>
        </PageDivder> */}
      </Box>
    );

  if (pageId === "connect") {
    return (
      <Stack>
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
        <motion.div
          className="box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {collection.formMetadata.formRoleGating && (
            <Box
              display="flex"
              flexDirection="column"
              padding="4"
              marginTop="4"
              gap="4"
            >
              <Stack direction="horizontal" space="1" wrap>
                <Text>One of the following roles on</Text>
                <a href="https://guild.xyz">
                  <Text font="mono" weight="bold" color="accent">
                    guild.xyz
                  </Text>
                </a>
                <Text>is required to fill this form</Text>
              </Stack>
              <Stack space="2">
                {collection.formMetadata.formRoleGating?.map(
                  (role: GuildRole) => (
                    <Tag tone="accent" key={role.id}>
                      {role.name}
                    </Tag>
                  )
                )}
              </Stack>
            </Box>
          )}
          {collection.formMetadata.sybilProtectionEnabled && (
            <Box
              display="flex"
              flexDirection="column"
              padding="4"
              marginTop="4"
              gap="4"
            >
              <Text>
                This form is sybil protected. You must have a minimum score of
                100% to fill this form
              </Text>
            </Box>
          )}
        </motion.div>
      </Stack>
    );
  }

  if (pageId === "connectDiscord") {
    return (
      <Stack>
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
        <motion.div
          className="box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            padding="4"
            marginTop="4"
            gap="4"
          >
            <Stack direction="horizontal" space="1" wrap>
              <Text>
                One of the following roles on Discord is required to access this
                form
              </Text>
            </Stack>
            <Stack space="2">
              {collection.formMetadata.discordRoleGating?.map(
                (role: { id: string; name: string }) => (
                  <Tag tone="accent" key={role.id}>
                    {role.name}
                  </Tag>
                )
              )}
            </Stack>
          </Box>
        </motion.div>
      </Stack>
    );
  }

  if (pageId === "collect") {
    return (
      <Stack>
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
        <motion.div
          className="box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            padding="4"
            marginTop="4"
            gap="4"
          >
            <Stack space="2">
              <Box>
                {collection.formMetadata.mintkudosTokenId && (
                  <Text>This form is distributing kudos</Text>
                )}
              </Box>
              <Box>
                {collection.formMetadata.poapEventId && (
                  <Text>This form is distributing poaps</Text>
                )}
              </Box>
              <Box>
                {collection.formMetadata.surveyTokenId && (
                  <Text>This form is distributing erc20 tokens</Text>
                )}
              </Box>
              <Box>
                {collection.formMetadata.zealyXP && (
                  <Text>This form is distributing zealy XP</Text>
                )}
              </Box>
            </Stack>
          </Box>
        </motion.div>
      </Stack>
    );
  }

  return (
    <Droppable droppableId={pageId}>
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.droppableProps}>
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
          <Box minHeight="32">
            <Stack space="8">
              {fields.map((field, index) => {
                const property = collection.properties[field];
                return (
                  <Box
                    onMouseEnter={() => {
                      setHover(field);
                    }}
                    onMouseLeave={() => {
                      setHover("none");
                    }}
                  >
                    <Stack direction="horizontal">
                      <Box width="full">
                        <EditableField
                          key={property.id}
                          id={field}
                          index={index}
                          setShowConfirmOnDelete={setShowConfirmOnDelete}
                          setPropertyId={setPropertyId}
                        />
                      </Box>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hover === field ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          marginLeft: "-1rem",
                        }}
                      >
                        <Box
                          backgroundColor="accentSecondary"
                          height="fit"
                          padding="1"
                          borderRadius="2xLarge"
                          marginTop="1"
                          style={{
                            // position it on the right side of the screen
                            position: "absolute",
                            // position it 1rem below the top of the screen
                            marginLeft: "2rem",
                            marginTop: `-${y}px`,
                          }}
                          borderColor="accentSecondary"
                          // borderWidth="0.375"
                        >
                          <Stack space="3">
                            <Button
                              shape="circle"
                              size="extraSmall"
                              variant="transparent"
                              onClick={() => onAddField("shortText")}
                            >
                              <Text color="accent">
                                <IconPlusSmall size="5" />
                              </Text>
                            </Button>
                            <Button
                              shape="circle"
                              size="extraSmall"
                              variant="transparent"
                              onClick={() => onAddField("readonly")}
                            >
                              <Text color="accent">
                                <RxText size={20} />
                              </Text>
                            </Button>
                            <Button
                              shape="circle"
                              size="extraSmall"
                              variant="transparent"
                              onClick={onAddPage}
                            >
                              <Text color="accent">
                                <IconDocumentAdd size="5" />
                              </Text>
                            </Button>
                          </Stack>
                        </Box>
                      </motion.div>
                    </Stack>
                  </Box>
                );
              })}
              {provided.placeholder}
              {fields.length === 0 && (
                <Box marginY="8">
                  <Stack>
                    <Text variant="label">
                      There are no fields in this page
                    </Text>
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
                      {/* <PrimaryButton
                        loading={loading === "page"}
                        variant="tertiary"
                        width="fit"
                        onClick={async () => {
                          setLoading("page");
                          const pageOrder = collection.formMetadata.pageOrder;
                          const lastIndex = collection.formMetadata.pages[
                            "collect"
                          ]
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
                      </PrimaryButton> */}
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
                      <PrimaryButton
                        loading={loading === "text"}
                        variant="tertiary"
                        width="fit"
                        onClick={() => onPageDelete(pageId)}
                      >
                        <Text color="red">Delete page</Text>
                      </PrimaryButton>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
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

const StampScrollContainer = styled(Box)`
  overflow-y: auto;
  height: 20rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

export default Page;
