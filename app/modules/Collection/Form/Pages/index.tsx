import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import styled from "styled-components";
import { updateFormCollection } from "@/app/services/Collection";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import PageLine from "./PageLine";

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

const Pages = () => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  return (
    <Box>
      <Stack>
        <Stack direction="horizontal" space="4" align="center">
          <Text size="headingThree" weight="semiBold" ellipsis>
            Pages
          </Text>
          <PrimaryButton
            variant="tertiary"
            onClick={async () => {
              process.env.NODE_ENV === "production" &&
                mixpanel.track("Add Page", {
                  collection: collection.slug,
                  circle: collection.parents[0].slug,
                  user: currentUser?.username,
                });
              const { pageOrder } = collection.formMetadata;
              const lastIndex = collection.formMetadata.pages.collect
                ? pageOrder.length - 2
                : pageOrder.length - 1;
              const newPageId = `page-${lastIndex + 1}`;
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
              } else {
                toast.error("Error updating collection, refresh and try again");
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
};

export default Pages;
