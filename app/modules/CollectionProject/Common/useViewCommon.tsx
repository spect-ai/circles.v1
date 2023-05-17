/* eslint-disable @typescript-eslint/no-explicit-any */
import { logError, reorder } from "@/app/common/utils/utils";
import {
  updateCollectionDataGuarded,
  updateFormCollection,
} from "@/app/services/Collection";
import { ConditionGroup, MemberDetails, Option, UserType } from "@/app/types";
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
import { satisfiesAdvancedConditions } from "../../Collection/Common/SatisfiesAdvancedFilter";
import { sortFieldValues } from "../../Collection/Common/SortFieldValues";
import { useCircle } from "../../Circle/CircleContext";

export default function useViewCommon() {
  const { registry } = useCircle();
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

  const { data: currentUser, refetch } = useQuery<UserType>("getMyUser", {
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
          keys: collection.propertyOrder.map((property) => {
            if (collection.properties[property].type === "user") {
              return (item: string) => {
                const member = collection.data?.[item][property]?.value;
                return memberDetails?.memberDetails[member]?.username;
              };
            }
            if (collection.properties[property].type === "multiSelect") {
              return (item: string) => {
                return collection.data?.[item][property]?.map(
                  (option: Option) => option.label
                );
              };
            }

            return (item: string) => {
              return (
                collection.data?.[item][property]?.label ||
                collection.data?.[item][property]
              );
            };
          }),
        })
      );
    }
    if (view.advancedFilters?.order?.length) {
      newCardOrder = newCardOrder.map((group) => {
        return group.filter((cardId) => {
          return satisfiesAdvancedConditions(
            collection.data?.[cardId],
            collection.properties,
            view.advancedFilters || ({} as ConditionGroup)
          );
        });
      });
    }
    if (showMyTasks) {
      newCardOrder = newCardOrder.map((group) => {
        return group.filter((cardId) => {
          return isMyCard(
            collection.data?.[cardId],
            collection.properties,
            currentUser?.id || ""
          );
        });
      });
    }

    if (paymentFilter) {
      newCardOrder = newCardOrder.map((group) => {
        return group.filter((cardId) => {
          return paymentStatus(
            paymentFilter,
            cardId,
            collection.projectMetadata.paymentStatus
          );
        });
      });
    }

    if (view.sort?.property) {
      const property =
        collection.properties[
          collection.projectMetadata.views[
            collection.collectionType === 0 ? "0x0" : projectViewId
          ].sort?.property || ""
        ];
      if (!property) {
        setCardOrders(newCardOrder);
        return;
      }
      const direction =
        collection.projectMetadata.views[
          collection.collectionType === 0 ? "0x0" : projectViewId
        ].sort?.direction || "asc";
      const propertyId = property.id;
      const cardToColumnIndex = newCardOrder.reduce((acc, group, index) => {
        group.forEach((cardId) => {
          acc[cardId] = index;
        });
        return acc;
      }, {} as any);
      const flattenedCards = newCardOrder.flat().map((cardId) => {
        return collection.data?.[cardId];
      });

      const sortedCardOutput = Array.from(
        { length: newCardOrder.length },
        () => []
      ) as string[][];
      sortFieldValues(
        flattenedCards,
        collection,
        propertyId,
        direction,
        registry
      ).then((sortedCards) => {
        sortedCards.forEach((card: { slug: string }) => {
          console.log({ idx: cardToColumnIndex[card.slug] });
          sortedCardOutput[cardToColumnIndex[card.slug]].push(card.slug);
        });
        setCardOrders(sortedCardOutput);
      });
    } else setCardOrders(newCardOrder);
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
      let options = Array.from(property.options as Option[]);
      if (view.advancedFilters?.order?.length) {
        const validOids = view.advancedFilters?.order.filter((oid) => {
          if (view.advancedFilters?.conditions?.[oid]) {
            return (
              view.advancedFilters?.conditions?.[oid]?.data?.field?.value ===
              view.groupByColumn
            );
          } else if (view.advancedFilters?.conditionGroups?.[oid]) {
            return Object.keys(
              view.advancedFilters?.conditionGroups?.[oid]?.conditions
            ).some((cid) => {
              return (
                view.advancedFilters?.conditionGroups?.[oid]?.conditions?.[cid]
                  ?.data?.field?.value === view.groupByColumn
              );
            });
          }
          return false;
        });
        const conditionGroup = {
          ...view.advancedFilters,
          order: validOids,
        };

        options = options.map((c) => {
          return {
            ...c,
            satisfiesCondition: satisfiesAdvancedConditions(
              {
                [view.groupByColumn]: c,
              },
              collection.properties,
              conditionGroup
            ),
          };
        });
      } else {
        options = options.map((c) => {
          return {
            ...c,
            satisfiesCondition: true,
          };
        });
      }
      options.unshift({
        label: "Unassigned",
        value: "__unassigned__",
        satisfiesCondition: true,
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
  }, [memberDetails, property.options, property.type, projectViewId]);

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
            [view.groupByColumn]: [
              ...cardColumnOrder.slice(0, columnIndex),
              newColumnOrder,
              ...cardColumnOrder.slice(columnIndex + 1),
            ],
          },
        },
      });
      void updateFormCollection(collection.id, {
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
          ...collection.data?.[draggableId],
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
  };
}
