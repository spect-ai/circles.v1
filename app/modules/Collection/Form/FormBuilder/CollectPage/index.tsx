import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType } from "@/app/types";
import { Box, Stack } from "degen";
import { useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
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
  const [claimedJustNow, setClaimedJustNow] = useState(false);
  const { width, height } = useWindowSize();

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
      {claimedJustNow && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          gravity={0.07}
          numberOfPieces={600}
        />
      )}
      <CollectKudos
        form={form}
        preview={preview}
        setClaimedJustNow={setClaimedJustNow}
      />
      <CollectPoap
        form={form}
        preview={preview}
        setClaimedJustNow={setClaimedJustNow}
      />
      <CollectERC20
        form={form}
        preview={preview}
        setClaimedJustNow={setClaimedJustNow}
      />
      <Stack direction="horizontal" justify="space-between">
        <Box
          paddingX="5"
          paddingBottom="4"
          width={{
            xs: "40",
            md: "56",
          }}
        >
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
          <Box
            paddingX="5"
            paddingBottom="4"
            width={{
              xs: "40",
              md: "56",
            }}
          >
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
