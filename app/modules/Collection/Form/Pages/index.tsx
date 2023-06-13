import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { updateFormCollection } from "@/app/services/Collection";
import { PageLine } from "./PageLine";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { logError } from "@/app/common/utils/utils";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import uuid from "react-uuid";

export default function Pages() {
  const {
    localCollection: collection,
    updateCollection,
    setCurrentPage,
  } = useLocalCollection();
  const { formActions } = useRoleGate();

  const { data: currentUser, refetch: fetchUser } = useQuery<UserType>(
    "getMyUser",
    {
      enabled: false,
    }
  );
  return (
    <Box>
      <Stack>
        <Stack direction="horizontal" space="2" align="center">
          <Text size="headingThree" weight="semiBold" ellipsis>
            Pages
          </Text>
          <Button
            shape="circle"
            size="extraSmall"
            variant="transparent"
            onClick={async () => {
              if (!formActions("manageSettings")) {
                toast.error(
                  "You do not have permission to add fields, make sure your role has permission to manage settings"
                );
                return;
              }
              process.env.NODE_ENV === "production" &&
                mixpanel.track("Add Page", {
                  collection: collection.slug,
                  circle: collection.parents[0].slug,
                  user: currentUser?.username,
                });
              const pageOrder = collection.formMetadata.pageOrder;
              const lastIndex = collection.formMetadata.pages["collect"]
                ? pageOrder.length - 2
                : pageOrder.length - 1;

              const newPageId = `page-${uuid()}`;
              const res = await updateFormCollection(collection.id, {
                ...collection,
                formMetadata: {
                  ...collection.formMetadata,
                  pageOrder: [
                    ...pageOrder.slice(0, lastIndex),
                    newPageId,
                    ...pageOrder.slice(lastIndex),
                  ],
                  pages: {
                    ...collection.formMetadata.pages,
                    [newPageId]: {
                      id: newPageId,
                      name: "New Page",
                      properties: [],
                      movable: true,
                    },
                  },
                },
              });
              if (res.id) {
                updateCollection(res);
                setCurrentPage(newPageId);
              } else {
                logError("Error when adding new page");
              }
            }}
          >
            <Box display="flex" flexDirection="row" gap="1" alignItems="center">
              <Text color="accent">
                <IconPlusSmall size="5" />
              </Text>
            </Box>
          </Button>
        </Stack>
        <PagesContainer>
          <PageLine />
        </PagesContainer>
      </Stack>
    </Box>
  );
}

const PagesContainer = styled(Box)`
  height: calc(100vh - 15rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;
