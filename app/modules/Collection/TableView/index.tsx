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
import AddField from "../AddField";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import DataModal from "../Form/DataModal";
import ExandableCell from "../Form/ExpandableCell";
import GutterColumnComponent from "./GutterColumnComponent";
import HeaderComponent from "./HeaderComponent";
import SelectComponent from "./SelectComponent";

export default function TableView() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");

  const [data, setData] = useState<any[]>();
  const { localCollection: collection } = useLocalCollection();

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
      case "longText":
        return ExandableCell;
      case "number":
        return floatColumn;
      case "date":
        return dateColumn;
      case "singleSelect":
        return SelectComponent;
      case "user":
        return SelectComponent;
      case "user[]":
        return ExandableCell;
      case "multiSelect":
        return ExandableCell;
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
      </AnimatePresence>
      <DataModal />
      {collection.name && (
        <DynamicDataSheetGrid
          value={data}
          onChange={(value) => {
            setData(value);
          }}
          columns={columns}
          gutterColumn={{
            component: GutterColumnComponent,
            minWidth: 50,
          }}
        />
      )}
    </Box>
  );
}
