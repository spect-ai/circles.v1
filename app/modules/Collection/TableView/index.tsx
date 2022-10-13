import { updateCollectionData } from "@/app/services/Collection";
import { PropertyType } from "@/app/types";
import { Box } from "degen";
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
import RewardComponent from "./RewardComponent";
import RewardModal from "./RewardModal";
import SelectComponent from "./SelectComponent";

export default function TableView() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [isRewardFieldOpen, setIsRewardFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [dataId, setDataId] = useState("");

  const [data, setData] = useState<any[]>();
  const { localCollection: collection } = useLocalCollection();

  const updateData = async ({ cell }: { cell: CellWithId }) => {
    if (data) {
      console.log(data);
      const row = data[cell.row];
      console.log({ row, cell });
      if (row) {
        const res = await updateCollectionData(collection.id, row.id, {
          [cell.colId as string]: row[cell.colId as string],
        });
        console.log({ res });
        // res.id &&
        //   setData(
        //     Object.keys(res.data).map((key) => {
        //       return {
        //         id: key,
        //         ...collection.data[key],
        //       };
        //     })
        //   );
        if (!res.id) {
          // setData(tempData);
          toast.error("Error updating data");
        }
      }
    }
  };

  useEffect(() => {
    if (collection.data) {
      setData(
        Object.keys(collection.data).map((key) => {
          return {
            id: key,
            ...collection.data[key],
          };
        })
      );
    }
  }, [collection.data]);

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
        // return dateColumn;
        return textColumn;
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
      default:
        return textColumn;
    }
  };

  const columns: Column<any>[] = Object.values(collection.properties).map(
    (property) => {
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
          ...keyColumn("id", {
            component: getCellComponent(property.type) as any,
            columnData: {
              property,
              setIsRewardFieldOpen,
              setPropertyName,
              setDataId,
            },
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
    }
  );
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
            propertyName={propertyName}
            handleClose={() => setIsRewardFieldOpen(false)}
            dataId={dataId}
          />
        )}
      </AnimatePresence>
      <DataModal />
      {collection.name && (
        <DynamicDataSheetGrid
          value={data}
          onChange={(data) => setData(data)}
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
