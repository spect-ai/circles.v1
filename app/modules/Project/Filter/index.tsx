import Dropdown, {
  OptionType as SingleSelectOptionType,
} from "@/app/common/components/Dropdown";
import { grow } from "@/app/common/components/Modal";
import MultiSelectDropdown from "@/app/common/components/MultiSelectDropDown/MultiSelectDropDown";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import {
  CircleType,
  FilterType,
  FilterProperty,
  MemberDetails,
} from "@/app/types";
import { FilterOutlined } from "@ant-design/icons";
import { Box, Button, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../Context/LocalProjectContext";
import { labels } from "../ProjectViews/constants";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { getConditionOptions } from "./filterMap";

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
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    { enabled: false }
  );
  const [loading, setLoading] = useState(false);

  const [activeFilterProperties, setActiveFilterProperties] = useState(
    [] as FilterProperty[]
  );
  const [options, setOptions] = useState([] as SingleSelectOptionType[]);
  const [conditionOptions, setConditionOptions] = useState(
    [] as SingleSelectOptionType[]
  );
  const [valueOptions, setValueOptions] = useState([] as any[]);

  const [allMembers, setAllMembers] = useState([] as any[]);

  const filterIsOn: boolean =
    Object.keys(currentFilter) && Object.keys(currentFilter).length > 0;

  const handleClick = () => {
    setFilterOpen(!filterOpen);
  };

  const defaultProperty = () => {
    return {
      id: {
        label: "Assignee",
        value: "assignee",
      },
      condition: {
        label: "is",
        value: "is",
      },
      value: "",
    };
  };

  useEffect(() => {
    if (circle) {
      const circleMembersArray = circle?.members.map((mem) => ({
        name: memberDetails?.memberDetails[mem]?.username as string,
        id: mem,
        label: memberDetails?.memberDetails[mem]?.username as string,
        value: mem,
      }));
      setAllMembers(circleMembersArray);
    }
  }, [circle, memberDetails?.memberDetails]);

  useEffect(() => {
    const ops = getOptions("filter") as unknown as SingleSelectOptionType[];
    setOptions(ops);
  }, [filterOpen]);

  useEffect(() => {
    setLoading(true);
    setActiveFilterProperties(
      currentFilter?.properties?.length > 0
        ? currentFilter?.properties
        : [defaultProperty()]
    );
    setLoading(false);
  }, [currentFilter?.properties, filterOpen]);

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
            width="180"
            style={{
              border: `2px solid ${
                mode == "dark"
                  ? "rgb(255, 255, 255, 0.05)"
                  : "rgb(20, 20, 20, 0.05)"
              }`,
              borderRadius: "0.7rem",
            }}
          >
            {!loading &&
              activeFilterProperties.map((p, index) => {
                return (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Box width="12">
                      <Text variant="large">
                        {index === 0 ? `Where` : `And`}
                      </Text>
                    </Box>
                    <Box marginLeft="4">
                      <Dropdown
                        width="14"
                        options={options}
                        selected={p.id}
                        onChange={(option) => {
                          activeFilterProperties[index].id = option;
                          setActiveFilterProperties(activeFilterProperties);
                        }}
                      />
                    </Box>
                    <Box marginLeft="4">
                      <Dropdown
                        width="10"
                        options={conditionOptions}
                        selected={p.condition}
                        onChange={(option) => {
                          activeFilterProperties[index].condition = option;
                          setActiveFilterProperties(activeFilterProperties);
                        }}
                      />
                    </Box>
                    <Box marginLeft="4">
                      {activeFilterProperties[0].condition?.value ===
                        "isOneOf" &&
                        valueOptions && (
                          <MultiSelectDropdown
                            width="8"
                            options={valueOptions}
                            value={activeFilterProperties[index].value}
                            setValue={(v) => {
                              console.log(v);
                              activeFilterProperties[index].value = v;
                              setActiveFilterProperties(activeFilterProperties);
                            }}
                          />
                        )}
                      {activeFilterProperties[0].condition?.value === "is" &&
                        valueOptions && (
                          <Dropdown
                            width="12"
                            options={valueOptions}
                            selected={activeFilterProperties[index].value}
                            onChange={(option) => {
                              activeFilterProperties[index].value = option;
                              setActiveFilterProperties(activeFilterProperties);
                            }}
                          />
                        )}
                    </Box>
                  </Box>
                );
              })}

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
                justifyContent="flex-start"
              >
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => {
                    console.log(activeFilterProperties);
                    setLoading(true);
                    const newActiveFilters = [
                      ...activeFilterProperties,
                      defaultProperty(),
                    ];
                    setActiveFilterProperties(newActiveFilters);
                    setLoading(false);
                  }}
                >
                  Add Condition
                </Button>
              </Box>
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
          ;
        </motion.div>
      </AnimatePresence>
    </Popover>
  );
}
