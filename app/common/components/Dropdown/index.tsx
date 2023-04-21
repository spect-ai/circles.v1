/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Text, useTheme } from "degen";
import { FC } from "react";

import Select, { components } from "react-select";

import CreatableSelect from "react-select/creatable";

export type OptionType = {
  label: string;
  value: string;
  data?: any;
};

type Props =
  | {
      multiple: false;
      options: any[];
      selected: OptionType | undefined;
      onChange: (option: OptionType) => void;
      placeholder?: string;
      portal?: boolean;
      isClearable?: boolean;
      disabled?: boolean;
      label?: string;
      creatable?: boolean;
      formatCreateLabel?: (inputValue: string) => string;
      formatOptionLabel?: (option: OptionType) => any;
    }
  | {
      multiple: true;
      options: any[];
      selected: OptionType[] | undefined;
      onChange: (option: OptionType[]) => void;
      placeholder?: string;
      portal?: boolean;
      isClearable?: boolean;
      disabled?: boolean;
      label?: string;
      creatable?: boolean;
      formatCreateLabel?: (inputValue: string) => string;
      formatOptionLabel?: (option: OptionType) => any;
    };

const { Option } = components;
const IconOption = (props: any) => (
  <Option {...props}>
    <Stack space="2" align="center" direction="horizontal">
      <Text color="accent">{props.data.icon}</Text>
      {props.data.label}
    </Stack>
  </Option>
);

const Dropdown: FC<Props> = ({
  options,
  selected,
  onChange,
  multiple,
  placeholder,
  portal = true,
  isClearable = true,
  disabled = false,
  creatable = false,
  formatCreateLabel,
  formatOptionLabel,
  label,
}) => {
  const { mode } = useTheme();

  return (
    <Stack space="2">
      <Box marginLeft="4">
        <Text color="textSecondary" weight="semiBold">
          {label}
        </Text>
      </Box>
      {creatable ? (
        <CreatableSelect
          formatOptionLabel={formatOptionLabel}
          formatCreateLabel={formatCreateLabel}
          placeholder={placeholder}
          isDisabled={disabled}
          options={options}
          value={selected}
          isMulti={multiple}
          onChange={(option) => onChange(option as any)}
          menuPortalTarget={portal ? document.body : undefined}
          isClearable={isClearable}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
              padding: "5px",
            }),
            input: (provided) => ({
              ...provided,
              color: mode === "dark" ? "#FFFFFF" : "#000000",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: mode === "dark" ? "#FFFFFF" : "#000000",
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
      ) : (
        <Select
          formatOptionLabel={formatOptionLabel}
          placeholder={placeholder}
          isDisabled={disabled}
          options={options}
          value={selected}
          isMulti={multiple}
          onChange={(option) => onChange(option as any)}
          menuPortalTarget={portal ? document.body : undefined}
          isClearable={isClearable}
          components={{ Option: IconOption }}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
              padding: "5px",
            }),
            input: (provided) => ({
              ...provided,
              color: mode === "dark" ? "#FFFFFF" : "#000000",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: mode === "dark" ? "#FFFFFF" : "#000000",
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
      )}
    </Stack>
  );
};

export default Dropdown;

export type { Props as DropdownProps };
