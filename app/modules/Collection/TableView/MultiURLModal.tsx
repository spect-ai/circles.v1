import Modal from "@/app/common/components/Modal";
import { isURL } from "@/app/common/utils/utils";
import { CollectionType, Option } from "@/app/types";
import {
  Button,
  Input,
  Stack,
  IconClose,
  Box,
  Tag,
  IconPlusSmall,
} from "degen";
import { useState, useEffect } from "react";

interface Props {
  form: CollectionType;
  propertyName: string;
  handleClose: (urls: Option[], dataId: string, propertyName: string) => void;
  dataId: string;
}

interface InputProps {
  val: Option;
  updateData: (i: number, lab: string, val: string) => void;
  i: number;
}

const URLInput = ({ val, updateData, i }: InputProps) => {
  const [tempLabel, setTempLabel] = useState("");
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    setTempValue(val.value);
    setTempLabel(val.label);
  }, [val]);
  return (
    <Stack direction="horizontal" align="center">
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
        <IconClose size="4" color="accent" />
      </Button>
    </Stack>
  );
};

const MultiURLModal = ({ form, propertyName, handleClose, dataId }: Props) => {
  const [urlArray, setUrlArray] = useState<Option[]>(
    dataId ? form?.data[dataId]?.[propertyName] : undefined
  );

  const updateData = (index: number, label: string, value: string) => {
    let urls = Array.from(urlArray);
    urls[index].label = label;
    urls[index].value = value;
    urls = urls.filter((i) => i.value !== "" || i.label !== "");
    setUrlArray(urls);
  };

  return (
    <Modal
      handleClose={() => {
        handleClose(urlArray, dataId || "", propertyName);
      }}
      title="Multiple URLs"
    >
      <Box padding="8">
        <Stack direction="vertical">
          {urlArray &&
            urlArray?.map((val, i) => (
              <URLInput
                key={val.label + val.value}
                val={val}
                updateData={updateData}
                i={i}
              />
            ))}
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
              flexDirection="row"
              gap="1"
              cursor="pointer"
            >
              <IconPlusSmall size="4" color="accent" />
              Add URL
            </Box>
          </Tag>
        </Stack>
      </Box>
    </Modal>
  );
};

export default MultiURLModal;
