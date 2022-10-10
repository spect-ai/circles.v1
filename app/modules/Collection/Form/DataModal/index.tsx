import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { Box, Input, Stack, Text } from "degen";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

export default function DataModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection } = useLocalCollection();

  const router = useRouter();
  const { dataId, circle: cId } = router.query;

  useEffect(() => {
    dataId ? setIsOpen(true) : setIsOpen(false);
  }, [dataId]);

  if (!isOpen) return null;

  if (!dataId) return null;

  return (
    <Modal
      handleClose={() => {
        void router.push(`/${cId}/r/${collection.slug}`);
      }}
      title={collection.data[dataId].title}
    >
      <Box padding="8">
        <Stack>
          {Object.values(collection.properties).map((property) => (
            <Stack direction="horizontal" key={property.name} align="center">
              <Box width="1/4">
                <Text variant="label">{property.name}</Text>
              </Box>
              {property?.type === "shortText" && (
                <Input
                  label=""
                  placeholder={`Enter ${property?.name}`}
                  value={
                    collection.data &&
                    collection.data[dataId as string][property.name]
                  }
                />
              )}
              {property?.type === "ethAddress" && (
                <Input
                  label=""
                  placeholder={`Enter ${property?.name}`}
                  value={
                    collection.data &&
                    collection.data[dataId as string][property.name]
                  }
                  // onChange={(e) => setLabel(e.target.value)}
                  error={
                    collection.data &&
                    !ethers.utils.isAddress(
                      collection.data && collection.data[dataId as string]
                    )
                  }
                />
              )}
              {property?.type === "longText" && (
                <Box
                  marginTop="4"
                  width="full"
                  borderWidth="0.375"
                  padding="4"
                  borderRadius="large"
                  maxHeight="64"
                  overflow="auto"
                >
                  <Editor
                    value={
                      collection.data &&
                      collection.data[dataId as string][property.name]
                    }
                    onSave={(value) => {
                      console.log({ value });
                      //   setRowData(value);
                      //   stopEditing();
                    }}
                    placeholder={`Type here to edit ${property.name}`}
                  />
                </Box>
              )}
              {property?.type === "singleSelect" && (
                <Dropdown
                  placeholder={`Select ${property?.name}`}
                  multiple={false}
                  options={property.options as OptionType[]}
                  selected={
                    collection.data &&
                    collection.data[dataId as string][property.name]
                  }
                  onChange={(value) => {
                    // setselectedSafe(value);
                    console.log({ value });
                  }}
                />
              )}
              {property?.type === "multiSelect" && (
                <Dropdown
                  placeholder={`Select ${property?.name}`}
                  multiple={true}
                  options={property?.options as OptionType[]}
                  selected={
                    collection.data &&
                    collection.data[dataId as string][property.name]
                  }
                  onChange={(value) => {
                    // setselectedSafe(value);
                    console.log({ value });
                  }}
                />
              )}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Modal>
  );
}
