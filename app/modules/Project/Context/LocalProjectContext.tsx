import { ProjectType } from "@/app/types";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

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
  const { data: project, refetch: fetchProject } = useQuery<ProjectType>(
    ["project", pId],
    () =>
      fetch(`${process.env.API_HOST}/project/slug/${pId as string}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
      notifyOnChangeProps: "tracked",
    }
  );
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const [localProject, setLocalProject] = useState({} as ProjectType);
  const [error, setError] = useState(false);
  const updateProject = (project: ProjectType) => {
    queryClient.setQueryData(["project", pId], project);
    setLocalProject(project);
  };

  useEffect(() => {
    if (pId) {
      fetchProject()
        .then((res) => {
          if (res.data) {
            setLocalProject(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong", {
            theme: "dark",
          });
        });
    }
  }, [pId]);

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
