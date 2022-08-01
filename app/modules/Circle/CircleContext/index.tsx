/* eslint-disable react-hooks/exhaustive-deps */
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
  circle: CircleType | undefined;
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
}

export const CircleContext = React.createContext<CircleContextType>(
  {} as CircleContextType
);

export function useProviderCircleContext() {
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;

  const [page, setPage] = useState<"Overview" | "Retro">("Overview");
  const [isBatchPayOpen, setIsBatchPayOpen] = useState(false);

  const {
    data: circle,
    refetch: fetchCircle,
    isLoading,
  } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/slug/${cId as string}`).then(
        (res) => res.json()
      ),
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

  useEffect(() => {
    if (cId) {
      void fetchCircle();
      void fetchRegistry();
      void fetchMemberDetails();
    }
  }, [cId]);

  return {
    page,
    setPage,
    isLoading,
    isBatchPayOpen,
    setIsBatchPayOpen,
    circle,
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
  };
}

export const useCircle = () => React.useContext(CircleContext);
