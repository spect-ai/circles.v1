import Popover from "@/app/common/components/Popover";
import { updateFormCollection } from "@/app/services/Collection";
import { CollectionType, Option } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { MenuContainer, MenuItem } from "../EditValue";
import { logError } from "@/app/common/utils/utils";

export default function Sort() {
  const {
    localCollection: collection,
    projectViewId: viewId,
    updateCollection,
  } = useLocalCollection();

  const projectViewId = collection?.collectionType === 1 ? viewId : "0x0";

  const [isOpen, setIsOpen] = useState(false);
  const [isAsc, setIsAsc] = useState<boolean>(
    collection?.projectMetadata?.views?.[projectViewId]?.sort?.direction ===
      "asc" || true
  );
  const [sortProperty, setSortProperty] = useState(
    collection?.projectMetadata?.views?.[projectViewId]?.sort?.property || ""
  );

  const [sortOptions, setSortOptions] = useState<Option[]>([]);

  const unSortableProperties = [
    "user[]",
    "multiSelect",
    "payWall",
    "longText",
    "multiURL",
    "milestone",
  ];

  useEffect(() => {
    const noneOption = {
      label: "None (default)",
      value: "",
    };
    let options = collection.propertyOrder.map((property) => {
      if (
        !unSortableProperties.includes(collection.properties[property].type)
      ) {
        return {
          label: property,
          value: property,
        };
      }
    });
    options = options.filter((option) => option !== undefined);
    setSortOptions([noneOption, ...(options as Option[])]);
  }, [JSON.stringify(collection.propertyOrder), isOpen]);

  useEffect(() => {
    setIsAsc(
      collection?.projectMetadata?.views?.[projectViewId]?.sort?.direction ===
        "asc" || true
    );
    setSortProperty(
      collection?.projectMetadata?.views?.[projectViewId]?.sort?.property || ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectViewId]);

  return (
    <Box width="fit">
      <Stack direction="horizontal" align="center" space="1">
        <Text variant="label">Sort</Text>
        <Popover
          width="fit"
          butttonComponent={
            <Box cursor="pointer" onClick={() => setIsOpen(true)}>
              <Tag hover>{sortProperty || "none"}</Tag>
            </Box>
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto", transition: { duration: 0.2 } }}
            exit={{ height: 0 }}
            style={{
              overflow: "hidden",
            }}
          >
            <Box backgroundColor="background">
              <MenuContainer borderRadius="2xLarge" cWidth="10rem">
                <Stack space="0">
                  {sortOptions.map((option) => (
                    <MenuItem
                      padding="2"
                      key={option.value}
                      onClick={() => {
                        setSortProperty(option.value);
                        setIsOpen(false);
                        updateFormCollection(collection.id, {
                          projectMetadata: {
                            ...collection.projectMetadata,
                            views: {
                              ...(collection?.projectMetadata?.views || {}),
                              [projectViewId]: {
                                ...collection.projectMetadata?.views?.[
                                  projectViewId
                                ],
                                sort: {
                                  property: option.value,
                                  direction: isAsc ? "asc" : "desc",
                                },
                              },
                            },
                          },
                        })
                          .then((collectionRes: CollectionType) => {
                            console.log({
                              res: collectionRes?.projectMetadata?.cardOrders?.[
                                collection.projectMetadata.views?.[
                                  projectViewId
                                ]?.groupByColumn
                              ],
                            });
                            if (collectionRes.id)
                              updateCollection(collectionRes);
                            else throw new Error("Error updating collection");
                          })
                          .catch((err) => {
                            logError("Error updating collection");
                          });
                      }}
                    >
                      <Text>{option.label}</Text>
                    </MenuItem>
                  ))}
                </Stack>
              </MenuContainer>
            </Box>
          </motion.div>
        </Popover>
        {sortProperty && (
          <Box
            cursor="pointer"
            onClick={() => {
              setIsAsc(!isAsc);
              updateFormCollection(collection.id, {
                projectMetadata: {
                  ...collection.projectMetadata,
                  views: {
                    ...(collection.projectMetadata?.views || {}),
                    [projectViewId]: {
                      ...collection.projectMetadata?.views?.[projectViewId],
                      sort: {
                        property: sortProperty,
                        direction: !isAsc ? "asc" : "desc",
                      },
                    },
                  },
                },
              })
                .then((res) => {
                  console.log({
                    res: collection?.projectMetadata?.views?.[projectViewId],
                  });
                  if (res.id) {
                    updateCollection(res);
                  } else {
                    throw new Error("Error updating collection");
                  }
                })
                .catch((err) => {
                  logError("Error updating collection");
                });
            }}
          >
            <Tag hover tone="accent">
              {isAsc ? "asc" : "desc"}
            </Tag>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
