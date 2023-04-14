import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { updateFormCollection } from "@/app/services/Collection";
import { PageLine } from "./PageLine";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { trackError } from "@/app/common/utils/utils";

export default function Pages() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const { data: currentUser, refetch: fetchUser } = useQuery<UserType>(
    "getMyUser",
    {
      enabled: false,
    }
  );
  return (
    <Box>
      <Stack>
        <Stack direction="horizontal" space="4" align="center">
          <Text size="headingThree" weight="semiBold" ellipsis>
            Pages
          </Text>
          <PrimaryButton
            size="extraSmall"
            variant="tertiary"
            onClick={async () => {
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
              console.log(lastIndex);
              const newPageId = `page-${lastIndex + 1}`;
              const res = await updateFormCollection(null as any, {
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
              } else {
                toast.error("Error updating collection, refresh and try again");
                trackError("Error when adding new page");
              }
            }}
          >
            <Box display="flex" flexDirection="row" gap="1" alignItems="center">
              <Text color="accent">Add Page</Text>
            </Box>
          </PrimaryButton>
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
