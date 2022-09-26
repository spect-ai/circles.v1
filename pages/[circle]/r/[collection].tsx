import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import CollectionHeading from "@/app/modules/Collection/CollectionHeading";
import ProjectHeading from "@/app/modules/Project/ProjectHeading";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const CollectionPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, collection: colId } = router.query;
  const circlecontext = useProviderCircleContext();
  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <CircleContext.Provider value={circlecontext}>
        <PublicLayout>
          <CollectionHeading />
          <AnimatePresence
            exitBeforeEnter
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            {/* <Collection key={colId as string} /> */}
          </AnimatePresence>
        </PublicLayout>
      </CircleContext.Provider>
    </>
  );
};

export default CollectionPage;
