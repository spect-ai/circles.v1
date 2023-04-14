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
import useConnectDiscordServer from "@/app/services/Discord/useConnectDiscordServer";
import { CircleType, MemberDetails, Registry } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useLocation } from "react-use";

const CollectionPage: NextPage = () => {
  const router = useRouter();

  const { circle: cId, collection: colId } = router.query;
  useConnectDiscordServer();
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
        title="Spect"
        description="Helping organizations centralize context, decentralize decision making & operate with ease."
        image="/og.jpg"
      />
      <CircleContext.Provider value={circlecontext}>
        <LocalCollectionContext.Provider value={context}>
          <PublicLayout>
            <Collection key={(colId as any).asdas.dasda as string} />
          </PublicLayout>
        </LocalCollectionContext.Provider>
      </CircleContext.Provider>
    </>
  );
};

export default CollectionPage;
