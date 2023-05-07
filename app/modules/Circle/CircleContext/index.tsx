import queryClient from "@/app/common/utils/queryClient";
import { getPrivateCircleCredentials } from "@/app/services/PrivateCircle";
import { socketAtom } from "@/app/state/socket";
import {
  CirclePrivate,
  CircleType,
  MemberDetails,
  Registry,
  RetroType,
  UserType,
} from "@/app/types";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface CircleContextType {
  page: "Overview" | "Retro";
  setPage: (page: "Overview" | "Retro") => void;
  isLoading: boolean;
  isBatchPayOpen: boolean;
  setIsBatchPayOpen: (isBatchPayOpen: boolean) => void;
  circle: CircleType | undefined;
  memberDetails: MemberDetails | undefined;
  registry: Registry | undefined;
  fetchCircle: () => void;
  fetchMemberDetails: () => void;
  fetchRegistry: () => void;
  setCircleData: (data: CircleType) => void;
  setMemberDetailsData: (data: MemberDetails) => void;
  setRegistryData: (data: Registry) => void;
  mintkudosCommunityId: string;
  setMintkudosCommunityId: (isBatchPayOpen: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  navigationBreadcrumbs: any;
  setNavigationBreadcrumbs: (data: any) => void;
  justAddedDiscordServer: boolean;
  setJustAddedDiscordServer: (data: boolean) => void;
  privateCredentials: CirclePrivate;
  setPrivateCredentials: (data: CirclePrivate) => void;
}

export const CircleContext = React.createContext<CircleContextType>(
  {} as CircleContextType
);

export function useProviderCircleContext() {
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;

  const [page, setPage] = useState<"Overview" | "Retro">("Overview");
  const [mintkudosCommunityId, setMintkudosCommunityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBatchPayOpen, setIsBatchPayOpen] = useState(false);
  const [socket, setSocket] = useAtom(socketAtom);
  const [justAddedDiscordServer, setJustAddedDiscordServer] = useState(false);
  const [privateCredentials, setPrivateCredentials] = useState<CirclePrivate>(
    {} as CirclePrivate
  );

  const {
    data: circle,
    refetch: refetchCircle,
    isLoading,
  } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/v1/slug/${cId as string}`, {
        credentials: "include",
      }).then((res) => {
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  const { data: memberDetails, refetch: fetchMemberDetails } =
    useQuery<MemberDetails>(
      ["memberDetails", cId],
      () =>
        fetch(
          `${process.env.API_HOST}/circle/${cId}/memberDetailsWithSlug?circleSlugs=${cId}`
        ).then((res) => res.json()),
      {
        enabled: false,
      }
    );

  const { data: registry, refetch: fetchRegistry } = useQuery<Registry>(
    ["registry", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/slug/${cId}/getRegistry`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  const { data: navigationBreadcrumbs, refetch: fetchNavigationBreadcrumbs } =
    useQuery<Registry>(
      ["navigationBreadcrumbs", cId],
      () =>
        fetch(
          `${process.env.API_HOST}/circle/v1/${circle?.id}/circleNavBreadcrumbs`
        ).then((res) => res.json()),
      {
        enabled: false,
      }
    );

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const setCircleData = (data: CircleType) => {
    queryClient.setQueryData(["circle", cId], data);
  };

  const fetchCircle = async () => {
    setLoading(true);
    await refetchCircle().then((res) => {
      if (res.data) {
        setCircleData(res.data);
      }
      setLoading(false);
    });
  };

  const setMemberDetailsData = (data: MemberDetails) => {
    queryClient.setQueryData(["memberDetails", cId], data);
  };

  const setRegistryData = (data: Registry) => {
    queryClient.setQueryData(["registry", cId], data);
  };

  const setNavigationBreadcrumbs = (data: any) => {
    queryClient.setQueryData(["navigationBreadcrumbs", cId], data);
  };

  useEffect(() => {
    if (cId) {
      void fetchCircle();
      void fetchRegistry();
      void fetchMemberDetails();
    }
    (async () => {
      console.log("STARTED TRACKING SESSION FOR CIRCLE" + cId);
      const mixpanel = (await import("mixpanel-browser")).default;
      process.env.NODE_ENV === "production" &&
        mixpanel.time_event("Circle Session");
      return () => {
        console.log("ENDED TRACKING SESSION FOR CIRCLE" + cId);
        process.env.NODE_ENV === "production" &&
          mixpanel.track("Circle Session", {
            circle: cId,
            user: currentUser?.username,
          });
      };
    })();
  }, [cId]);

  useEffect(() => {
    if (circle?.id) {
      void fetchNavigationBreadcrumbs();
    }
  }, [circle?.id]);

  useEffect(() => {
    if (socket && socket.on) {
      console.log("SOCKET ON");
      socket.on(
        `${cId}:paymentUpdate`,
        (event: { data: any; user: string }) => {
          console.log({ event, cId });
          if (circle && cId === event.data.circleSlug)
            setCircleData({
              ...circle,
              pendingPayments: event.data.pendingPayments,
              paymentDetails: event.data.paymentDetails,
              completedPayments: event.data.completedPayments,
              cancelledPayments: event.data.cancelledPayments,
              pendingSignaturePayments: event.data.pendingSignaturePayments,
            });
        }
      );
    }
  }, [cId, socket]);

  useEffect(() => {
    if (circle?.id) {
      const getPrivateCredentials = async () => {
        const res = await getPrivateCircleCredentials(circle?.id);
        setPrivateCredentials(res);
      };

      try {
        void getPrivateCredentials();
      } catch (e) {
        console.log(e);
      }
    }
  }, [circle?.id]);

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.discordGuildId) {
          if (circle?.discordGuildId !== event.data.discordGuildId) {
            void fetchCircle();
          } else {
            setJustAddedDiscordServer(true);
          }
        }
      },
      false
    );
  }, []);

  return {
    page,
    setPage,
    loading,
    setLoading,
    isBatchPayOpen,
    setIsBatchPayOpen,
    circle,
    memberDetails,
    registry,
    fetchCircle,
    fetchMemberDetails,
    fetchRegistry,
    setCircleData,
    setMemberDetailsData,
    setRegistryData,
    mintkudosCommunityId,
    setMintkudosCommunityId,
    navigationBreadcrumbs,
    setNavigationBreadcrumbs,
    isLoading,
    justAddedDiscordServer,
    setJustAddedDiscordServer,
    privateCredentials,
    setPrivateCredentials,
  };
}

export const useCircle = () => React.useContext(CircleContext);
