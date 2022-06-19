import { ProjectType } from "@/app/types";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

type LocalProjectContextType = {
  localProject: ProjectType;
  setLocalProject: React.Dispatch<React.SetStateAction<ProjectType>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};

export const LocalProjectContext = createContext<LocalProjectContextType>(
  {} as LocalProjectContextType
);

export function useProviderLocalProject() {
  const router = useRouter();
  const { project: pId } = router.query;
  const { data: project, isLoading } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const [localProject, setLocalProject] = useState({} as ProjectType);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isLoading) {
      setLoading(true);
      setLocalProject(project as ProjectType);
      setLoading(false);
    }
  }, [isLoading, project]);

  return {
    localProject,
    setLocalProject,
    error,
    setError,
    loading,
  };
}

export const useLocalProject = () => useContext(LocalProjectContext);
