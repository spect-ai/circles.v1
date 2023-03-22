import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType } from "@/app/types";
import { Box, Stack } from "degen";
import CollectERC20 from "./CollectERC20";
import CollectKudos from "./CollectKudos";
import CollectPoap from "./CollectPoap";

type Props = {
  form: CollectionType;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  preview?: boolean;
};

const CollectPage = ({ form, currentPage, setCurrentPage, preview }: Props) => {
  const pageOrder = form.formMetadata.pageOrder;
  const pages = form.formMetadata.pages;

  return (
    <Box
      style={{
        minHeight: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      gap="2"
    >
      <CollectKudos form={form} preview={preview} />
      <CollectPoap form={form} preview={preview} />
      <CollectERC20 form={form} preview={preview} />
      <Stack direction="horizontal" justify="space-between">
        <Box paddingX="5" paddingBottom="4" width="1/2">
          <PrimaryButton
            variant="transparent"
            onClick={() => {
              setCurrentPage(
                pageOrder[pageOrder.indexOf(currentPage || "") - 1]
              );
            }}
          >
            Back
          </PrimaryButton>
        </Box>
        {pages[pageOrder[pageOrder.indexOf(currentPage || "") + 1]].movable || (
          <Box paddingX="5" paddingBottom="4" width="1/2">
            <PrimaryButton
              onClick={() => {
                setCurrentPage(pageOrder[pageOrder.indexOf(currentPage) + 1]);
              }}
            >
              Next
            </PrimaryButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default CollectPage;
