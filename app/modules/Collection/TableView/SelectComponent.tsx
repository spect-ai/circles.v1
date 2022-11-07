/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemberDetails } from "@/app/types";
import { useTheme } from "degen";
import { useRouter } from "next/router";
import { useLayoutEffect, useRef } from "react";
import { useQuery } from "react-query";
import Select from "react-select";

type Props = {
  focus: boolean;
  active: boolean;
  rowData: any;
  columnData: any;
  setRowData: any;
  stopEditing: any;
  isModalOpen?: boolean;
};

export default function SelectComponent({
  focus,
  active,
  rowData,
  columnData,
  setRowData,
  stopEditing,
  isModalOpen,
}: Props) {
  const ref: any = useRef<Select>(null);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const memberOptions = memberDetails?.members?.map((member: string) => ({
    label: memberDetails && memberDetails.memberDetails[member]?.username,
    value: member,
  }));

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [focus]);

  const { mode } = useTheme();
  return (
    <Select
      isDisabled={columnData.isPartOfFormView}
      isMulti={
        columnData.type === "multiSelect" || columnData.type === "user[]"
      }
      options={
        ["user", "user[]"].includes(columnData.type)
          ? memberOptions
          : columnData.options
      }
      value={rowData}
      ref={ref}
      menuIsOpen={
        columnData.type === "singleSelect" || columnData.type === "user"
          ? focus
          : undefined
      }
      menuPortalTarget={document.body}
      menuPlacement="bottom"
      menuPosition="absolute"
      onChange={(option) => {
        if (columnData.isPartOfFormView) return;
        setRowData(option);
        setTimeout(() => {
          stopEditing();
        }, 100);
      }}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1, // full width
          alignSelf: "stretch", // full height
          pointerEvents: isModalOpen ? undefined : focus ? undefined : "none",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: mode === "dark" ? "#1A1A1A" : "#FFFFFF",
          color: mode === "dark" ? "#FFFFFF" : "#000000",
        }),
        menuPortal: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
        control: (provided) => ({
          ...provided,
          boxShadow: "none",
          border: "none",
          background: mode === "dark" ? "rgb(20,20,20)" : "#FFFFFF",
        }),
        input: (provided) => ({
          ...provided,
          color: mode === "dark" ? "#FFFFFF" : "#000000",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: mode === "dark" ? "#FFFFFF" : "#000000",
        }),
        multiValue: () => ({
          backgroundColor: "rgb(191, 90, 242, 0.1)",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }),
        valueContainer: (provided) => ({
          ...provided,
          whiteSpace: "nowrap",
          overflow: "hidden",
          flexWrap: isModalOpen ? "wrap" : "nowrap",
          maxWidth: "90%",
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: "rgb(191, 90, 242)",
          padding: "0 8px",
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          color: "rgb(191, 90, 242)",
          cursor: "pointer",
          marginTop: "2px",
          ":hover": {
            color: "white",
          },
          display: isModalOpen ? "flex" : "none",
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused
            ? mode === "dark"
              ? "rgb(255, 255, 255, 0.1) !important"
              : "rgb(20, 20, 20, 0.1) !important"
            : state.isSelected
            ? mode === "dark"
              ? "rgb(255, 255, 255, 0.1) !important"
              : "rgb(20, 20, 20, 0.1) !important"
            : "transparent",
          color: mode === "dark" ? "#FFFFFF" : "#000000",
          cursor: "pointer",
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
    />
  );
}
