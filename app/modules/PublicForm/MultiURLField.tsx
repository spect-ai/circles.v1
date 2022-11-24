import { isURL } from "@/app/common/utils/utils";
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
  value: string[];
  data: any;
  setData: (value: any) => void;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  propertyName: string;
}

interface InputProps {
  disabled: boolean;
  updateFieldHasInvalidType: (key: string, value: any) => void;
  placeholder: string;
  val: string;
  updateData: (i: number, val: string) => void;
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
  console.log(val);
  const [temp, setTemp] = useState("");

  useEffect(() => {
    setTemp(val);
  }, [val]);
  return (
    <Stack direction={"horizontal"} align="center">
      <Input
        label=""
        key={val}
        placeholder={placeholder}
        value={temp}
        inputMode="text"
        onChange={(e) => {
          setTemp(e.target.value);
          updateFieldHasInvalidType("singleURL", e.target.value);
        }}
        onBlur={() => updateData(i, temp)}
        error={val && !isURL(val) ? "Invalid URL" : undefined}
        disabled={disabled}
      />
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => {
          updateData(i, "");
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
  const [urlArray, setUrlArray] = useState<string[]>(value);

  const updateData = (index: number, value: string) => {
    let urls = Array.from(urlArray);
    urls[index] = value;
    urls = urls.filter((i) => i != "");
    setUrlArray(urls);
    setData({ ...data, [propertyName]: urls });
  };

  console.log(urlArray);
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
            if (urlArray && urlArray.length > 0) setUrlArray([...urlArray, ""]);
            else setUrlArray([""]);
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
