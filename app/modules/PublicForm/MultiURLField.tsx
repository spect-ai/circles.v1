import { isURL } from "@/app/common/utils/utils";
import { Option } from "@/app/types";
import {
  Button,
  Input,
  Stack,
  IconClose,
  Box,
  Tag,
  IconPlusSmall,
} from "degen";
import { useRef, useState, useEffect } from "react";

interface Props {
  disabled: boolean;
  updateFieldHasInvalidType: (key: string, value: any) => void;
  placeholder: string;
  value: Option[];
  data: any;
  setData: (value: any) => void;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  propertyName: string;
}

interface InputProps {
  disabled: boolean;
  updateFieldHasInvalidType: (key: string, value: any) => void;
  placeholder: string;
  val: Option;
  updateData: (i: number, lab: string, val: string) => void;
  propertyName: string;
  i: number;
}

function URLInput({
  val,
  updateFieldHasInvalidType,
  disabled,
  placeholder,
  updateData,
  i,
}: InputProps) {
  const [tempLabel, setTempLabel] = useState("");
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    setTempValue(val.value);
    setTempLabel(val.label);
  }, [val]);
  return (
    <Stack direction={"horizontal"} align="center">
      <Input
        label=""
        placeholder="Enter URL Label"
        value={tempLabel}
        inputMode="text"
        onChange={(e) => {
          setTempLabel(e.target.value);
        }}
        onBlur={() => updateData(i, tempLabel, tempValue)}
        disabled={disabled}
      />
      <Input
        label=""
        placeholder={placeholder}
        value={tempValue}
        inputMode="text"
        onChange={(e) => {
          setTempValue(e.target.value);
          updateFieldHasInvalidType("singleURL", e.target.value);
        }}
        onBlur={() => updateData(i, tempLabel, tempValue)}
        error={tempValue && !isURL(tempValue) ? "Invalid URL" : undefined}
        disabled={disabled}
      />
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => {
          updateData(i, "", "");
        }}
      >
        <IconClose size={"4"} color="accent" />
      </Button>
    </Stack>
  );
}

export default function MultiURLField({
  disabled,
  updateFieldHasInvalidType,
  placeholder,
  value,
  data,
  propertyName,
  setData,
}: Props) {
  const [urlArray, setUrlArray] = useState<Option[]>(value);

  const updateData = (index: number, label: string, value: string) => {
    let urls = Array.from(urlArray);
    urls[index].label = label;
    urls[index].value = value;
    urls = urls.filter((i) => i.value != "" || i.label != "");
    setUrlArray(urls);
    setData({ ...data, [propertyName]: urls });
  };
  return (
    <Stack direction={"vertical"}>
      {urlArray &&
        urlArray?.map((val, i) => {
          return (
            <URLInput
              key={i}
              val={val}
              updateFieldHasInvalidType={updateFieldHasInvalidType}
              placeholder={placeholder}
              disabled={disabled}
              updateData={updateData}
              propertyName={propertyName}
              i={i}
            />
          );
        })}
      <Tag tone="accent" size="medium" hover>
        <Box
          onClick={() => {
            if (urlArray && urlArray.length > 0) {
              const urls = Array.from(urlArray);
              urls.push({ label: "", value: "" });
              setUrlArray(urls);
            } else {
              setUrlArray([{ label: "", value: "" }]);
            }
          }}
          display="flex"
          flexDirection={"row"}
          gap="1"
          cursor="pointer"
        >
          <IconPlusSmall size={"4"} color="accent" />
          Add URL
        </Box>
      </Tag>
    </Stack>
  );
}
