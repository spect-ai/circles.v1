import { ProjectType } from "@/app/types";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

type LocalProjectContextType = {
  localProject: ProjectType;
  setLocalProject: React.Dispatch<React.SetStateAction<ProjectType>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  updateProject: (project: ProjectType) => void;
};

export const LocalProjectContext = createContext<LocalProjectContextType>(
  {} as LocalProjectContextType
);

export function useProviderLocalProject() {
  const router = useRouter();
  const { project: pId } = router.query;
  const {
    data: project,
    isLoading,
    isFetching,
    isFetched,
  } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const queryClient = useQueryClient();

  const [localProject, setLocalProject] = useState({} as ProjectType);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateProject = (project: ProjectType) => {
    queryClient.setQueryData(["project", pId], project);
  };

  useEffect(() => {
    if (!isLoading && !isFetching && project?.id) {
      setLoading(true);
      setLocalProject(project);
      setLoading(false);
    }
  }, [isLoading, project, isFetching]);

  return {
    localProject,
    setLocalProject,
    error,
    setError,
    loading,
    updateProject,
  };
}

export const useLocalProject = () => useContext(LocalProjectContext);
