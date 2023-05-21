import Popover from "@/app/common/components/Popover";
import { updateFormCollection } from "@/app/services/Collection";
import { CollectionType, Option } from "@/app/types";
import { Box, Button, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { MenuContainer, MenuItem } from "../EditValue";
import { logError } from "@/app/common/utils/utils";
import {
  BsArrowDown,
  BsArrowDownUp,
  BsArrowUp,
  BsSortDown,
  BsSortUp,
} from "react-icons/bs";
import { RiSortDesc, RiSortAsc } from "react-icons/ri";

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
  const [sortPropertyToLabel, setSortPropertyToLabel] = useState<{
    [key: string]: string;
  }>({} as { [key: string]: string });

  const unSortableProperties = [
    "user[]",
    "multiSelect",
    "payWall",
    "longText",
    "multiURL",
    "milestone",
    "ethAddress",
    "email",
    "user",
    "discord",
    "github",
    "telegram",
    "readonly",
  ];

  useEffect(() => {
    const noneOption = {
      label: "None (default)",
      value: "",
    };
    let options = collection.propertyOrder.map((property) => {
      if (
        !unSortableProperties.includes(collection.properties[property]?.type)
      ) {
        return {
          label: collection.properties[property]?.name,
          value: property,
        };
      }
    });
    options = options.filter((option) => option !== undefined);
    setSortOptions([noneOption, ...(options as Option[])]);
    setSortPropertyToLabel(
      options.reduce((acc, option) => {
        if (option) acc[option.value] = option.label;
        return acc;
      }, {} as { [key: string]: string })
    );
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
      <Stack direction="horizontal" align="center" space="0">
        <Button
          size="extraSmall"
          variant="transparent"
          shape="circle"
          onClick={() => {
            if (!sortProperty) {
              toast.error(
                `Please click "Sort" and select a field to sort by, first`
              );
              return;
            }
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
                  id: res.id,
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
          <Text color={sortProperty ? "accent" : "textSecondary"}>
            {!sortProperty && <BsArrowDownUp size={18} />}
            {sortProperty && isAsc && <RiSortAsc size={18} />}
            {sortProperty && !isAsc && <RiSortDesc size={18} />}
          </Text>
        </Button>
        <Popover
          width="fit"
          butttonComponent={
            <Button
              size="extraSmall"
              variant="transparent"
              onClick={() => setIsOpen(true)}
            >
              <Text variant="label">
                {sortPropertyToLabel?.[sortProperty] || "Sort"}
              </Text>
            </Button>
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
        {/* {sortProperty && (
          <Box
            cursor="pointer"
            onClick={() => {
              
            }}
          >
          </Box>
        )} */}
      </Stack>
    </Box>
  );
}
