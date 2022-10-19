import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import Modal from "@/app/common/components/Modal";
import { updateCollectionData } from "@/app/services/Collection";
import { MemberDetails } from "@/app/types";
import { Box, IconEth, Input, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import RewardModal from "../../TableView/RewardModal";
import { DateInput } from "../Field";

export default function DataModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const [propertyName, setPropertyName] = useState("");
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const router = useRouter();
  const { dataId, circle: cId } = router.query;
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

  const [data, setData] = useState({} as any);
  const { mode } = useTheme();

  useEffect(() => {
    if (dataId) {
      setData(collection?.data[dataId as string]);
      setIsOpen(true);
    } else setIsOpen(false);
  }, [collection?.data, dataId]);

  if (!isOpen) return null;

  if (!dataId || !data) return null;

  return (
    <Modal
      handleClose={async () => {
        console.log({ data });
        void router.push(`/${cId}/r/${collection.slug}`);
        setIsOpen(false);
        const res = await updateCollectionData(
          collection.id,
          dataId as string,
          { ...data }
        );
        console.log({ res });
        if (res.id) {
          setLocalCollection(res);
        } else {
          setData({} as any);
          toast.error("Error updating data");
        }
      }}
      title={collection.data[dataId].title}
    >
      <Box padding="8">
        <AnimatePresence>
          {isRewardModalOpen && (
            <RewardModal
              handleClose={(reward, dataId, propertyName) => {
                collection.data[dataId][propertyName] = reward;
                setIsRewardModalOpen(false);
              }}
              dataId={dataId as string}
              propertyName={propertyName}
              form={collection}
            />
          )}
        </AnimatePresence>
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
                  value={data[property.name]}
                  onChange={(e) => {
                    data[property.name] = e.target.value;
                    setData({ ...data });
                  }}
                />
              )}
              {property?.type === "ethAddress" && (
                <Input
                  label=""
                  placeholder={`Enter ${property?.name}`}
                  value={data[property.name]}
                  onChange={(e) => {
                    data[property.name] = e.target.value;
                    setData({ ...data });
                  }}
                />
              )}
              {property?.type === "email" && (
                <Input
                  label=""
                  placeholder={`Enter ${property?.name}`}
                  value={data[property.name]}
                  onChange={(e) => {
                    data[property.name] = e.target.value;
                    setData({ ...data });
                  }}
                  inputMode="email"
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
                    value={data[property.name]}
                    onSave={(value) => {
                      data[property.name] = value;
                      setData({ ...data });
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
                  selected={data[property.name]}
                  onChange={(value) => {
                    // setselectedSafe(value);
                    console.log({ value });
                    data[property.name] = value;
                    setData({ ...data });
                  }}
                />
              )}
              {property?.type === "multiSelect" && (
                <Dropdown
                  placeholder={`Select ${property?.name}`}
                  multiple={true}
                  options={property?.options as OptionType[]}
                  selected={data[property.name]}
                  onChange={(value) => {
                    data[property.name] = value;
                    setData({ ...data });
                  }}
                />
              )}
              {property?.type === "user" && (
                <Dropdown
                  placeholder={`Select ${property?.name}`}
                  multiple={false}
                  options={memberOptions as OptionType[]}
                  selected={data[property.name]}
                  onChange={(value) => {
                    data[property.name] = value;
                    setData({ ...data });
                  }}
                />
              )}
              {property?.type === "user[]" && (
                <Dropdown
                  placeholder={`Select ${property?.name}`}
                  multiple={false}
                  options={property.options as OptionType[]}
                  selected={data[property.name]}
                  onChange={(value) => {
                    data[property.name] = value;
                    setData({ ...data });
                  }}
                />
              )}
              {property?.type === "date" && (
                <DateInput
                  mode={mode}
                  placeholder={`Enter ${property?.name}`}
                  value={
                    data[property.name] &&
                    new Date(data[property.name]).toISOString().split("T")[0]
                  }
                  onChange={(e) => {
                    data[property.name] = e.target.value;
                    setData({ ...data });
                  }}
                  type="date"
                />
              )}
              {property?.type === "number" && (
                <DateInput
                  mode={mode}
                  placeholder={`Enter ${property?.name}`}
                  value={data[property.name]}
                  onChange={(e) => {
                    data[property.name] = e.target.value;
                    setData({ ...data });
                  }}
                  type="number"
                />
              )}
              {property?.type === "reward" && (
                <ClickableTag
                  name={
                    collection.data &&
                    collection.data[dataId as string][property.name]?.value
                      ? `${
                          collection.data[dataId as string][property.name].value
                        } ${
                          collection.data[dataId as string][property.name].token
                            .symbol
                        }`
                      : "Set Reward"
                  }
                  icon={<IconEth color="accent" size="5" />}
                  onClick={() => {
                    setPropertyName(property.name);
                    setIsRewardModalOpen(true);
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
