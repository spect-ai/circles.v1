/* eslint-disable no-param-reassign */
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconCheck, MediaPicker, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import csvToJson from "csvtojson";
import { Option, Property } from "@/app/types";
import Dropdown from "@/app/common/components/Dropdown";
import { convertToId, isEmail, isURL } from "@/app/common/utils/utils";
import { toast } from "react-toastify";
import { isAddress } from "ethers/lib/utils";
import { importFromCsv } from "@/app/services/Collection";
import { Accept } from "degen/dist/types/components/MediaPicker/MediaPicker";
import { useCircle } from "../CircleContext";
import MapField from "./MapField";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

const ImportTasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [userMapping, setUserMapping] = useState<Record<string, Option>>();
  const [properties, setProperties] = useState<{
    [key: string]: Property;
  }>({});
  const [groupByColumn, setGroupByColumn] = useState("");
  const [titleColumn, setTitleColumn] = useState("");
  const [descriptionColumn, setDescriptionColumn] = useState("");

  const { circle } = useCircle();

  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  return (
    <Box>
      <PrimaryButton variant="tertiary" onClick={() => setIsOpen(true)}>
        Import
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)} title="Import">
            <Box padding="8">
              {step === 0 && (
                <Stack>
                  <Text variant="label">Upload csv</Text>
                  <MediaPicker
                    label="Choose or drag and drop csv"
                    accept={".csv" as unknown as Accept}
                    onChange={(file) => {
                      const reader = new FileReader();
                      reader.readAsText(file);
                      reader.onload = (e) => {
                        const text = (e.target?.result as string) || "";
                        csvToJson()
                          .fromString(text)
                          .then((json: Record<string, unknown>[]) => {
                            setData(json);
                            setProperties(
                              Object.keys(json[0]).reduce(
                                (prev, curr) => ({
                                  ...prev,
                                  [curr]: {
                                    name: curr,
                                    type: "shortText",
                                    required: false,
                                    isPartOfFormView: false,
                                  },
                                }),
                                {}
                              )
                            );
                          });
                      };
                    }}
                  />
                  <Stack direction="horizontal" justify="space-between">
                    <Box />
                    <PrimaryButton
                      variant="tertiary"
                      loading={loading}
                      onClick={() => {
                        setStep(step + 1);
                      }}
                    >
                      Next
                    </PrimaryButton>
                  </Stack>
                </Stack>
              )}
              {step === 1 && (
                <Stack>
                  {userMapping &&
                    Object.keys(properties).map((propertyName) => (
                      <MapField
                        propertyName={propertyName}
                        properties={properties}
                        setNewProperties={setProperties}
                        data={data}
                        userMapping={userMapping}
                        setUserMapping={
                          setUserMapping as React.Dispatch<
                            React.SetStateAction<Record<string, unknown>>
                          >
                        }
                      />
                    ))}
                  <Stack direction="horizontal" justify="space-between">
                    <PrimaryButton
                      variant="tertiary"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </PrimaryButton>
                    <PrimaryButton
                      variant="tertiary"
                      loading={loading}
                      onClick={() => {
                        setStep(step + 1);
                        const defaultGroupByColumn = Object.keys(
                          properties
                        ).find((key) => key.toLowerCase() === "status");
                        if (defaultGroupByColumn) {
                          setGroupByColumn(defaultGroupByColumn);
                        }

                        const defaultTitleColumn = Object.keys(properties).find(
                          (key) =>
                            key.toLowerCase() === "title" ||
                            key.toLowerCase() === "name"
                        );
                        if (defaultTitleColumn) {
                          setTitleColumn(defaultTitleColumn);
                        }

                        const defaultDescriptionColumn = Object.keys(
                          properties
                        ).find((key) => key.toLowerCase() === "description");
                        if (defaultDescriptionColumn) {
                          setDescriptionColumn(defaultDescriptionColumn);
                        }
                      }}
                    >
                      Next
                    </PrimaryButton>
                  </Stack>
                </Stack>
              )}
              {step === 2 && (
                <Stack>
                  <Dropdown
                    label="Group By Field"
                    onChange={(e) => setGroupByColumn(e.value)}
                    options={Object.keys(properties)
                      .map((key) => ({
                        label: key,
                        value: key,
                      }))
                      .filter(
                        (option) =>
                          properties[option.value].type === "singleSelect"
                      )}
                    selected={{
                      label: groupByColumn,
                      value: groupByColumn,
                    }}
                    multiple={false}
                    isClearable={false}
                  />
                  <Dropdown
                    label="Title Field"
                    onChange={(e) => setTitleColumn(e.value)}
                    options={Object.keys(properties)
                      .map((key) => ({
                        label: key,
                        value: key,
                      }))
                      .filter(
                        (option) =>
                          properties[option.value].type === "shortText"
                      )}
                    selected={{
                      label: titleColumn,
                      value: titleColumn,
                    }}
                    multiple={false}
                    isClearable={false}
                  />
                  <Dropdown
                    label="Description Field"
                    onChange={(e) => setDescriptionColumn(e.value)}
                    options={Object.keys(properties)
                      .map((key) => ({
                        label: key,
                        value: key,
                      }))
                      .filter(
                        (option) => properties[option.value].type === "longText"
                      )}
                    selected={{
                      label: descriptionColumn,
                      value: descriptionColumn,
                    }}
                    multiple={false}
                    isClearable={false}
                  />
                  <Stack direction="horizontal" justify="space-between">
                    <PrimaryButton
                      variant="tertiary"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </PrimaryButton>
                    <PrimaryButton
                      icon={<IconCheck size="4" />}
                      variant="secondary"
                      loading={loading}
                      onClick={async () => {
                        // format data
                        setLoading(true);
                        // duplicate the data
                        const formattedData = JSON.parse(JSON.stringify(data));
                        let shouldBreak = false;
                        formattedData.map((item: Record<string, unknown>) => {
                          if (shouldBreak) {
                            return null;
                          }
                          return Object.keys(item).forEach((key) => {
                            if (!properties[key] || !item[key]) {
                              delete item[key];
                            } else if (
                              properties[key].type === "singleSelect"
                            ) {
                              // if it has square brackets, remove them
                              if (
                                (item[key] as string).startsWith("[") &&
                                (item[key] as string).endsWith("]")
                              ) {
                                item[key] = (item[key] as string).slice(1, -1);
                              }
                              if ((item[key] as string).split(",").length > 1) {
                                toast.error(
                                  `Invalid value in ${key} column. Only one value is allowed. Please check if the field type is correct.`
                                );
                                shouldBreak = true;
                                return;
                              }
                              item[key] = {
                                label: item[key],
                                value: convertToId(item[key] as string),
                              };
                            } else if (properties[key].type === "multiSelect") {
                              // if it has square brackets, remove them
                              if (
                                (item[key] as string).startsWith("[") &&
                                (item[key] as string).endsWith("]")
                              ) {
                                item[key] = (item[key] as string).slice(1, -1);
                              }
                              item[key] = (item[key] as string)
                                ?.split(",")
                                .map((label: string) => ({
                                  label,
                                  value: convertToId(label),
                                }));
                            } else if (properties[key].type === "date") {
                              if (
                                Number.isNaN(Date.parse(item[key] as string))
                              ) {
                                toast.error(
                                  `Invalid date in ${key} column. Please check if the field type is correct.`
                                );
                                setLoading(false);
                                shouldBreak = true;
                              }

                              item[key] = new Date(item[key] as string);
                            } else if (properties[key].type === "number") {
                              item[key] = Number(item[key]);
                              if (Number.isNaN(item[key])) {
                                toast.error(
                                  `Invalid number in ${key} column. Please check if the field type is correct.`
                                );
                                setLoading(false);
                                shouldBreak = true;
                              }
                            } else if (properties[key].type === "user") {
                              item[key] = (
                                userMapping as unknown as Record<
                                  string,
                                  unknown
                                >
                              )[item[key] as string];
                            } else if (properties[key].type === "ethAddress") {
                              if (!isAddress(item[key] as string)) {
                                toast.error(
                                  `Invalid address in ${key} column. Please check if the field type is correct.`
                                );
                                setLoading(false);
                                shouldBreak = true;
                              }
                            } else if (properties[key].type === "email") {
                              if (!isEmail(item[key] as string)) {
                                toast.error(
                                  `Invalid email in ${key} column. Please check if the field type is correct.`
                                );
                                setLoading(false);
                                shouldBreak = true;
                              }
                            } else if (properties[key].type === "singleURL") {
                              if (!isURL(item[key] as string)) {
                                toast.error(
                                  `Invalid url in ${key} column. Please check if the field type is correct.`
                                );
                                setLoading(false);
                                shouldBreak = true;
                              }
                            }
                            if (key === titleColumn) {
                              item.Title = item[key];
                              titleColumn !== "Title" && delete item[key];
                            }
                            if (key === descriptionColumn) {
                              item.Description = item[key];
                              descriptionColumn !== "Description" &&
                                delete item[key];
                            }
                          });
                        });
                        // rename title and description columns
                        properties.Title = {
                          ...properties[titleColumn],
                          name: "Title",
                        };
                        titleColumn !== "Title" &&
                          delete properties[titleColumn];
                        properties.Description = {
                          ...properties[descriptionColumn],
                          name: "Description",
                        };
                        descriptionColumn !== "Description" &&
                          delete properties[descriptionColumn];

                        const res = await importFromCsv({
                          data: formattedData,
                          collectionId: collection.id,
                          groupByColumn,
                          collectionProperties: properties,
                          circleId: circle?.id || "",
                        });
                        updateCollection(res.collection);
                        setLoading(false);
                        setIsOpen(false);
                      }}
                    >
                      Finish
                    </PrimaryButton>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ImportTasks;
