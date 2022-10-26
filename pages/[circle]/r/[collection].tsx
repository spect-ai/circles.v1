import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import { Collection } from "@/app/modules/Collection";
import CollectionHeading from "@/app/modules/Collection/CollectionHeading";
import {
  LocalCollectionContext,
  useProviderLocalCollection,
} from "@/app/modules/Collection/Context/LocalCollectionContext";
import { CircleType, MemberDetails, Registry } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const CollectionPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, collection: colId } = router.query;
  const circlecontext = useProviderCircleContext();
  const context = useProviderLocalCollection();

  const { data: circle, refetch: fetchCircle } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/v1/slug/${cId as string}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  const { refetch: fetchMemberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/${circle?.id}/memberDetails?circleIds=${circle?.id}`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const { refetch: fetchRegistry } = useQuery<Registry>(
    ["registry", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/slug/${cId}/getRegistry`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!circle && cId) {
      void fetchCircle();
      void fetchRegistry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle, cId]);

  useEffect(() => {
    if (circle?.id) {
      void fetchMemberDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle]);

  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <CircleContext.Provider value={circlecontext}>
        <LocalCollectionContext.Provider value={context}>
          <PublicLayout>
            <CollectionHeading />
            <AnimatePresence
              exitBeforeEnter
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              <Collection key={colId as string} />
            </AnimatePresence>
          </PublicLayout>
        </LocalCollectionContext.Provider>
      </CircleContext.Provider>
    </>
  );
};

export default CollectionPage;
