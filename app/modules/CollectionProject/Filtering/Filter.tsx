import Modal from "@/app/common/components/Modal";
import { updateFormCollection } from "@/app/services/Collection";
import { CollectionType, Condition } from "@/app/types";
import { Box, Button, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Filter as FilterIcon } from "react-feather";
import { Hidden } from "react-grid-system";
import { toast } from "react-toastify";
import AddConditions from "../../Collection/Common/AddConditions";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

function Filter() {
  const {
    localCollection: collection,
    projectViewId: viewId,
    updateCollection,
  } = useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);
  const [viewCondtions, setViewCondtions] = useState<Condition[]>([]);

  const projectViewId = collection?.collectionType === 1 ? viewId : "0x0";

  useEffect(() => {
    if (collection?.projectMetadata?.views?.[projectViewId]?.filters) {
      setViewCondtions(
        collection.projectMetadata.views[projectViewId].filters as Condition[]
      );
    }
  }, [collection.projectMetadata?.views, projectViewId]);

  return (
    <Box>
      <Stack direction="horizontal" align="center" space="1">
        <Hidden xs sm>
          <Text variant="label">Filter By</Text>
        </Hidden>
        <Button
          shape="circle"
          size="small"
          variant="transparent"
          onClick={() => setIsOpen(true)}
        >
          <Box display="flex" alignItems="center">
            <Text color={viewCondtions.length ? "accent" : "textSecondary"}>
              <FilterIcon size={18} />
            </Text>
            {viewCondtions.length > 0 && (
              <Box
                backgroundColor="foregroundSecondary"
                borderRadius="2xLarge"
                width="4"
                height="4"
                position="absolute"
                marginLeft="4"
                marginBottom="4"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Text size="extraSmall">{viewCondtions.length}</Text>
              </Box>
            )}
          </Box>
        </Button>
      </Stack>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Add Filters"
            handleClose={() => {
              setIsOpen(false);
              updateFormCollection(collection.id, {
                projectMetadata: {
                  ...collection?.projectMetadata,
                  views: {
                    ...collection?.projectMetadata?.views,
                    [projectViewId]: {
                      ...collection.projectMetadata.views?.[projectViewId],
                      filters: viewCondtions,
                    },
                  },
                },
              })
                .then((res: CollectionType) => {
                  if (!res.id) {
                    throw new Error("Error updating filters");
                  }
                  console.log({ res });
                  updateCollection(res);
                })
                .catch(() => {
                  toast.error("Error updating filters");
                });
            }}
          >
            <Box padding="8">
              <Stack>
                <AddConditions
                  viewConditions={viewCondtions}
                  setViewConditions={setViewCondtions}
                  firstRowMessage="Add a filter"
                  buttonText="Add Filter"
                />
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Filter;
