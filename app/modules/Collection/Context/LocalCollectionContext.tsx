import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import { CardType, CollectionType, AdvancedFilters } from "@/app/types";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

type LocalCollectionContextType = {
  localCollection: CollectionType;
  setLocalCollection: React.Dispatch<React.SetStateAction<CollectionType>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  updateCollection: (collection: CollectionType) => void;
  updating: boolean;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  advFilters: AdvancedFilters;
  setAdvFilters: React.Dispatch<React.SetStateAction<AdvancedFilters>>;
};

export const LocalCollectionContext = createContext<LocalCollectionContextType>(
  {} as LocalCollectionContextType
);

export function useProviderLocalCollection() {
  const router = useRouter();
  const { collection: colId } = router.query;
  const { refetch: fetchCollection } = useQuery<CollectionType>(
    ["collection", colId],
    () =>
      fetch(`${process.env.API_HOST}/collection/v1/slug/${colId as string}`, {
        credentials: "include",
      }).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [localCollection, setLocalCollection] = useState({} as CollectionType);
  const [error, setError] = useState(false);

  const [advFilters, setAdvFilters] = useState<AdvancedFilters>({
    inputTitle: "",
    groupBy: "Status",
    sortBy: "none",
    order: "des",
  });

  const updateCollection = (collection: CollectionType) => {
    queryClient.setQueryData(["collection", colId], collection);
    setLocalCollection(collection);
  };

  useEffect(() => {
    console.log(colId);
    if (colId) {
      setLoading(true);
      fetchCollection()
        .then((res) => {
          if (res.data) {
            setLocalCollection(res.data);
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
  }, []);

  return {
    localCollection,
    setLocalCollection,
    error,
    setError,
    loading,
    updateCollection,
    updating,
    setUpdating,
    advFilters,
    setAdvFilters,
  };
}

export const useLocalCollection = () => useContext(LocalCollectionContext);
