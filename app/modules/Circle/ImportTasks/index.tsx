import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconCheck, Input, MediaPicker, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import csvToJson from "csvtojson";
import MapField from "./MapField";
import { Property } from "@/app/types";
import Dropdown from "@/app/common/components/Dropdown";
import { convertToId, isEmail, isURL } from "@/app/common/utils/utils";
import { useCircle } from "../CircleContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { isAddress } from "ethers/lib/utils";

type Props = {};

export default function ImportTasks({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userMapping, setUserMapping] = useState({} as any);
  const [properties, setProperties] = useState<{
    [key: string]: Property;
  }>({});

  const [collectionName, setCollectionName] = useState("");
  const [groupByColumn, setGroupByColumn] = useState("");
  const [titleColumn, setTitleColumn] = useState("");
  const [descriptionColumn, setDescriptionColumn] = useState("");

  const { circle, setLocalCircle } = useCircle();

  const router = useRouter();

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
                    accept={".csv" as any}
                    onChange={(file) => {
                      const reader = new FileReader();
                      reader.readAsText(file);
                      reader.onload = (e) => {
                        const text = (e.target?.result as string) || "";
                        csvToJson()
                          .fromString(text)
                          .then((json) => {
                            console.log({ json });
                            setData(json as any);
                            setProperties(
                              Object.keys(json[0]).reduce((prev, curr) => {
                                return {
                                  ...prev,
                                  [curr]: {
                                    name: curr,
                                    type: "shortText",
                                    required: false,
                                    isPartOfFormView: false,
                                  },
                                };
                              }, {})
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
                  {Object.keys(properties).map((propertyName) => (
                    <MapField
                      propertyName={propertyName}
                      properties={properties}
                      setNewProperties={setProperties}
                      data={data}
                      userMapping={userMapping}
                      setUserMapping={setUserMapping}
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
                        console.log({ properties });
                        // find a property called status or Status in the properties and set it as default group by column
                        const defaultGroupByColumn = Object.keys(
                          properties
                        ).find((key) => key.toLowerCase() === "status");
                        if (defaultGroupByColumn) {
                          setGroupByColumn(defaultGroupByColumn);
                        }

                        // find a property called title or Title in the properties and set it as default title column or name or Name
                        const defaultTitleColumn = Object.keys(properties).find(
                          (key) =>
                            key.toLowerCase() === "title" ||
                            key.toLowerCase() === "name"
                        );
                        if (defaultTitleColumn) {
                          setTitleColumn(defaultTitleColumn);
                        }

                        // find a property called description or Description in the properties and set it as default description column
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
                  <Input
                    label="Collection Name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                  />
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
                        console.log({ data });
                        let shouldBreak = false;
                        formattedData.map((item: any) => {
                          if (shouldBreak) {
                            return;
                          }
                          return Object.keys(item).forEach((key) => {
                            console.log({ key });
                            if (!properties[key] || !item[key]) {
                              delete item[key];
                            } else {
                              if (properties[key].type === "singleSelect") {
                                // if it has square brackets, remove them
                                if (
                                  item[key].startsWith("[") &&
                                  item[key].endsWith("]")
                                ) {
                                  item[key] = item[key].slice(1, -1);
                                }
                                if (item[key].split(",").length > 1) {
                                  toast.error(
                                    `Invalid value in ${key} column. Only one value is allowed. Please check if the field type is correct.`
                                  );
                                  shouldBreak = true;
                                  return;
                                }
                                item[key] = {
                                  label: item[key],
                                  value: convertToId(item[key]),
                                };
                              } else if (
                                properties[key].type === "multiSelect"
                              ) {
                                // if it has square brackets, remove them
                                if (
                                  item[key].startsWith("[") &&
                                  item[key].endsWith("]")
                                ) {
                                  item[key] = item[key].slice(1, -1);
                                }
                                item[key] = item[key]
                                  ?.split(",")
                                  .map((label: string) => ({
                                    label,
                                    value: convertToId(label),
                                  }));
                              } else if (properties[key].type === "date") {
                                if (isNaN(Date.parse(item[key]))) {
                                  toast.error(
                                    `Invalid date in ${key} column. Please check if the field type is correct.`
                                  );
                                  setLoading(false);
                                  shouldBreak = true;
                                }

                                item[key] = new Date(item[key]);
                                console.log({ item });
                              } else if (properties[key].type === "number") {
                                console.log({ item: item[key] });
                                item[key] = Number(item[key]);
                                console.log("hidsjfisf");
                                if (isNaN(item[key])) {
                                  toast.error(
                                    `Invalid number in ${key} column. Please check if the field type is correct.`
                                  );
                                  setLoading(false);
                                  shouldBreak = true;
                                }
                              } else if (properties[key].type === "user") {
                                item[key] = userMapping[item[key]];
                              } else if (
                                properties[key].type === "ethAddress"
                              ) {
                                console.log(isAddress(item[key]));
                                if (!isAddress(item[key])) {
                                  toast.error(
                                    `Invalid address in ${key} column. Please check if the field type is correct.`
                                  );
                                  setLoading(false);
                                  shouldBreak = true;
                                }
                              } else if (properties[key].type === "email") {
                                if (!isEmail(item[key])) {
                                  toast.error(
                                    `Invalid email in ${key} column. Please check if the field type is correct.`
                                  );
                                  setLoading(false);
                                  shouldBreak = true;
                                }
                              } else if (properties[key].type === "singleURL") {
                                if (!isURL(item[key])) {
                                  toast.error(
                                    `Invalid url in ${key} column. Please check if the field type is correct.`
                                  );
                                  setLoading(false);
                                  shouldBreak = true;
                                }
                              }
                            }
                            if (key === titleColumn) {
                              item["Title"] = item[key];
                              titleColumn !== "Title" && delete item[key];
                            }
                            if (key === descriptionColumn) {
                              item["Description"] = item[key];
                              descriptionColumn !== "Description" &&
                                delete item[key];
                            }
                          });
                        });
                        // rename title and description columns
                        properties["Title"] = {
                          ...properties[titleColumn],
                          name: "Title",
                        };
                        titleColumn !== "Title" &&
                          delete properties[titleColumn];
                        properties["Description"] = {
                          ...properties[descriptionColumn],
                          name: "Description",
                        };
                        descriptionColumn !== "Description" &&
                          delete properties[descriptionColumn];

                        console.log({ formattedData, properties });
                        // const res = await importFromCsv({
                        //   data: formattedData,
                        //   collectionName,
                        //   groupByColumn,
                        //   collectionProperties: properties,
                        //   circleId: circle.id,
                        // });
                        // console.log({ res });
                        // setLocalCircle(res.circle);
                        // router.push(
                        //   `/${router.query.circle}/r/${res.collection.slug}`
                        // );
                        setLoading(false);
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
}
