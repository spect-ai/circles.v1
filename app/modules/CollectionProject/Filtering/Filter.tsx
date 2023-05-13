import Modal from "@/app/common/components/Modal";
import { updateFormCollection } from "@/app/services/Collection";
import { CollectionType, Condition, ConditionGroup } from "@/app/types";
import { Box, Button, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Filter as FilterIcon } from "react-feather";
import { Hidden } from "react-grid-system";
import { toast } from "react-toastify";
import AddConditions from "../../Collection/Common/AddConditions";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";
import AddAdvancedConditions from "../../Collection/Common/AddAdvancedConditions";

function Filter() {
  const {
    localCollection: collection,
    projectViewId: viewId,
    updateCollection,
  } = useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);
  const [viewCondtions, setViewCondtions] = useState<Condition[]>([]);
  const [advancedConditions, setAdvancedConditions] = useState<ConditionGroup>(
    {} as ConditionGroup
  );

  const projectViewId = collection?.collectionType === 1 ? viewId : "0x0";

  useEffect(() => {
    if (collection?.projectMetadata?.views?.[projectViewId]?.filters) {
      // setViewCondtions(
      //   collection.projectMetadata.views[projectViewId].filters as Condition[]
      // );
      setAdvancedConditions(
        (collection.projectMetadata.views[projectViewId]
          .advancedFilters as ConditionGroup) || {}
      );
    }
  }, [collection.projectMetadata?.views, projectViewId]);

  return (
    <Box>
      <Stack direction="horizontal" align="center" space="1">
        <Button
          size="extraSmall"
          variant="transparent"
          onClick={() => setIsOpen(true)}
        >
          <Box display="flex" alignItems="center" gap="1">
            <Text
              color={
                advancedConditions?.order?.length ? "accent" : "textSecondary"
              }
            >
              <FilterIcon size={18} />
            </Text>
            <Hidden xs sm>
              <Text variant="label">Filter</Text>
            </Hidden>
            {advancedConditions?.order?.length > 0 && (
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
                <Text size="extraSmall">
                  {advancedConditions?.order?.length}
                </Text>
              </Box>
            )}
          </Box>
        </Button>
      </Stack>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Filters"
            handleClose={() => {
              setIsOpen(false);
              updateFormCollection(collection.id, {
                projectMetadata: {
                  ...collection?.projectMetadata,
                  views: {
                    ...collection?.projectMetadata?.views,
                    [projectViewId]: {
                      ...collection.projectMetadata.views?.[projectViewId],
                      advancedFilters: advancedConditions,
                      // filters: viewCondtions,
                    },
                  },
                },
              })
                .then((res: CollectionType) => {
                  console.log({ res });
                  if (!res.id) {
                    throw new Error("Error updating filters");
                  }
                  console.log({ res });
                  updateCollection(res);
                })
                .catch((e) => {
                  console.log({ e });
                  logError("Error updating filters");
                });
            }}
          >
            <Box padding="8">
              <Stack>
                {/* <AddConditions
                  viewConditions={viewCondtions}
                  setViewConditions={setViewCondtions}
                  firstRowMessage="Add a filter"
                  buttonText="Add Filter"
                  collection={collection}
                  dropDownPortal={true}
                /> */}
                <AddAdvancedConditions
                  rootConditionGroup={advancedConditions}
                  setRootConditionGroup={setAdvancedConditions}
                  firstRowMessage="When"
                  buttonText="Add Filter"
                  groupButtonText="Group Filters"
                  collection={collection}
                  dropDownPortal={true}
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
