import Popover from "@/app/common/components/Popover";
import { updateFormCollection } from "@/app/services/Collection";
import { CollectionType, Option } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { MenuItem } from "../EditValue";

export default function Sort() {
  const {
    localCollection: collection,
    projectViewId,
    updateCollection,
  } = useLocalCollection();

  const [isOpen, setIsOpen] = useState(false);
  const [isAsc, setIsAsc] = useState<boolean>(
    collection.projectMetadata.views[projectViewId]?.sort?.direction ===
      "asc" || true
  );
  const [sortProperty, setSortProperty] = useState(
    collection.projectMetadata.views[projectViewId]?.sort?.property || ""
  );

  const [sortOptions, setSortOptions] = useState<Option[]>([]);

  useEffect(() => {
    const noneOption = {
      label: "None (default)",
      value: "",
    };
    const options = collection.propertyOrder.map((property) => ({
      label: property,
      value: property,
    }));
    setSortOptions([noneOption, ...options]);
  }, [collection.propertyOrder, isOpen]);

  useEffect(() => {
    setIsAsc(
      collection.projectMetadata.views[projectViewId]?.sort?.direction ===
        "asc" || true
    );
    setSortProperty(
      collection.projectMetadata.views[projectViewId]?.sort?.property || ""
    );
  }, [projectViewId]);

  return (
    <Box width="1/4">
      <Stack direction="horizontal" align="center" space="1">
        <Box width="1/2">
          <Text variant="label">Sort By</Text>
        </Box>
        <Popover
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
              <MenuContainer borderRadius="2xLarge">
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
                              ...collection.projectMetadata.views,
                              [projectViewId]: {
                                ...collection.projectMetadata.views[
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
                              res: collectionRes.projectMetadata.cardOrders[
                                collection.projectMetadata.views[projectViewId]
                                  .groupByColumn
                              ],
                            });
                            if (collectionRes.id)
                              updateCollection(collectionRes);
                            else throw new Error("Error updating collection");
                          })
                          .catch(() => {
                            toast.error("Error updating collection");
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
                    ...collection.projectMetadata.views,
                    [projectViewId]: {
                      ...collection.projectMetadata.views[projectViewId],
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
                    res: collection.projectMetadata.views[projectViewId],
                  });
                  if (res.id) updateCollection(res);
                  else throw new Error("Error updating collection");
                })
                .catch(() => {
                  toast.error("Error updating collection");
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

const MenuContainer = styled(Box)`
  width: 30rem;
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background: rgb(191, 90, 242, 0.05);
  transition: all 0.15s ease-out;

  max-height: 20rem;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;
