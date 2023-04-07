/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "degen";
import { FC } from "react";

import CreatableSelect from "react-select/creatable";

export type OptionType = {
  label: string;
  value: string;
  data?: any;
};

type Props =
  | {
      multiple: false;
      options: OptionType[];
      selected: OptionType | undefined;
      onChange: (option: OptionType) => void;
      placeholder?: string;
      portal?: boolean;
      isClearable?: boolean;
      disabled?: boolean;
    }
  | {
      multiple: true;
      options: OptionType[];
      selected: OptionType[] | undefined;
      onChange: (option: OptionType[]) => void;
      placeholder?: string;
      portal?: boolean;
      isClearable?: boolean;
      disabled?: boolean;
    };

const CreatableDropdown: FC<Props> = ({
  options,
  selected,
  onChange,
  multiple,
  placeholder,
  portal = true,
  isClearable = true,
  disabled = false,
}) => {
  const { mode } = useTheme();

  return (
    <CreatableSelect
      placeholder={placeholder}
      isDisabled={disabled}
      options={options}
      value={selected}
      isMulti={multiple}
      onChange={(option) => onChange(option as any)}
      menuPortalTarget={portal ? document.body : undefined}
      isClearable={isClearable}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: "stretch",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: mode === "dark" ? "#1A1A1A" : "#FFFFFF",
          color: mode === "dark" ? "#FFFFFF" : "#000000",
        }),
        control: (provided) => ({
          ...provided,
          height: "100%",
          boxShadow: "none",
          background: mode === "dark" ? "rgb(20,20,20)" : "#FFFFFF",
          border:
            mode === "dark"
              ? "1px solid rgb(255, 255, 255, 0.1) !important"
              : "1px solid rgb(20, 20, 20, 0.1) !important",
          borderRadius: "8px",
          padding: "6px",
        }),
        input: (provided) => ({
          ...provided,
          color: mode === "dark" ? "#FFFFFF" : "#000000",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: mode === "dark" ? "#FFFFFF" : "#000000",
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: "rgb(191, 90, 242, 0.1)",
          borderRadius: "12px",
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: "rgb(191, 90, 242)",
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          color: "rgb(191, 90, 242)",
          cursor: "pointer",
          marginTop: "2px",
          ":hover": {
            color: "white",
          },
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
      }}
    />
  );
};

export default CreatableDropdown;

export type { Props as DropdownProps };
