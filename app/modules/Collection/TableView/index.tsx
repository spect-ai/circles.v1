import { PropertyType } from "@/app/types";
import { Box } from "degen";
import React, { useState } from "react";
import {
  Column,
  dateColumn,
  DynamicDataSheetGrid,
  floatColumn,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";
import { mockData } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import ExandableCell from "../Form/ExpandableCell";
import HeaderComponent from "./HeaderComponent";
import SelectComponent from "./SelectComponent";

export default function TableView() {
  const [data, setData] = useState<any[]>(mockData);
  const { localCollection: collection } = useLocalCollection();

  const sortData = (columnName: string, asc: boolean) => {
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
  };

  const getCellComponent = (type: PropertyType) => {
    switch (type) {
      case "shortText":
        return textColumn;
      case "longText":
        return textColumn;
      case "number":
        return floatColumn;
      case "date":
        return dateColumn;
      case "singleSelect":
        return SelectComponent;
      case "multiSelect":
        return ExandableCell;
      default:
        return textColumn;
    }
  };

  const columns: Column<any>[] = Object.values(collection.properties).map(
    (property) => {
      if (["singleSelect", "multiSelect"].includes(property.type)) {
        return {
          ...keyColumn(property.name, {
            component: getCellComponent(property.type) as any,
            columnData: property,
          }),
          title: (
            <HeaderComponent sortData={sortData} columnName={property.name} />
          ),
          minWidth: 200,
        };
      } else {
        return {
          ...keyColumn(property.name, getCellComponent(property.type) as any),
          title: (
            <HeaderComponent sortData={sortData} columnName={property.name} />
          ),
          minWidth: 200,
        };
      }
    }
  );
  return (
    <Box padding="8">
      <DynamicDataSheetGrid
        value={data}
        onChange={(value) => {
          setData(value);
        }}
        columns={columns}
      />
    </Box>
  );
}
