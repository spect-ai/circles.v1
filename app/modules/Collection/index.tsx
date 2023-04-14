import { Box, Stack, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import CollectionProject from "../CollectionProject";
import CollectionHeading from "./CollectionHeading";
import { useLocalCollection } from "./Context/LocalCollectionContext";
import { Form } from "./Form";
import TableView from "./TableView";
import FAQModal from "../Dashboard/FAQModal";
import { useRouter } from "next/router";
import { SkeletonLoader } from "./SkeletonLoader";
import Help from "@/app/common/components/Help";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { migrateAllCOllections } from "@/app/services/Collection";

export function Collection() {
  const {
    view,
    setView,
    localCollection: collection,
    loading,
  } = useLocalCollection();
  const [faqOpen, setFaqOpen] = useState(false);
  const { mode } = useTheme();

  const router = useRouter();
  const { responses } = router.query;

  useEffect(() => {
    if (responses !== undefined) setView(1);
    else setView(0);
  }, [responses]);

  if ((collection as any).guacamole.guacamole) {
    return <SkeletonLoader />;
  }

  // if (!collection?.id && loading) {
  //   return <SkeletonLoader />;
  // }

  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      {/* <PrimaryButton
        onClick={() => {
          void migrateAllCOllections();
        }}
      >
        Migrate
      </PrimaryButton> */}
      <AnimatePresence>
        {faqOpen && <FAQModal handleClose={() => setFaqOpen(false)} />}
      </AnimatePresence>
      {collection.collectionType === 0 && (
        <Stack space={"0"}>
          <CollectionHeading />
          {view === 0 && <Form />}
          <Box
            marginLeft={{
              xs: "2",
              md: "8",
            }}
            marginRight={{
              xs: "2",
              md: "8",
            }}
            marginTop="4"
          >
            {view === 1 && (
              <>
                <TableView />
              </>
            )}
          </Box>
        </Stack>
      )}
      {collection.collectionType === 1 && <CollectionProject />}
      <Help setFaqOpen={setFaqOpen} />
    </>
  );
}
