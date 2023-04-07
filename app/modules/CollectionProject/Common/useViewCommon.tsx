/* eslint-disable @typescript-eslint/no-explicit-any */
import { reorder } from "@/app/common/utils/utils";
import {
  updateCollectionDataGuarded,
  updateFormCollection,
} from "@/app/services/Collection";
import { MemberDetails, Option, UserType } from "@/app/types";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import {
  isMyCard,
  paymentStatus,
  satisfiesConditions,
} from "../../Collection/Common/SatisfiesFilter";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function useViewCommon() {
  const {
    localCollection: collection,
    projectViewId,
    updateCollection,
    searchFilter,
    showMyTasks,
    paymentFilter,
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

  const [filteredOnGroupByColumn, setFilteredOnGroupByColumn] = useState(false);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

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
          keys: collection.propertyOrder.map((prop) => {
            if (collection.properties[prop].type === "user") {
              return (item: string) => {
                const member = collection.data[item][prop]?.value;
                return memberDetails?.memberDetails[member]?.username;
              };
            }
            if (collection.properties[prop].type === "multiSelect") {
              return (item: string) =>
                collection.data[item][prop]?.map(
                  (option: Option) => option.label
                );
            }

            return (item: string) =>
              collection.data[item][prop]?.label || collection.data[item][prop];
          }),
        })
      );
    }
    if (view.filters?.length) {
      newCardOrder = newCardOrder.map((group) =>
        group.filter((cardId) =>
          satisfiesConditions(
            collection.data[cardId],
            collection.properties,
            view.filters || []
          )
        )
      );
      // check if the filters are on the groupByColumn
      const filteredOnGroupByColumn2 = view.filters.some(
        (filter) => filter.data.field.value === view.groupByColumn
      );
      setFilteredOnGroupByColumn(filteredOnGroupByColumn2);
    }
    if (showMyTasks) {
      newCardOrder = newCardOrder.map((group) =>
        group.filter((cardId) =>
          isMyCard(
            collection.data[cardId],
            collection.properties,
            currentUser?.id || ""
          )
        )
      );
    }

    if (paymentFilter) {
      newCardOrder = newCardOrder.map((group) =>
        group.filter((cardId) =>
          paymentStatus(
            paymentFilter,
            cardId,
            collection.projectMetadata.paymentStatus
          )
        )
      );
    }

    if (view.sort?.property) {
      const { property: prop, direction } = view.sort;
      const propertyType = collection.properties[prop].type;
      const propertyOptions = collection.properties[prop].options as Option[];
      newCardOrder = newCardOrder.map((group) =>
        group?.sort((a, b) => {
          if (propertyType === "singleSelect") {
            const aIndex = propertyOptions.findIndex(
              (option) => option.value === collection.data[a][prop]?.value
            );
            const bIndex = propertyOptions.findIndex(
              (option) => option.value === collection.data[b][prop]?.value
            );
            if (direction === "asc") {
              return aIndex - bIndex;
            }
            return bIndex - aIndex;
          }
          if (propertyType === "user") {
            if (direction === "asc") {
              return collection.data[a][prop]?.label?.localeCompare(
                collection.data[b][prop]?.label
              );
            }
            return collection.data[b][prop]?.label?.localeCompare(
              collection.data[a][prop]?.label
            );
          }
          if (propertyType === "date") {
            const aDate = new Date(collection.data[a][prop]);
            const bDate = new Date(collection.data[b][prop]);
            if (direction === "asc") {
              return aDate.getTime() - bDate.getTime();
            }
            return bDate.getTime() - aDate.getTime();
          }
          if (propertyType === "reward") {
            const aChain = collection.data[a][prop]?.chain.label;
            const bChain = collection.data[b][prop]?.chain.label;
            if (aChain !== bChain) {
              if (direction === "asc") {
                return aChain?.localeCompare(bChain);
              }
              return bChain?.localeCompare(aChain);
            }
            const aToken = collection.data[a][prop]?.token.label;
            const bToken = collection.data[b][prop]?.token.label;
            if (aToken !== bToken) {
              if (direction === "asc") {
                return aToken.localeCompare(bToken);
              }
              return bToken.localeCompare(aToken);
            }
            const aValue = collection.data[a][prop]?.value;
            const bValue = collection.data[b][prop]?.value;
            if (direction === "asc") {
              return aValue - bValue;
            }
            return bValue - aValue;
          }

          if (direction === "asc") {
            return collection.data[a][prop]?.localeCompare(
              collection.data[b][prop]
            );
          }
          return collection.data[b][prop]?.localeCompare(
            collection.data[a][prop]
          );
        })
      );
    }
    setCardOrders(newCardOrder);
  }, [
    searchFilter,
    view.groupByColumn,
    memberDetails?.memberDetails,
    view.filters,
    view.sort,
    memberDetails?.members,
    showMyTasks,
    collection,
    paymentFilter,
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
      if (!isCardDrawerOpen) setIsCardDrawerOpen(true);
      else {
        setIsCardDrawerOpen(false);
        setTimeout(() => {
          setIsCardDrawerOpen(true);
        }, 1000);
      }
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
    ) {
      return;
    }

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
            [view.groupByColumn]: [
              ...cardColumnOrder.slice(0, columnIndex),
              newColumnOrder,
              ...cardColumnOrder.slice(columnIndex + 1),
            ],
          },
        },
      });
      updateFormCollection(collection.id, {
        projectMetadata: {
          ...collection.projectMetadata,
          cardOrders: {
            ...collection.projectMetadata.cardOrders,
            [view.groupByColumn]: [
              ...cardColumnOrder.slice(0, columnIndex),
              newColumnOrder,
              ...cardColumnOrder.slice(columnIndex + 1),
            ],
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
    const sourceIndex = newSourceColumnOrder.indexOf(draggableId);
    newSourceColumnOrder.splice(sourceIndex, 1);

    const newDestColumnOrder = Array.from(
      cardColumnOrder[destColumnIndex] || []
    );
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

    updateCollectionDataGuarded(collection.id, draggableId, {
      [view.groupByColumn]:
        destColumn.value === "__unassigned__" ? null : destColumn,
    }).then(() => {
      updateFormCollection(collection.id, {
        projectMetadata: {
          ...collection.projectMetadata,
          cardOrders: {
            ...collection.projectMetadata.cardOrders,
            [view.groupByColumn]: newCardColumnOrder,
          },
        },
      });
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
    filteredOnGroupByColumn,
  };
}
