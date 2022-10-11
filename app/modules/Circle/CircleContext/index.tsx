import queryClient from "@/app/common/utils/queryClient";
import { CircleType, MemberDetails, Registry, RetroType } from "@/app/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface CircleContextType {
  page: "Overview" | "Retro";
  setPage: (page: "Overview" | "Retro") => void;
  isLoading: boolean;
  isBatchPayOpen: boolean;
  setIsBatchPayOpen: (isBatchPayOpen: boolean) => void;
  circle: CircleType;
  memberDetails: MemberDetails | undefined;
  registry: Registry | undefined;
  retro: RetroType | undefined;
  fetchCircle: () => void;
  fetchMemberDetails: () => void;
  fetchRegistry: () => void;
  fetchRetro: () => void;
  setCircleData: (data: CircleType) => void;
  setMemberDetailsData: (data: MemberDetails) => void;
  setRegistryData: (data: Registry) => void;
  setRetroData: (data: RetroType) => void;
  hasMintkudosCredentialsSetup: boolean;
  setHasMintkudosCredentialsSetup: (isBatchPayOpen: boolean) => void;
  mintkudosCommunityId: string;
  setMintkudosCommunityId: (isBatchPayOpen: string) => void;
  localCircle: CircleType;
  setLocalCircle: (circle: CircleType) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  navigationData: any;
  setNavigationData: (data: any) => void;
  navigationBreadcrumbs: any;
  setNavigationBreadcrumbs: (data: any) => void;
}

export const CircleContext = React.createContext<CircleContextType>(
  {} as CircleContextType
);

export function useProviderCircleContext() {
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;

  const [page, setPage] = useState<"Overview" | "Retro">("Overview");
  const [hasMintkudosCredentialsSetup, setHasMintkudosCredentialsSetup] =
    useState(false);
  const [mintkudosCommunityId, setMintkudosCommunityId] = useState("");
  const [localCircle, setLocalCircle] = useState({} as CircleType);
  const [loading, setLoading] = useState(false);

  const [isBatchPayOpen, setIsBatchPayOpen] = useState(false);

  const [navigationData, setNavigationData] = useState();
  const [navigationBreadcrumbs, setNavigationBreadcrumbs] = useState();

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

  const { data: retro, refetch: fetchRetro } = useQuery<RetroType>(
    ["retro", retroSlug],
    {
      enabled: false,
    }
  );

  const setCircleData = (data: CircleType) => {
    queryClient.setQueryData(["circle", cId], data);
    setLocalCircle(data);
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

  const setRetroData = (data: RetroType) => {
    queryClient.setQueryData(["retro", retroSlug], data);
  };

  const fetchNavigation = async () => {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circle?.id}/circleNav`,
      {
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setNavigationData(data);
    } else {
      return false;
    }
  };

  const fetchNavigationBreadcrumbs = async () => {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circle?.id}/circleNavBreadcrumbs`,
      {
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setNavigationBreadcrumbs(data);
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (cId) {
      void fetchCircle();
      void fetchRegistry();
      void fetchMemberDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cId]);

  useEffect(() => {
    if (circle?.id) {
      void fetchNavigation();
      void fetchNavigationBreadcrumbs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle?.id]);

  return {
    page,
    setPage,
    loading,
    setLoading,
    isBatchPayOpen,
    setIsBatchPayOpen,
    circle: circle || localCircle,
    memberDetails,
    registry,
    retro,
    fetchCircle,
    fetchMemberDetails,
    fetchRegistry,
    fetchRetro,
    setCircleData,
    setMemberDetailsData,
    setRegistryData,
    setRetroData,
    hasMintkudosCredentialsSetup,
    setHasMintkudosCredentialsSetup,
    mintkudosCommunityId,
    setMintkudosCommunityId,
    localCircle,
    setLocalCircle,
    navigationData,
    setNavigationData,
    navigationBreadcrumbs,
    setNavigationBreadcrumbs,
    isLoading,
  };
}

export const useCircle = () => React.useContext(CircleContext);
