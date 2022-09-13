import Dropdown, {
  OptionType as SingleSelectOptionType,
} from "@/app/common/components/Dropdown";
import { grow } from "@/app/common/components/Modal";
import MultiSelectDropdown from "@/app/common/components/MultiSelectDropDown/MultiSelectDropDown";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { CircleType } from "@/app/types";
import { FilterOutlined } from "@ant-design/icons";
import { Box, Button, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../Context/LocalProjectContext";
import { labels } from "../ProjectViews/constants";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

export default function Filter() {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const { mode } = useTheme();
  const { currentFilter, setCurrentFilter } = useGlobal();
  const { getOptions } = useModalOptions();

  const { circle: cId } = router.query;
  const { localProject: project } = useLocalProject();
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const [filterPropertyId, setFilterPropertyId] = useState(
    {} as SingleSelectOptionType
  );
  const [filterPropertyComparison, setFilterPropertyComparison] = useState({
    label: "is",
    value: "is",
  } as SingleSelectOptionType);
  const [options, setOptions] = useState([] as SingleSelectOptionType[]);

  const filterIsOn: boolean =
    Object.keys(currentFilter) && Object.keys(currentFilter).length > 0;

  const handleClick = () => {
    setCurrentFilter({});
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    const ops = getOptions("filter") as unknown as SingleSelectOptionType[];
    setOptions(ops);
  }, []);

  return (
    <Popover
      isOpen={filterOpen}
      setIsOpen={setFilterOpen}
      placement="bottom-end"
      butttonComponent={
        <Button
          shape="circle"
          size="small"
          variant="transparent"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          {filterIsOn && (
            <div
              style={{
                backgroundColor: "rgb(191, 90, 242, 1)",
                height: "0.4rem",
                width: "0.4rem",
                borderRadius: "3rem",
                position: "absolute",
                margin: "0px 4px 0px 12px",
              }}
            />
          )}
          <FilterOutlined
            style={{
              color: `${filterIsOn ? "rgb(191, 90, 242, 0.7)" : "gray"}`,
              fontSize: "1.1rem",
            }}
          />
        </Button>
      }
    >
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={grow}
        >
          <Box
            padding={"3"}
            backgroundColor="background"
            width="128"
            style={{
              border: `2px solid ${
                mode == "dark"
                  ? "rgb(255, 255, 255, 0.05)"
                  : "rgb(20, 20, 20, 0.05)"
              }`,
              borderRadius: "0.7rem",
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text variant="large">Where</Text>
              <Box marginLeft="4">
                <Dropdown
                  width="10"
                  options={options}
                  selected={filterPropertyId}
                  onChange={(option) => {
                    setFilterPropertyId(option);
                  }}
                />
              </Box>
              <Box marginLeft="4">
                <Dropdown
                  width="10"
                  options={[
                    {
                      label: "is",
                      value: "is",
                    },
                  ]}
                  selected={filterPropertyComparison}
                  onChange={(option) => {
                    setFilterPropertyComparison(option);
                  }}
                />
              </Box>
              {/* <Box marginLeft="4">
                { 
                
                <MultiSelectDropdown
                  width="22"
                  options={labels}
                  value={label}
                  setValue={setLabels}
                  title={"Labels"}
                />}
              </Box> */}
            </Box>
            <Box
              marginTop="4"
              display="flex"
              flexDirection="row"
              alignItems="center"
              width="full"
            >
              <Box
                width="full"
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                <PrimaryButton onClick={handleClick}>Filter</PrimaryButton>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Popover>
  );
}
