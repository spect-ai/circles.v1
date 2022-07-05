import queryClient from "@/app/common/utils/queryClient";
import { ProjectType } from "@/app/types";
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
      fetch(`${process.env.API_HOST}/project/slug/${pId as string}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
      notifyOnChangeProps: "tracked",
    }
  );
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [localProject, setLocalProject] = useState({} as ProjectType);
  const [error, setError] = useState(false);
  const updateProject = (project: ProjectType) => {
    queryClient.setQueryData(["project", pId], project);
    setLocalProject(project);
  };

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
  };
}

export const useLocalProject = () => useContext(LocalProjectContext);
