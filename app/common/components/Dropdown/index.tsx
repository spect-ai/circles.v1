import { useTheme } from "degen";
import { FC } from "react";

import Select from "react-select";

export type OptionType = {
  label: string;
  value: string;
};

type Props =
  | {
      multiple: false;
      options: OptionType[];
      selected: OptionType;
      onChange: (option: OptionType) => void;
      placeholder?: string;
    }
  | {
      multiple: true;
      options: OptionType[];
      selected: OptionType[];
      onChange: (option: OptionType[]) => void;
      placeholder?: string;
    };

const Dropdown: FC<Props> = ({
  options,
  selected,
  onChange,
  multiple,
  placeholder,
}) => {
  const { mode } = useTheme();

  return (
    <Select
      placeholder={placeholder}
      options={options}
      value={selected}
      isMulti={multiple}
      onChange={(option) => onChange(option as any)}
      // menuPortalTarget={document.body}
      isClearable={true}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1, // full width
          alignSelf: "stretch", // full height
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
          color: "rgb(255, 255, 255)",
        }),
        multiValue: (styles) => {
          return {
            ...styles,
            backgroundColor: "rgb(191, 90, 242, 0.1)",
            borderRadius: "12px",
          };
        },
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

        // indicatorsContainer: (provided) => ({
        //   ...provided,
        //   opacity: active ? 1 : 0,
        // }),
        // placeholder: (provided) => ({
        //   ...provided,
        //   opacity: active ? 1 : 0,
        // }),
      }}
    />
  );
};

export default Dropdown;

export type { Props as DropdownProps };
