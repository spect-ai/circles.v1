import Modal from "@/app/common/components/Modal";
import {
  addCollectionData,
  deleteCollectionData,
  updateCollectionDataGuarded,
} from "@/app/services/Collection";
import { Milestone, PropertyType, Reward } from "@/app/types";
import { Box, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Column,
  dateColumn,
  DynamicDataSheetGrid,
  floatColumn,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";
import { CellWithId } from "react-datasheet-grid/dist/types";
import { toast } from "react-toastify";
import AddField from "../AddField";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import DataModal from "../Form/DataModal";
import ExpandableCell from "../Form/ExpandableCell";
import GutterColumnComponent from "./GutterColumnComponent";
import HeaderComponent from "./HeaderComponent";
import MilestoneComponent from "./MilestoneComponent";
import MultiMilestoneModal from "./MultiMilestoneModal";
import RewardComponent from "./RewardComponent";
import RewardModal from "./RewardModal";
import SelectComponent from "./SelectComponent";

export default function TableView() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [isRewardFieldOpen, setIsRewardFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [dataId, setDataId] = useState<string>("");
  const [multipleMilestoneModalOpen, setMultipleMilestoneModalOpen] =
    useState(false);
  const [data, setData] = useState<any[]>();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const updateData = async ({ cell }: { cell: CellWithId }) => {
    if (data) {
      const row = data[cell.row];
      if (!row) return;
      if (!row.id && Object.keys(row).length > 0) {
        return addData(row);
      }
      if (!row.id) return;
      if (row) {
        const res = await updateCollectionDataGuarded(collection.id, row.id, {
          [cell.colId as string]: row[cell.colId as string],
        });
        if (!res.id) {
          toast.error("Error updating data");
        }
        return res;
      }
    }
  };

  const addData = async (newData: any) => {
    if (data) {
      const res = await addCollectionData(collection.id, newData);
      if (res.id) {
        setData(
          Object.keys(res.data).map((key) => {
            return {
              id: key,
              ...res.data[key],
            };
          })
        );
      } else {
        console.error({ res });
        toast.error("Error adding data");
      }
    }
  };

  useEffect(() => {
    if (collection.data) {
      // for each data property in the data, convert the date string to a date object for all the rows
      const dataProperties = collection.propertyOrder.map((property) => {
        if (collection.properties[property]?.type === "date")
          return collection.properties[property].name;
      });
      const data = Object.keys(collection.data).map((key) => {
        const row = collection.data[key];
        dataProperties.forEach((property) => {
          if (row[property]) row[property] = new Date(row[property]);
        });
        return {
          id: key,
          ...row,
        };
      });
      setData(data);
    }
  }, [collection.data, collection.properties, collection.propertyOrder]);

  const sortData = (columnName: string, asc: boolean) => {
    if (data) {
      const sortedData = [...data].sort((a: any, b: any) => {
        if (a[columnName] < b[columnName]) {
          return asc ? -1 : 1;
        }
        if (a[columnName] > b[columnName]) {
          return asc ? 1 : -1;
        }
        return 0;
      });
      setData(sortedData);
    }
  };

  const getCellComponent = (type: PropertyType) => {
    console.log(type);
    switch (type) {
      case "shortText":
        return textColumn;
      case "ethAddress":
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
      case "user[]":
        return ExpandableCell;
      case "multiSelect":
        return ExpandableCell;
      case "milestone":
        return MilestoneComponent;
      default:
        return textColumn;
    }
  };

  const columns: Column<any>[] =
    collection.properties &&
    Object.values(collection.properties).map((property) => {
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
            />
          ),
          minWidth: 200,
        };
      } else {
        return {
          ...keyColumn(property.name, getCellComponent(property.type) as any),
          title: (
            <HeaderComponent
              sortData={sortData}
              columnName={property.name}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
            />
          ),
          minWidth: 200,
        };
      }
    });
  return (
    <Box padding="8">
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
        {isRewardFieldOpen && (
          <RewardModal
            form={collection}
            propertyName={propertyName}
            handleClose={async (
              reward: Reward,
              dataId: string,
              propertyName: string
            ) => {
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                console.log({ row });
                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyName] = reward;
                  setData(tempData);
                  setIsRewardFieldOpen(false);
                  await updateData({
                    cell: { row, col: 0, colId: propertyName },
                  });
                }
                setIsRewardFieldOpen(false);
              }
            }}
            dataId={dataId}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
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
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                console.log({ value });
                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyName] = value;
                  console.log({ tempData });
                  setData(tempData);
                  setMultipleMilestoneModalOpen(false);
                  console.log({ tempData });
                  const res = await updateData({
                    cell: { row, col: 0, colId: propertyName },
                  });
                  if (res.id) setLocalCollection(res);
                }
                setMultipleMilestoneModalOpen(false);
              }
            }}
          />
        )}
      </AnimatePresence>

      <DataModal />
      {collection.name && (
        <DynamicDataSheetGrid
          value={data}
          onChange={async (newData, operations) => {
            if (operations[0].type === "DELETE") {
              const dataIds = [];
              for (
                let i = operations[0].fromRowIndex;
                i < operations[0].toRowIndex;
                i++
              ) {
                data && dataIds.push(data[i].id);
              }
              setData(newData);
              const res = await deleteCollectionData(collection.id, dataIds);
              if (res.id) {
                setLocalCollection(res);
              } else toast.error("Error deleting data");
              return;
            }
            setData(newData);
          }}
          columns={columns}
          gutterColumn={{
            component: GutterColumnComponent,
            minWidth: 50,
          }}
          onBlur={updateData}
        />
      )}
    </Box>
  );
}
