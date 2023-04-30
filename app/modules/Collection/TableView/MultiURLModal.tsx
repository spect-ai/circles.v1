import Modal from "@/app/common/components/Modal";
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
  form: any;
  propertyId: string;
  handleClose: (urls: Option[], dataId: string, propertyId: string) => void;
  dataId: string;
}

interface InputProps {
  val: Option;
  updateData: (i: number, lab: string, val: string) => void;
  propertyId: string;
  i: number;
}

function URLInput({ val, updateData, i }: InputProps) {
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
      />
      <Input
        label=""
        placeholder="Enter URL"
        value={tempValue}
        inputMode="text"
        onChange={(e) => {
          setTempValue(e.target.value);
        }}
        onBlur={() => updateData(i, tempLabel, tempValue)}
        error={tempValue && !isURL(tempValue) ? "Invalid URL" : undefined}
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

export default function MultiURLModal({
  form,
  propertyId,
  handleClose,
  dataId,
}: Props) {
  const [urlArray, setUrlArray] = useState<Option[]>(
    dataId ? form?.data[dataId]?.[propertyId] : undefined
  );

  const updateData = (index: number, label: string, value: string) => {
    let urls = Array.from(urlArray);
    urls[index].label = label;
    urls[index].value = value;
    urls = urls.filter((i) => i.value != "" || i.label != "");
    setUrlArray(urls);
  };

  return (
    <Modal
      handleClose={() => {
        handleClose(urlArray, dataId || "", propertyId);
      }}
      title="Multiple URLs"
    >
      <Box padding="8">
        <Stack direction={"vertical"}>
          {urlArray &&
            urlArray?.map((val, i) => {
              return (
                <URLInput
                  key={i}
                  val={val}
                  updateData={updateData}
                  propertyId={propertyId}
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
      </Box>
    </Modal>
  );
}
