import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import {
  CardType,
  ProjectCardActionsType,
  ProjectType,
  AdvancedFilters,
} from "@/app/types";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

type LocalProjectContextType = {
  localProject: ProjectType;
  setLocalProject: React.Dispatch<React.SetStateAction<ProjectType>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  updateProject: (project: ProjectType) => void;
  updating: boolean;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  projectCardActions: ProjectCardActionsType | undefined;
  fetchQuickActions: () => void;
  batchPayModalOpen: boolean;
  setBatchPayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCard: CardType | null;
  setSelectedCard: React.Dispatch<React.SetStateAction<CardType | null>>;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitModalOpen: boolean;
  setIsSubmitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  advFilters: AdvancedFilters;
  setAdvFilters: React.Dispatch<React.SetStateAction<AdvancedFilters>>;
};

export const LocalProjectContext = createContext<LocalProjectContextType>(
  {} as LocalProjectContextType
);

export function useProviderLocalProject() {
  const router = useRouter();
  const { project: pId } = router.query;
  const { refetch: fetchProject } = useQuery<ProjectType>(
    ["project", pId],
    () =>
      fetch(`${process.env.API_HOST}/project/v1/slug/${pId as string}`, {
        credentials: "include",
      }).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  const { connectedUser } = useGlobal();

  const { data: projectCardActions, refetch: fetchQuickActions } =
    useQuery<ProjectCardActionsType>(
      ["projectCardActions", pId],
      () =>
        fetch(`${process.env.API_HOST}/card/myValidActionsInProject/${pId}/`, {
          credentials: "include",
        }).then((res) => res.json()),
      {
        enabled: false,
      }
    );

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [localProject, setLocalProject] = useState({} as ProjectType);
  const [error, setError] = useState(false);

  const [batchPayModalOpen, setBatchPayModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({} as CardType | null);

  const [advFilters, setAdvFilters] = useState<AdvancedFilters>({
    inputTitle: "",
    groupBy: "Status",
    sortBy: "none",
    order: "des",
    show: {
      subTasks: false,
    },
  });

  const { socket } = useGlobal();

  const updateProject = (project: ProjectType) => {
    queryClient.setQueryData(["project", pId], project);
    setLocalProject(project);
  };

  useEffect(() => {
    if (pId) {
      void fetchQuickActions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedUser, pId]);

  useEffect(() => {
    if (socket && socket.on) {
      socket.on(
        `${pId}:projectUpdate`,
        (event: { data: ProjectType; user: string }) => {
          console.log({ event });
          if (event.user !== connectedUser) {
            updateProject(event.data);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pId]);

  useEffect(() => {
    if (pId) {
      setLoading(true);
      fetchProject()
        .then((res) => {
          if (res.data) {
            setLocalProject(res.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong", {
            theme: "dark",
          });
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pId]);

  return {
    localProject,
    setLocalProject,
    error,
    setError,
    loading,
    updateProject,
    updating,
    setUpdating,
    projectCardActions: !connectedUser ? undefined : projectCardActions,
    fetchQuickActions,
    batchPayModalOpen,
    setBatchPayModalOpen,
    selectedCard,
    setSelectedCard,
    isApplyModalOpen,
    setIsApplyModalOpen,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    advFilters,
    setAdvFilters,
  };
}

export const useLocalProject = () => useContext(LocalProjectContext);
