import { CollectionType } from "@/app/types";
import { Box, Stack } from "degen";
import { useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import CollectERC20 from "./CollectERC20";
import CollectKudos from "./CollectKudos";
import CollectPoap from "./CollectPoap";
import CollectZealyXp from "./CollectZealyXP";
import { Button, Page, Stepper } from "@avp1598/vibes";

type Props = {
  form: CollectionType;
  setForm: (form: CollectionType) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onStepChange: (step: number) => void;
  preview?: boolean;
};

const CollectPage = ({
  form,
  setForm,
  currentPage,
  setCurrentPage,
  preview,
  onStepChange,
}: Props) => {
  const pageOrder = form.formMetadata.pageOrder;
  const pages = form.formMetadata.pages;
  const [claimedJustNow, setClaimedJustNow] = useState(false);
  const { width, height } = useWindowSize();

  return (
    <Page>
      <Box
        style={{
          minHeight: "calc(100vh - 20rem)",
          width: "100%",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gap="2"
      >
        <Box>
          <Box marginBottom="8">
            <Stepper
              steps={form.formMetadata.pageOrder.length}
              currentStep={form.formMetadata.pageOrder.indexOf(
                currentPage || ""
              )}
              onStepChange={onStepChange}
            />
          </Box>
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
            setForm={setForm}
            form={form}
            preview={preview}
            setClaimedJustNow={setClaimedJustNow}
          />
          <CollectPoap
            setForm={setForm}
            form={form}
            preview={preview}
            setClaimedJustNow={setClaimedJustNow}
          />
          <CollectERC20
            form={form}
            preview={preview}
            setClaimedJustNow={setClaimedJustNow}
          />
          <CollectZealyXp
            form={form}
            preview={preview}
            setClaimedJustNow={setClaimedJustNow}
          />
        </Box>
        <Stack direction="horizontal" justify="space-between">
          <Box
            paddingX="5"
            paddingBottom="4"
            width={{
              xs: "40",
              md: "56",
            }}
          >
            <Button
              variant="tertiary"
              onClick={() => {
                setCurrentPage(
                  pageOrder[pageOrder.indexOf(currentPage || "") - 1]
                );
              }}
            >
              Back
            </Button>
          </Box>
          {pages[pageOrder[pageOrder.indexOf(currentPage || "") + 1]]
            .movable || (
            <Box
              paddingX="5"
              paddingBottom="4"
              width={{
                xs: "40",
                md: "56",
              }}
            >
              <Button
                onClick={() => {
                  setCurrentPage(pageOrder[pageOrder.indexOf(currentPage) + 1]);
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
    </Page>
  );
};

export default CollectPage;
