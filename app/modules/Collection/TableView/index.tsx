/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addCollectionData,
  deleteCollectionData,
  updateCollectionDataGuarded,
} from "@/app/services/Collection";
import { Milestone, Option, PropertyType, Reward } from "@/app/types";
import { Box } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Column,
  DataSheetGrid,
  dateColumn,
  DynamicDataSheetGrid,
  floatColumn,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";
import { CellWithId } from "react-datasheet-grid/dist/types";
import { useScreenClass } from "react-grid-system";
import { toast } from "react-toastify";
import CardDrawer from "../../CollectionProject/CardDrawer";
import AddField from "../AddField";
import { satisfiesConditions } from "../Common/SatisfiesFilter";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import DataDrawer from "../Form/DataDrawer";
import ExpandableCell from "../Form/ExpandableCell";
import CredentialComponent from "./CredentialComponent";
import GutterColumnComponent from "./GutterColumnComponent";
import HeaderComponent from "./HeaderComponent";
import MilestoneComponent from "./MilestoneComponent";
import MultiMilestoneModal from "./MultiMilestoneModal";
import MultiURLComponent from "./MultiURLComponent";
import MultiURLModal from "./MultiURLModal";
import PaymentComponent from "./PaymentComponent";
import RewardComponent from "./RewardComponent";
import RewardModal from "./RewardModal";
import SelectComponent from "./SelectComponent";

export default function TableView() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [isRewardFieldOpen, setIsRewardFieldOpen] = useState(false);
  const [isURLFieldOpen, setIsURLFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [dataId, setDataId] = useState<string>("");
  const [multipleMilestoneModalOpen, setMultipleMilestoneModalOpen] =
    useState(false);
  const [data, setData] = useState<any[]>();
  const {
    localCollection: collection,
    updateCollection,
    searchFilter,
    projectViewId,
  } = useLocalCollection();

  const [expandedDataSlug, setExpandedDataSlug] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  const screenClass = useScreenClass();

  const router = useRouter();
  const { dataId: dataSlug, cardSlug } = router.query;

  useEffect(() => {
    if (dataSlug) {
      setExpandedDataSlug(dataSlug as string);
    }
    if (cardSlug) {
      setExpandedDataSlug(cardSlug as string);
    }
  }, [dataSlug, setExpandedDataSlug, cardSlug]);

  const updateData = async ({ row }: { row: any }) => {
    if (!row) return;
    console.log("UPDATING DATA");
    console.log({ row }, row.id);
    const res = await updateCollectionDataGuarded(collection.id, row.id, row);
    console.log({ row });
    if (!res) return;
    if (res.id) {
      console.log({ res });
      updateCollection(res);
    } else {
      toast.error("Error updating data");
    }
    return res;
  };

  useEffect(() => {
    if (collection.data) {
      // for each date property in the data, convert the date string to a date object for all the rows
      const dateProperties = collection.propertyOrder.map((property) => {
        if (collection.properties[property]?.type === "date")
          return collection.properties[property].name;
      });
      const data = Object.keys(collection.data).map((key) => {
        const row = collection.data[key];
        dateProperties.forEach((property) => {
          if (row[property as string])
            row[property as string] = new Date(row[property as string]);
        });
        return {
          id: key,
          ...row,
        };
      });

      setDataLoading(true);

      // filter the data based on the search filter
      let filteredData = matchSorter(Object.values(data), searchFilter, {
        keys: Object.keys(data[0]).map((key) => {
          return (item: any) => {
            if (key === "id") return item.id;
            if (collection.properties[key]?.type === "date") {
              console.log({ item: item[key], key });
              if (typeof item[key] === "string") {
                return new Date(item[key]).toLocaleDateString();
              }
              return item[key]?.toLocaleDateString();
            }
            if (collection.properties[key]?.type === "multiSelect") {
              return item[key]?.map((option: Option) => option.label);
            }
            return item[key]?.label || item[key];
          };
        }),
      });

      if (
        (collection.collectionType === 0 &&
          collection.projectMetadata.views?.["0x0"].filters) ||
        (collection.collectionType === 1 &&
          collection.projectMetadata.views[projectViewId].filters)
      ) {
        filteredData = filteredData.filter((row) => {
          return satisfiesConditions(
            collection.data[row.id],
            collection.properties,
            collection.projectMetadata.views[
              collection.collectionType === 0 ? "0x0" : projectViewId
            ].filters || []
          );
        });
      }

      if (
        (collection.collectionType === 1 &&
          collection.projectMetadata.views[projectViewId].sort?.property) ||
        (collection.collectionType === 0 &&
          collection.projectMetadata.views?.["0x0"].sort?.property)
      ) {
        const property =
          collection.properties[
            collection.projectMetadata.views[
              collection.collectionType === 0 ? "0x0" : projectViewId
            ].sort?.property || ""
          ];
        const propertyType = property.type;
        const propertyOptions = property.options as Option[];
        const direction =
          collection.projectMetadata.views[
            collection.collectionType === 0 ? "0x0" : projectViewId
          ].sort?.direction || "asc";
        const propertyName = property.name;
        filteredData = filteredData.sort((a: any, b: any) => {
          if (propertyType === "singleSelect") {
            const aIndex = propertyOptions.findIndex(
              (option) => option.value === a[propertyName]?.value
            );
            const bIndex = propertyOptions.findIndex(
              (option) => option.value === b[propertyName]?.value
            );
            if (direction === "asc") {
              return aIndex - bIndex;
            }
            return bIndex - aIndex;
          }
          if (propertyType === "user") {
            if (direction === "asc") {
              return a[propertyName]?.label?.localeCompare(
                b[propertyName]?.label
              );
            }
            return b[propertyName]?.label?.localeCompare(
              a[propertyName]?.label
            );
          }
          if (propertyType === "date") {
            const aDate = new Date(a[propertyName]);
            const bDate = new Date(b[propertyName]);
            if (direction === "asc") {
              return aDate.getTime() - bDate.getTime();
            }
            return bDate.getTime() - aDate.getTime();
          }
          if (propertyType === "reward") {
            // property has chain, token and value, need to sort it based on chain first, then token and then value
            const aChain = a[propertyName]?.chain.label;
            const bChain = b[propertyName]?.chain.label;
            if (aChain !== bChain) {
              if (direction === "asc") {
                return aChain?.localeCompare(bChain);
              }
              return bChain?.localeCompare(aChain);
            }
            const aToken = a[propertyName]?.token.label;
            const bToken = b[propertyName]?.token.label;
            if (aToken !== bToken) {
              if (direction === "asc") {
                return aToken.localeCompare(bToken);
              }
              return bToken.localeCompare(aToken);
            }
            const aValue = a[propertyName]?.value;
            const bValue = b[propertyName]?.value;
            if (direction === "asc") {
              return aValue - bValue;
            }
            return bValue - aValue;
          }

          if (
            propertyType === "multiSelect" ||
            propertyType === "user[]" ||
            propertyType === "payWall"
          )
            return;

          if (direction === "asc") {
            return a[propertyName]?.localeCompare(b[propertyName]);
          }
          return b[propertyName]?.localeCompare(a[propertyName]);
        });
      }
      setTimeout(() => {
        setDataLoading(false);
      }, 400);
      setData(filteredData);
    }
  }, [
    collection.collectionType,
    collection.data,
    collection.projectMetadata?.views,
    collection.properties,
    collection.propertyOrder,
    projectViewId,
    searchFilter,
  ]);

  const sortData = (columnName: string, asc: boolean) => {
    if (data) {
      const sortedData = [...data].sort((a: any, b: any) => {
        if (
          ["longText", "shortText", "date", "singleURL"].includes(
            collection.properties[columnName].type
          )
        ) {
          if (a[columnName] < b[columnName]) {
            return asc ? -1 : 1;
          }
          if (a[columnName] > b[columnName]) {
            return asc ? 1 : -1;
          }
          return 0;
        }
        if (["reward"].includes(collection.properties[columnName].type)) {
          if (a[columnName].value < b[columnName].value) {
            return asc ? -1 : 1;
          }
          if (a[columnName].value > b[columnName].value) {
            return asc ? 1 : -1;
          }
          return 0;
        }
        return 0;
      });
      setData(sortedData);
    }
  };
  const getCellComponent = (type: PropertyType) => {
    switch (type) {
      case "shortText":
        return textColumn;
      case "ethAddress":
        return textColumn;
      case "singleURL":
        return textColumn;
      case "longText":
        return ExpandableCell;
      case "number":
        return floatColumn;
      case "date":
        return dateColumn;
      case "singleSelect":
        return SelectComponent;
      case "user":
        return SelectComponent;
      case "reward":
        return RewardComponent;
      case "payWall":
        return PaymentComponent;
      case "user[]":
        return ExpandableCell;
      case "multiSelect":
        return ExpandableCell;
      case "multiURL":
        return MultiURLComponent;
      case "milestone":
        return MilestoneComponent;
      default:
        return textColumn;
    }
  };

  const columns: Column<any>[] =
    collection.propertyOrder &&
    collection.propertyOrder.map((propertyName: string) => {
      const property = collection.properties[propertyName];
      if (
        ["singleSelect", "multiSelect", "longText", "user", "user[]"].includes(
          property.type
        )
      ) {
        return {
          ...keyColumn(property.name, {
            component: getCellComponent(property.type) as any,
            columnData: property,
          }),
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={property.type}
            />
          ),
          minWidth: 200,
        };
      } else if (["reward"].includes(property.type)) {
        return {
          component: getCellComponent(property.type) as any,
          columnData: {
            property,
            setIsRewardFieldOpen,
            setPropertyName,
            setDataId,
          },
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={property.type}
            />
          ),
          minWidth: 200,
        };
      } else if (["milestone"].includes(property.type)) {
        return {
          component: getCellComponent(property.type) as any,
          columnData: {
            property,
            setMultipleMilestoneModalOpen,
            setPropertyName,
            setDataId,
          },
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={property.type}
            />
          ),
          minWidth: 200,
        };
      } else if (["payWall"].includes(property.type)) {
        return {
          component: getCellComponent(property.type) as any,
          columnData: {
            property,
            setPropertyName,
            setDataId,
          },
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={property.type}
            />
          ),
          minWidth: 200,
        };
      } else if (["multiURL"].includes(property.type)) {
        return {
          component: getCellComponent(property.type) as any,
          columnData: {
            property,
            setIsURLFieldOpen,
            setPropertyName,
            setDataId,
          },
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={property.type}
            />
          ),
          minWidth: 200,
        };
      } else {
        return {
          ...keyColumn(property.name, getCellComponent(property.type) as any),
          disabled:
            collection.collectionType === 0 ? property.isPartOfFormView : false,
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={property.type}
            />
          ),
          minWidth: 200,
        };
      }
    });

  const columnsWithCredentials = collection.formMetadata
    ?.credentialCurationEnabled
    ? [
        {
          component: CredentialComponent,
          columnData: {},
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={"Responder"}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
              propertyType={"user"}
            />
          ),
          minWidth: 150,
        },
        ...columns,
      ]
    : columns;

  return (
    <Box>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
        {isRewardFieldOpen && (
          <RewardModal
            value={data?.find((row) => row.id === dataId)?.[propertyName]}
            form={collection}
            propertyName={propertyName}
            handleClose={async (
              reward: Reward,
              dataId: string,
              propertyName: string
            ) => {
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyName] = reward;
                  console.log({ tempdata: tempData[row][propertyName] });
                  setData(tempData);
                  setIsRewardFieldOpen(false);
                  // await updateData({
                  //   cell: { row, col: 0, colId: propertyName },
                  // });
                  console.log({ updatedData: data[row][propertyName] });
                }
                setIsRewardFieldOpen(false);
              }
            }}
            dataId={dataId}
          />
        )}
        {isURLFieldOpen && (
          <MultiURLModal
            form={collection}
            propertyName={propertyName}
            handleClose={async (
              payment: Option[],
              dataId: string,
              propertyName: string
            ) => {
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);

                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyName] = payment;
                  setData(tempData);
                  setIsURLFieldOpen(false);
                  // await updateData({
                  //   cell: { row, col: 0, colId: propertyName },
                  // });
                }
                setIsURLFieldOpen(false);
              }
            }}
            dataId={dataId}
          />
        )}
        {multipleMilestoneModalOpen && (
          <MultiMilestoneModal
            form={collection}
            propertyName={propertyName}
            dataId={dataId}
            handleClose={async (
              value: Milestone[],
              dataId: string,
              propertyName: string
            ) => {
              if (
                collection.collectionType === 0
                  ? collection.properties[propertyName].isPartOfFormView
                  : false
              ) {
                setMultipleMilestoneModalOpen(false);
                return;
              }
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                console.log({ value });
                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyName] = value;
                  setData(tempData);
                  setMultipleMilestoneModalOpen(false);
                  console.log({ tempData });
                  // const res = await updateData({
                  //   cell: { row, col: 0, colId: propertyName },
                  // });
                  // if (res.id) updateCollection(res);
                }
                setMultipleMilestoneModalOpen(false);
              }
            }}
          />
        )}
        {collection.collectionType === 0 && expandedDataSlug && (
          <DataDrawer
            expandedDataSlug={expandedDataSlug}
            setExpandedDataSlug={setExpandedDataSlug}
          />
        )}
        {collection.collectionType === 1 && expandedDataSlug && (
          <CardDrawer
            handleClose={() => setExpandedDataSlug("")}
            defaultValue={data?.find((d) => d.slug === expandedDataSlug)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {collection.name && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <DataSheetGrid
              rowHeight={41}
              value={data}
              height={
                screenClass === "xxl"
                  ? 700
                  : screenClass === "xl"
                  ? 600
                  : screenClass === "lg"
                  ? 550
                  : screenClass === "md"
                  ? 500
                  : screenClass === "sm"
                  ? 500
                  : 500
              }
              onChange={async (newData, operations) => {
                setData(newData);
                console.log({ operations });
                const row = newData.slice(
                  operations[0].fromRowIndex,
                  operations[0].toRowIndex
                )[0];
                updateData({ row });
              }}
              columns={columnsWithCredentials}
              gutterColumn={{
                component: GutterColumnComponent,
                minWidth: 50,
              }}
              lockRows
              disableExpandSelection
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
