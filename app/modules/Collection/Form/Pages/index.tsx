import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { updateFormCollection } from "@/app/services/Collection";
import { PageLine } from "./PageLine";

export default function Pages() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  return (
    <Box>
      <Stack>
        <Stack direction="horizontal" space="4" align="center">
          <Text size="headingThree" weight="semiBold" ellipsis>
            Pages
          </Text>
          <PrimaryButton
            variant="transparent"
            onClick={async () => {
              const pageOrder = collection.formMetadata.pageOrder;
              const lastIndex = collection.formMetadata.pages["collect"]
                ? pageOrder.length - 2
                : pageOrder.length - 1;
              console.log(lastIndex);
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
              }
            }}
          >
            <Text color="accent">Add</Text>
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
