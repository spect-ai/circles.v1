/* eslint-disable @typescript-eslint/no-explicit-any */
import { logError, smartTrim } from "@/app/common/utils/utils";
import { updateField } from "@/app/services/Collection";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { Option } from "@/app/types";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  IconPlusSmall,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Calendar, DollarSign } from "react-feather";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { CustomTag } from "../EditValue";

type Props = {
  column: Option;
  groupByPropertyId: string;
  setDefaultValue: (value: any) => void;
  setIsCardDrawerOpen: (value: boolean) => void;
  cardIds: string[];
};

export default function Column({
  column,
  groupByPropertyId,
  setDefaultValue,
  cardIds,
}: Props) {
  const {
    localCollection: collection,
    updateCollection,
    colorMapping,
    authorization,
  } = useLocalCollection();
  const { getMemberDetails } = useModalOptions();
  const [columnName, setColumnName] = useState(column.label);
  const { mode } = useTheme();
  const columns = collection.properties[groupByPropertyId].options as Option[];

  const router = useRouter();

  const ColumnList = (provided: DroppableProvided) => (
    <Container padding="4" ref={provided.innerRef} {...provided.droppableProps}>
      <Stack>
        <Stack direction="horizontal" align="center" justify="space-between">
          <NameInput
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            mode={mode}
            onBlur={async () => {
              // update only if name is changed
              if (column.label === columnName) return;
              const res = await updateField(collection.id, {
                id: groupByPropertyId,
                options: columns.map((c) =>
                  c.value === column.value ? { ...c, label: columnName } : c
                ),
              });
              if (res.id) updateCollection(res);
              else logError("Error renaming column");
            }}
            disabled={
              column.value === "__unassigned__" || authorization === "readonly"
            }
          />
          {authorization !== "readonly" && (
            <Button
              shape="circle"
              variant="transparent"
              size="small"
              onClick={() => {
                setDefaultValue({
                  [groupByPropertyId]:
                    column.value === "__unassigned__" ? null : column,
                });
                void router.push({
                  pathname: router.pathname,
                  query: {
                    circle: router.query.circle,
                    collection: router.query.collection,
                    newCard: true,
                  },
                });
              }}
            >
              <IconPlusSmall />
            </Button>
          )}
        </Stack>
        <ScrollContainer>
          <Stack space="2">
            {cardIds?.map((slug, index) => (
              <Draggable
                key={slug}
                draggableId={slug}
                index={index}
                isDragDisabled={
                  collection.data?.[slug]?.__cardStatus__ === "closed" ||
                  authorization === "readonly"
                }
              >
                {(provided, snapshot) => (
                  <Box
                    key={slug}
                    padding="4"
                    borderWidth="0.375"
                    borderColor={snapshot.isDragging ? "accent" : undefined}
                    borderRadius="medium"
                    onClick={() => {
                      const query = {
                        cardSlug: slug,
                      } as any;
                      if (router.query.formId) {
                        query["formId"] = router.query.formId;
                      } else {
                        if (router.query.circle) {
                          query["circle"] = router.query.circle;
                        }
                        if (router.query.collection) {
                          query["collection"] = router.query.collection;
                        }
                      }

                      void router.push({
                        pathname: router.pathname,
                        query,
                      });
                    }}
                    cursor="pointer"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Stack
                      space="3"
                      direction="horizontal"
                      justify="space-between"
                    >
                      <Box>
                        {/* <Text weight="semiBold">{property.name}</Text> */}
                        <Text weight="semiBold">
                          {collection.data?.[slug] &&
                            collection.data[slug]["Title"]}
                        </Text>
                      </Box>
                      <Stack space="3" direction="horizontal" align="center">
                        {collection.propertyOrder.map((propertyId) => {
                          const property = collection.properties[propertyId];
                          if (!property) return null;
                          const value =
                            collection.data?.[slug] &&
                            collection.data[slug][propertyId];
                          if (
                            !value ||
                            groupByPropertyId === propertyId ||
                            propertyId === "Title"
                          )
                            return null;

                          if (
                            property.type === "shortText" ||
                            property.type === "singleURL"
                          ) {
                            return (
                              <Box key={propertyId}>
                                {/* <Text weight="semiBold">{property.name}</Text> */}
                                <Text color="text" size="small">
                                  {smartTrim(value, 30)}
                                </Text>
                              </Box>
                            );
                          }
                          if (property.type === "singleSelect") {
                            return (
                              <Box key={propertyId}>
                                <Stack direction="horizontal" wrap space="1">
                                  {" "}
                                  <CustomTag
                                    key={propertyId}
                                    mode={mode}
                                    borderCol={colorMapping[value.value]}
                                  >
                                    {/* <Text weight="semiBold">{property.name}</Text> */}
                                    <Text variant="label">{value.label}</Text>
                                  </CustomTag>
                                </Stack>
                              </Box>
                            );
                          }
                          if (property.type === "multiSelect") {
                            return (
                              <Box key={propertyId}>
                                {/* <Text weight="semiBold">{property.name}</Text> */}
                                <Stack direction="horizontal" wrap space="1">
                                  {value.map((value: Option) => (
                                    <CustomTag
                                      key={value.value}
                                      mode={mode}
                                      borderCol={colorMapping[value.value]}
                                    >
                                      <Text> {value.label}</Text>
                                    </CustomTag>
                                  ))}
                                </Stack>
                              </Box>
                            );
                          }
                          if (property.type === "user") {
                            return (
                              <Box key={propertyId}>
                                {/* <Text weight="semiBold">{property.name}</Text> */}
                                <Tag>
                                  <Stack
                                    direction="horizontal"
                                    space="1"
                                    align="center"
                                  >
                                    <Avatar
                                      src={
                                        getMemberDetails(value.value || "")
                                          ?.avatar ||
                                        `https://api.dicebear.com/5.x/thumbs/svg?seed=${
                                          getMemberDetails(value.value || "")
                                            ?.id
                                        }`
                                      }
                                      label=""
                                      size="6"
                                    />
                                    <Text weight="semiBold">
                                      {
                                        getMemberDetails(value.value || "")
                                          ?.username
                                      }
                                    </Text>
                                  </Stack>
                                </Tag>
                              </Box>
                            );
                          }
                          if (property.type === "user[]") {
                            return (
                              <Box key={propertyId}>
                                {/* <Text weight="semiBold">{property.name}</Text> */}
                                <Stack direction="horizontal" wrap space="1">
                                  <AvatarGroup
                                    limit={3}
                                    members={value.map((val: Option) => ({
                                      label: getMemberDetails(val.value || "")
                                        ?.username,
                                      src:
                                        getMemberDetails(val.value || "")
                                          ?.avatar ||
                                        `https://api.dicebear.com/5.x/thumbs/svg?seed=${
                                          getMemberDetails(val.value || "")?.id
                                        }`,
                                    }))}
                                  />
                                </Stack>
                              </Box>
                            );
                          }
                          if (property.type === "date") {
                            return (
                              <Box key={propertyId}>
                                <Tag>
                                  <Stack
                                    direction="horizontal"
                                    space="1"
                                    align="center"
                                  >
                                    <Text>
                                      <Calendar
                                        size={16}
                                        style={{
                                          marginTop: 2,
                                        }}
                                      />
                                    </Text>
                                    <Text variant="label">
                                      {new Date(value).toDateString()}
                                    </Text>
                                  </Stack>
                                </Tag>
                              </Box>
                            );
                          }
                          if (
                            property.type === "reward" &&
                            value?.value &&
                            value?.token?.label
                          ) {
                            return (
                              <Box key={propertyId}>
                                <Tag tone="green">
                                  <Stack
                                    direction="horizontal"
                                    space="0"
                                    align="center"
                                  >
                                    <Text color="green" weight="semiBold">
                                      {`${value.value} ${value.token.label} `}
                                    </Text>
                                  </Stack>
                                </Tag>
                              </Box>
                            );
                          }
                        })}
                      </Stack>
                    </Stack>
                  </Box>
                )}
              </Draggable>
            ))}
          </Stack>
        </ScrollContainer>
      </Stack>
      {provided.placeholder}
    </Container>
  );

  const ListCallback = useCallback(ColumnList, [
    cardIds,
    collection.data,
    collection.id,
    collection.properties,
    collection.propertyOrder,
    column,
    columnName,
    columns,
    getMemberDetails,
    groupByPropertyId,
    mode,
    router,
    setDefaultValue,
    updateCollection,
  ]);

  return (
    <Droppable droppableId={column.value} type="PROPERTY">
      {ListCallback}
    </Droppable>
  );
}

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: none;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  border-radius: 0.5rem;
`;

const NameInput = styled.input<{ mode: string }>`
  width: auto;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.1rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  font-weight: 400;
  margin-left: 0.1rem;
`;
