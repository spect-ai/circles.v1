import { useLayoutEffect, useRef } from "react";
import { CellProps } from "react-datasheet-grid";
import Select from "react-select";

export default function SelectComponent({ focus, active }: CellProps) {
  const ref: any = useRef<Select>(null);

  // This function will be called only when `focus` changes
  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [focus]);
  return (
    <Select
      ref={ref}
      options={[
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
      ]}
      menuIsOpen={focus}
      menuPortalTarget={document.body}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1, // full width
          alignSelf: "stretch", // full height
          pointerEvents: focus ? undefined : "none", // disable pointer events when not focused
        }),
        control: (provided) => ({
          ...provided,
          height: "100%",
          border: "none",
          boxShadow: "none",
          background: "none",
        }),
        input: (provided) => ({
          ...provided,
          color: "white",
        }),
        singleValue: (provided, state) => ({
          ...provided,
          color: "rgb(255, 255, 255)",
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
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
