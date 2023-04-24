import queryClient from "@/app/common/utils/queryClient";
import { logError } from "@/app/common/utils/utils";
import { connectedUserAtom, socketAtom } from "@/app/state/global";
import { CollectionType, Property } from "@/app/types";
import { useAtom } from "jotai";
import _ from "lodash";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
  projectViewId: string;
  setProjectViewId: React.Dispatch<React.SetStateAction<string>>;
  searchFilter: string;
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
  showMyTasks: boolean;
  setShowMyTasks: React.Dispatch<React.SetStateAction<boolean>>;
  paymentFilter: "none" | "Paid" | "Pending Signature" | "Pending";
  setPaymentFilter: React.Dispatch<
    React.SetStateAction<"none" | "Paid" | "Pending Signature" | "Pending">
  >;
  fieldNeedsAttention: {
    [key: string]: boolean;
  };
  reasonFieldNeedsAttention: {
    [key: string]: string;
  };
  getIfFieldNeedsAttention: (value: Property) => {
    needsAttention: boolean;
    reason: string;
  };
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  colorMapping: {
    [key: string]: string;
  };
  scrollContainerRef: React.RefObject<HTMLDivElement>;
};

export const LocalCollectionContext = createContext<LocalCollectionContextType>(
  {} as LocalCollectionContextType
);

export function useProviderLocalCollection() {
  const router = useRouter();
  const { collection: colId } = router.query;
  const { refetch: fetchCollection, data } = useQuery<CollectionType>(
    ["collection", colId],
    () =>
      fetch(
        process.env.NEXT_PUBLIC_USE_WORKER === "true"
          ? `https://worker.spect.network/collection/${colId}`
          : `${process.env.API_HOST}/collection/v1/slug/${colId as string}`,
        {
          credentials: "include",
        }
      ).then((res) => {
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
  const [view, setView] = useState(0);
  const [socket, setSocket] = useAtom(socketAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const [projectViewId, setProjectViewId] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [paymentFilter, setPaymentFilter] =
    useState<"none" | "Paid" | "Pending Signature" | "Pending">("none");
  const [fieldNeedsAttention, setFieldNeedsAttention] = useState(
    {} as {
      [key: string]: boolean;
    }
  );
  const [reasonFieldNeedsAttention, setReasonFieldNeedsAttention] = useState(
    {} as {
      [key: string]: string;
    }
  );
  const [colorMapping, setColorMapping] = useState(
    {} as { [key: string]: string }
  );

  const [currentPage, setCurrentPage] = useState("start");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateCollection = (collection: CollectionType) => {
    queryClient.setQueryData(["collection", colId], collection);
    setLocalCollection(collection);
  };

  const getIfFieldNeedsAttention = (value: Property) => {
    let res = { needsAttention: false, reason: "" };
    if (value.viewConditions && value.viewConditions.length > 0) {
      for (const condition of value.viewConditions) {
        if (condition.type === "data") {
          if (
            condition.data?.field &&
            !localCollection.properties[condition.data?.field?.value]
          ) {
            res = {
              needsAttention: true,
              reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but doesn't exist on the form`,
            };
            break;
          }
          if (
            condition.data?.field &&
            !localCollection.properties[condition.data?.field?.value]
              ?.isPartOfFormView
          ) {
            res = {
              needsAttention: true,
              reason: `"${condition.data?.field?.label}" field has been added to visibility conditions but is an internal field`,
            };
            break;
          }
        }
      }
    }
    return res;
  };

  useEffect(() => {
    let fieldsThatNeedAttention = {} as {
      [key: string]: boolean;
    };
    let reasonFieldNeedsAttention = {} as {
      [key: string]: string;
    };
    Object.entries(localCollection.properties || {}).forEach(([key, value]) => {
      const res = getIfFieldNeedsAttention(value);
      fieldsThatNeedAttention[key] = res?.needsAttention;
      reasonFieldNeedsAttention[key] = res?.reason;
      if (res?.needsAttention) {
        toast.warning(`${key} field needs attention, ${res?.reason}`);
      }
    });
    setFieldNeedsAttention(fieldsThatNeedAttention);
    setReasonFieldNeedsAttention(reasonFieldNeedsAttention);

    let colorMapping = {};
    Object.entries(localCollection.properties || {}).forEach(([key, value]) => {
      if (["singleSelect", "multiSelect"].includes(value.type)) {
        if (value.options && value.options.length > 0) {
          const colorMap = value.options.reduce((acc, option) => {
            if (option.color) acc[option.value] = option.color;
            return acc;
          }, {} as { [key: string]: string });
          colorMapping = {
            ...colorMapping,
            ...(colorMap || {}),
          };
        }
      }
    });
    setColorMapping(colorMapping);
  }, [localCollection.properties]);

  useEffect(() => {
    if (data) {
      setLocalCollection(data);
      if (data.collectionType === 1) {
        setProjectViewId(data.projectMetadata.viewOrder[0]);
      }
    } else setLocalCollection({} as CollectionType);
    if (colId) {
      setLoading(true);
      fetchCollection()
        .then((res) => {
          if (res.data?.unauthorized) {
            setLoading(false);
            console.log("failed");
            setTimeout(() => {
              toast.error(
                "You are not authorized to view this collection, either you are not part of the circle or you dont have the required role",
                {
                  theme: "dark",
                }
              );
            }, 1500);
          }

          if (res.data) {
            res.data.parents = [
              {
                ...res.data.parents[0],
                description: "",
              },
            ];
            setLocalCollection(res.data);
            if (res.data.collectionType === 1) {
              setProjectViewId(res.data.projectMetadata.viewOrder[0]);
            }
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong while fetching collection");
          setLoading(false);
        });
    }
  }, [colId, fetchCollection]);

  useEffect(() => {
    if (socket && socket.on && localCollection.slug) {
      socket.on(
        `${localCollection.slug}:dataAdded`,
        (collection: CollectionType) => {
          console.log("data added event");
          updateCollection(collection);
        }
      );
      socket.on(
        `${localCollection.slug}:newActivityPrivate`,
        _.debounce((event: { data: CollectionType; user: string }) => {
          if (event.user !== connectedUser) {
            console.log("update event");
            updateCollection(event.data);
          }
        }, 2000)
      );
    }
    return () => {
      if (socket && socket.off) {
        socket.off(`${localCollection.slug}:dataAdded`);
        socket.off(`${localCollection.slug}:newActivityPrivate`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCollection.slug]);

  return {
    localCollection,
    setLocalCollection,
    error,
    setError,
    loading,
    updateCollection,
    updating,
    setUpdating,
    view,
    setView,
    projectViewId,
    setProjectViewId,
    searchFilter,
    setSearchFilter,
    showMyTasks,
    setShowMyTasks,
    paymentFilter,
    setPaymentFilter,
    fieldNeedsAttention,
    reasonFieldNeedsAttention,
    getIfFieldNeedsAttention,
    currentPage,
    setCurrentPage,
    colorMapping,
    scrollContainerRef,
  };
}

export const useLocalCollection = () => useContext(LocalCollectionContext);
