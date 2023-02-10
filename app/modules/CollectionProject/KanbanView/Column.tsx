/* eslint-disable @typescript-eslint/no-explicit-any */
import { smartTrim } from "@/app/common/utils/utils";
import { updateField } from "@/app/services/Collection";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { Option } from "@/app/types";
import {
  Avatar,
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

type Props = {
  column: Option;
  groupByColumn: string;
  setDefaultValue: (value: any) => void;
  cardIds: string[];
};

export default function Column({
  column,
  groupByColumn,
  setDefaultValue,
  cardIds,
}: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { getMemberDetails } = useModalOptions();

  const [columnName, setColumnName] = useState(column.label);
  const { mode } = useTheme();
  const columns = collection.properties[groupByColumn].options as Option[];

  const router = useRouter();

  const ColumnList = (provided: DroppableProvided) => (
    <Container
      paddingX="2"
      paddingY="1"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <Stack space="0">
        <Stack direction="horizontal" align="center" justify="space-between">
          <NameInput
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            mode={mode}
            onBlur={async () => {
              const res = await updateField(collection.id, groupByColumn, {
                options: columns.map((c) =>
                  c.value === column.value ? { ...c, label: columnName } : c
                ),
              });
              if (res.id) updateCollection(res);
              else toast.error("Error renaming column");
            }}
            disabled={column.value === "__unassigned__"}
          />
          <Button
            shape="circle"
            variant="transparent"
            size="small"
            onClick={() => {
              setDefaultValue({
                [groupByColumn]:
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
            <IconPlusSmall size="5" />
          </Button>
        </Stack>
        <ScrollContainer>
          <Stack space="2">
            {cardIds?.map((slug, index) => (
              <Draggable
                key={slug}
                draggableId={slug}
                index={index}
                isDragDisabled={
                  collection.data[slug]?.__cardStatus__ === "closed"
                }
              >
                {(provided, snapshot) => (
                  <Box
                    width="72"
                    key={slug}
                    padding="4"
                    borderWidth="0.375"
                    borderColor={snapshot.isDragging ? "accent" : undefined}
                    borderRadius="medium"
                    onClick={() => {
                      void router.push({
                        pathname: router.pathname,
                        query: {
                          circle: router.query.circle,
                          collection: router.query.collection,
                          cardSlug: slug,
                        },
                      });
                    }}
                    cursor="pointer"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Stack space="3">
                      {collection.propertyOrder.map((propertyId) => {
                        const property = collection.properties[propertyId];
                        const value =
                          collection.data[slug] &&
                          collection.data[slug][propertyId];
                        if (!value || groupByColumn === propertyId) return null;
                        if (property.name === "Title") {
                          return (
                            <Box key={propertyId}>
                              {/* <Text weight="semiBold">{property.name}</Text> */}
                              <Text weight="semiBold">{value}</Text>
                            </Box>
                          );
                        }
                        if (
                          property.type === "shortText" ||
                          property.type === "singleURL"
                        ) {
                          return (
                            <Box key={propertyId}>
                              {/* <Text weight="semiBold">{property.name}</Text> */}
                              <Text color="text" size="small">
                                {smartTrim(value, 20)}
                              </Text>
                            </Box>
                          );
                        }
                        if (property.type === "singleSelect") {
                          return (
                            <Box key={propertyId}>
                              {/* <Text weight="semiBold">{property.name}</Text> */}
                              <Text variant="label">{value.label}</Text>
                            </Box>
                          );
                        }
                        if (property.type === "multiSelect") {
                          return (
                            <Box key={propertyId}>
                              {/* <Text weight="semiBold">{property.name}</Text> */}
                              <Stack direction="horizontal" wrap space="1">
                                {value.map((value: Option) => (
                                  <Tag key={value.value} tone="accent">
                                    {value.label}
                                  </Tag>
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
                                        ?.avatar
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
                                {value.map((value: Option) => (
                                  <Box key={value.value}>
                                    <Avatar
                                      src={
                                        getMemberDetails(value.value || "")
                                          ?.avatar
                                      }
                                      label=""
                                      size="6"
                                    />
                                  </Box>
                                ))}
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
                        if (property.type === "reward") {
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
    groupByColumn,
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
  width: 22rem;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 12.5rem);
  border-radius: 0.5rem;
  overflow-y: auto;
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
