/* eslint-disable @typescript-eslint/no-explicit-any */
import { reorder } from "@/app/common/utils/utils";
import {
  updateCollectionDataGuarded,
  updateFormCollection,
} from "@/app/services/Collection";
import { MemberDetails, Option } from "@/app/types";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import { satisfiesConditions } from "../../Collection/Common/SatisfiesFilter";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function useViewCommon() {
  const {
    localCollection: collection,
    projectViewId,
    updateCollection,
    searchFilter,
  } = useLocalCollection();

  const view = collection.projectMetadata.views[projectViewId];
  const property = collection.properties[view.groupByColumn];

  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState({} as any);

  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<Option[]>([]);

  const [cardOrders, setCardOrders] = useState(
    collection.projectMetadata.cardOrders[view.groupByColumn]
  );

  const router = useRouter();
  const { circle: cId, cardSlug, newCard } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  useEffect(() => {
    let newCardOrder =
      collection.projectMetadata.cardOrders[view.groupByColumn];
    if (searchFilter) {
      newCardOrder = collection.projectMetadata.cardOrders[
        view.groupByColumn
      ].map((group) =>
        matchSorter(group, searchFilter, {
          keys: collection.propertyOrder.map((property) => {
            if (collection.properties[property].type === "user") {
              return (item: string) => {
                const member = collection.data[item][property]?.value;
                return memberDetails?.memberDetails[member]?.username;
              };
            }
            if (collection.properties[property].type === "multiSelect") {
              return (item: string) => {
                return collection.data[item][property]?.map(
                  (option: Option) => option.label
                );
              };
            }

            return (item: string) => {
              return (
                collection.data[item][property]?.label ||
                collection.data[item][property]
              );
            };
          }),
        })
      );
    }
    if (view.filters?.length) {
      newCardOrder = newCardOrder.map((group) => {
        return group.filter((cardId) => {
          return satisfiesConditions(
            collection.data[cardId],
            collection.properties,
            view.filters || []
          );
        });
      });
    }

    setCardOrders(newCardOrder);
  }, [
    collection.data,
    collection.projectMetadata.cardOrders,
    searchFilter,
    view.groupByColumn,
    collection.propertyOrder,
    collection.properties,
    memberDetails?.memberDetails,
    view.filters,
  ]);

  useEffect(() => {
    if (property.type === "singleSelect") {
      const options = Array.from(property.options as Option[]);
      options.unshift({
        label: "Unassigned",
        value: "__unassigned__",
      });
      setColumns(options);
    } else if (property.type === "user" && memberDetails) {
      const memberOptions = memberDetails.members?.map((member: string) => ({
        label: memberDetails.memberDetails[member]?.username,
        value: member,
      }));
      memberOptions?.unshift({
        label: "Unassigned",
        value: "__unassigned__",
      });
      setColumns(memberOptions as Option[]);
    }
  }, [memberDetails, property.options, property.type]);

  useEffect(() => {
    if (cardSlug || newCard) {
      setIsCardDrawerOpen(true);
    } else {
      setIsCardDrawerOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSlug, newCard]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    const cardColumnOrder =
      collection.projectMetadata.cardOrders[view.groupByColumn];
    if (!destination || !cardColumnOrder) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (source.droppableId === destination.droppableId) {
      const columnIndex = columns.findIndex(
        (column) => column.value === source.droppableId
      );
      const oldColumnOrder = cardColumnOrder[columnIndex];
      const newColumnOrder = reorder(
        oldColumnOrder,
        source.index,
        destination.index
      );
      updateCollection({
        ...collection,
        projectMetadata: {
          ...collection.projectMetadata,
          cardOrders: {
            ...collection.projectMetadata.cardOrders,
            [view.groupByColumn]: {
              ...collection.projectMetadata.cardOrders[view.groupByColumn],
              [columnIndex]: newColumnOrder,
            },
          },
        },
      });
      void updateFormCollection(collection.id, {
        projectMetadata: {
          ...collection.projectMetadata,
          cardOrders: {
            ...collection.projectMetadata.cardOrders,
            [view.groupByColumn]: {
              ...collection.projectMetadata.cardOrders[view.groupByColumn],
              [columnIndex]: newColumnOrder,
            },
          },
        },
      });
      return;
    }

    const destColumn = columns.find(
      (c) => c.value === destination.droppableId
    ) as Option;

    const sourceColumnIndex = columns.findIndex(
      (column) => column.value === source.droppableId
    );
    const destColumnIndex = columns.findIndex(
      (column) => column.value === destination.droppableId
    );

    const newSourceColumnOrder = Array.from(cardColumnOrder[sourceColumnIndex]);

    newSourceColumnOrder.splice(source.index, 1);
    const newDestColumnOrder = Array.from(cardColumnOrder[destColumnIndex]);
    newDestColumnOrder.splice(destination.index, 0, draggableId);

    const newCardColumnOrder = Array.from(cardColumnOrder);
    newCardColumnOrder[sourceColumnIndex] = newSourceColumnOrder;
    newCardColumnOrder[destColumnIndex] = newDestColumnOrder;

    updateCollection({
      ...collection,
      data: {
        ...collection.data,
        [draggableId]: {
          ...collection.data[draggableId],
          [view.groupByColumn]:
            destColumn.value === "__unassigned__" ? null : destColumn,
        },
      },
      projectMetadata: {
        ...collection.projectMetadata,
        cardOrders: {
          ...collection.projectMetadata.cardOrders,
          [view.groupByColumn]: newCardColumnOrder,
        },
      },
    });

    void updateCollectionDataGuarded(collection.id, draggableId, {
      [view.groupByColumn]:
        destColumn.value === "__unassigned__" ? null : destColumn,
    });

    void updateFormCollection(collection.id, {
      projectMetadata: {
        ...collection.projectMetadata,
        cardOrders: {
          ...collection.projectMetadata.cardOrders,
          [view.groupByColumn]: newCardColumnOrder,
        },
      },
    });
  };

  return {
    columns,
    handleDragEnd,
    isCardDrawerOpen,
    loading,
    property,
    defaultValue,
    setDefaultValue,
    setIsCardDrawerOpen,
    setLoading,
    view,
    collection,
    projectViewId,
    updateCollection,
    cardSlug,
    newCard,
    cardOrders,
  };
}
