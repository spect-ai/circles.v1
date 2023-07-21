import { Chart, CollectionType, ConditionGroup, Option } from "@/app/types";
import {
  Box,
  Button,
  IconPencil,
  IconTrash,
  Stack,
  Text,
  useTheme,
} from "degen";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { ImEmbed } from "react-icons/im";
import { logError } from "@/app/common/utils/utils";
import { satisfiesAdvancedConditions } from "../Common/SatisfiesAdvancedFilter";
import Plot from "./Plot";

type Props =
  | {
      chart: Chart;
      setIsAddChartOpen: (val: boolean) => void;
      setChartId: (id: string) => void;
      collection: CollectionType;
      updateCollection: (collection: CollectionType) => void;
      setIsEmbedOpen: (val: boolean) => void;
      disabled?: false;
    }
  | {
      chart: Chart;
      disabled: true;
      collection: CollectionType;
      updateCollection?: (collection: CollectionType) => void;
      setIsAddChartOpen?: (val: boolean) => void;
      setChartId?: (id: string) => void;
      setIsEmbedOpen?: (val: boolean) => void;
    };

const FieldChart = ({
  chart,
  setChartId,
  setIsAddChartOpen,
  disabled,
  collection,
  updateCollection,
  setIsEmbedOpen,
}: Props) => {
  const [dataRows, setDataRows] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [hover, setHover] = useState(false);
  const property = collection.properties[chart?.fields[0]];
  const { mode } = useTheme();

  useEffect(() => {
    if (!property) return;
    const arr = Object.values(collection.data || {})
      .map((item) => {
        if (
          satisfiesAdvancedConditions(
            item,
            collection.properties,
            chart?.advancedFilters || ({} as ConditionGroup)
          )
        ) {
          if (property.type === "multiSelect") {
            return item[property.id]?.map((item: Option) => item.label);
          } else if (property.type === "singleSelect") {
            return item[property.id]?.label;
          } else if (property.type === "slider") {
            return item[property.id];
          }
        }
      })
      .filter((item) => item !== undefined);

    let labelsArr: string[] = [];

    if (property.type === "slider") {
      const min = property.sliderOptions?.min || 0;
      const max = property.sliderOptions?.max || 5;
      const step = property.sliderOptions?.step || 1;
      for (let i = min; i <= max; i += step) {
        labelsArr.push(i.toString());
      }
    } else {
      labelsArr =
        collection.properties[chart?.fields[0]]?.options?.map(
          (item) => item.label
        ) || [];
    }

    setLabels(labelsArr || []);

    // create empty array of length of labels
    const rowData = new Array(labelsArr?.length).fill(0);
    if (property.type === "multiSelect") {
      labelsArr?.forEach((label, index) => {
        arr.forEach((item) => {
          if (item?.includes(label)) {
            rowData[index] += 1;
          }
        });
      });
    } else {
      // loop through arr and increment the index of rowData
      arr.forEach((item) => {
        const index = labelsArr?.indexOf(item.toString());
        if (index !== undefined && index !== -1) {
          rowData[index] += 1;
        }
      });
    }
    setDataRows(rowData);
  }, [chart, collection.data, collection.properties]);

  return (
    <Box
      borderWidth={disabled ? "0" : "0.375"}
      padding="4"
      borderRadius="2xLarge"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      marginBottom="4"
    >
      <Stack space="0">
        {!disabled && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Text weight="semiBold" ellipsis size="small">
              {chart?.name}
            </Text>
            <motion.div
              animate={{
                opacity: hover ? 1 : 0,
              }}
            >
              <Stack direction="horizontal" space="1" align="flex-start">
                {/* <Tooltip title="Embed chart" theme={mode} position="top"> */}
                <Button
                  size="extraSmall"
                  shape="circle"
                  variant="transparent"
                  onClick={() => {
                    if (disabled) return;
                    setChartId(chart.id);
                    setIsEmbedOpen(true);
                  }}
                >
                  <Box>
                    <Text color="accent">
                      <ImEmbed size={16} />
                    </Text>
                  </Box>
                </Button>
                {/* </Tooltip> */}
                {/* <Tooltip title="Edit chart" theme={mode} position="top"> */}
                <Button
                  size="extraSmall"
                  shape="circle"
                  variant="transparent"
                  onClick={() => {
                    if (disabled) return;
                    setChartId(chart.id);
                    setIsAddChartOpen(true);
                  }}
                >
                  <Text color="accent">
                    <IconPencil size="4" />
                  </Text>
                </Button>
                {/* </Tooltip> */}
                {/* <Tooltip title="Delete chart" theme={mode} position="top"> */}
                <Button
                  size="extraSmall"
                  shape="circle"
                  variant="transparent"
                  onClick={async () => {
                    delete collection.formMetadata.charts?.[chart.id];
                    const res = await updateFormCollection(collection.id, {
                      formMetadata: {
                        ...collection.formMetadata,
                        chartOrder: collection.formMetadata.chartOrder?.filter(
                          (item) => item !== chart.id
                        ),
                      },
                    });
                    if (res.id) {
                      updateCollection(res);
                    } else {
                      logError("Error deleting chart");
                    }
                  }}
                >
                  <Text color="red">
                    <IconTrash size="4" />
                  </Text>
                </Button>
                {/* </Tooltip> */}
              </Stack>
            </motion.div>
          </Box>
        )}
        <Plot
          chart={chart}
          dataRows={dataRows}
          labels={labels}
          property={property}
        />
      </Stack>
    </Box>
  );
};

export default FieldChart;
