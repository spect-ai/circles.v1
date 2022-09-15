import Dropdown, {
  OptionType as SingleSelectOptionType,
} from "@/app/common/components/Dropdown";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { grow } from "@/app/common/components/Modal";
import MultiSelectDropdown, {
  InputBox,
} from "@/app/common/components/MultiSelectDropDown/MultiSelectDropDown";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { FilterProperty } from "@/app/types";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import { Box, Button, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import useFilterMap from "./filterMap";

const Input = styled.input`
  background-color: transparent;
  padding: 0.8rem;
  display: flex;
  border-style: none;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
`;

export default function Filter() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { mode } = useTheme();
  const { currentFilter, setCurrentFilter } = useGlobal();
  const { getOptions } = useModalOptions();
  const { getConditionOptions, getValue, defaultProperty } = useFilterMap();

  const { localProject: project } = useLocalProject();

  const [loading, setLoading] = useState(false);

  const [activeFilterProperties, setActiveFilterProperties] = useState(
    [] as FilterProperty[]
  );
  const [options, setOptions] = useState([] as SingleSelectOptionType[]);

  const filterIsOn: boolean =
    currentFilter?.properties && currentFilter?.properties.length > 0;

  const handleClick = () => {
    console.log(activeFilterProperties);
    setCurrentFilter({
      properties: activeFilterProperties,
    });
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    const ops = getOptions("filter") as unknown as SingleSelectOptionType[];
    setOptions(ops);
  }, [filterOpen]);

  useEffect(() => {
    if (filterOpen) {
      setLoading(true);
      setActiveFilterProperties(
        currentFilter?.properties?.length > 0
          ? currentFilter?.properties
          : [defaultProperty()]
      );
      setLoading(false);
    }
  }, [filterOpen]);

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
                          setLoading(true);
                          const conditionOptions =
                            getConditionOptions(
                              project?.properties[option.value].type
                            ) || [];
                          const v = getValue(
                            option.value,
                            project?.properties[option.value].type,
                            conditionOptions[0].value
                          );
                          const filterProps = {
                            ...p,
                            id: option,
                            conditionOptions: conditionOptions,
                            condition: conditionOptions[0],
                            valueType: v?.valueType,
                            value: v?.value,
                            valueSingleSelectOptions:
                              v?.valueSingleSelectOptions,
                            valueMultiSelectOptions: v?.valueMultiSelectOptions,
                          } as FilterProperty;
                          activeFilterProperties.splice(index, 1, filterProps);
                          setActiveFilterProperties([
                            ...activeFilterProperties,
                          ]);

                          setLoading(false);
                        }}
                      />
                    </Box>
                    {!loading && (
                      <Box marginLeft="4">
                        <Dropdown
                          width="10"
                          options={p.conditionOptions || []}
                          selected={p.condition}
                          onChange={(option) => {
                            setLoading(true);

                            const v = getValue(
                              p.id.value,
                              project?.properties[p.id.value].type,
                              option.value
                            );
                            const filterProps = {
                              ...p,
                              condition: option,
                              valueType:
                                v?.valueType as FilterProperty["valueType"],
                              value: v?.value,
                              valueSingleSelectOptions:
                                v?.valueSingleSelectOptions,
                              valueMultiSelectOptions:
                                v?.valueMultiSelectOptions,
                            };
                            activeFilterProperties.splice(
                              index,
                              1,
                              filterProps
                            );
                            setActiveFilterProperties([
                              ...activeFilterProperties,
                            ]);
                            setLoading(false);
                          }}
                        />
                      </Box>
                    )}
                    <Box marginLeft="4">
                      {!loading &&
                        p.valueType &&
                        ["user[]", "string[]", "multiSelect"].includes(
                          p.valueType
                        ) && (
                          <MultiSelectDropdown
                            width="12"
                            options={p.valueMultiSelectOptions || []}
                            value={p.value}
                            setValue={(v) => {
                              setLoading(true);

                              const filterProps = {
                                ...p,
                                value: v,
                              };
                              activeFilterProperties.splice(
                                index,
                                1,
                                filterProps
                              );
                              setActiveFilterProperties([
                                ...activeFilterProperties,
                              ]);
                              setLoading(false);
                            }}
                          />
                        )}
                      {!loading &&
                        p.valueType &&
                        ["user", "singleSelect"].includes(p.valueType) && (
                          <Dropdown
                            width="12"
                            options={p.valueSingleSelectOptions || []}
                            selected={p.value}
                            onChange={(option) => {
                              setLoading(true);

                              const filterProps = {
                                ...p,
                                value: option,
                              };
                              activeFilterProperties.splice(
                                index,
                                1,
                                filterProps
                              );
                              setActiveFilterProperties([
                                ...activeFilterProperties,
                              ]);
                              setLoading(false);
                            }}
                          />
                        )}
                      {!loading &&
                        p.valueType &&
                        ["string"].includes(p.valueType) && (
                          <Input
                            value={p.value}
                            onChange={(e) => {
                              setLoading(true);

                              const filterProps = {
                                ...p,
                                value: e.target.value,
                              };
                              activeFilterProperties.splice(
                                index,
                                1,
                                filterProps
                              );
                              setActiveFilterProperties([
                                ...activeFilterProperties,
                              ]);
                              setLoading(false);
                            }}
                            maxLength={15}
                          />
                        )}
                      {!loading &&
                        p.valueType &&
                        ["date"].includes(p.valueType) && (
                          <ReactDatePicker
                            // ref={dateRef}
                            selected={p.value ? p.value : new Date()}
                            onChange={(date: Date) => {
                              console.log(date);
                              setLoading(true);

                              const filterProps = {
                                ...p,
                                value: new Date(date),
                              };
                              activeFilterProperties.splice(
                                index,
                                1,
                                filterProps
                              );
                              setActiveFilterProperties([
                                ...activeFilterProperties,
                              ]);
                              setLoading(false);
                            }}
                            customInput={<Input type="text" id={"date"} />}
                          />
                        )}
                      {!loading &&
                        p.valueType &&
                        ["number"].includes(p.valueType) && (
                          <Input
                            value={p.value}
                            type="number"
                            onChange={(e) => {
                              setLoading(true);

                              const filterProps = {
                                ...p,
                                value: e.target.value,
                              };
                              activeFilterProperties.splice(
                                index,
                                1,
                                filterProps
                              );
                              setActiveFilterProperties([
                                ...activeFilterProperties,
                              ]);
                              setLoading(false);
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
                justifyContent="flex-start"
              >
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => {
                    setLoading(true);
                    setActiveFilterProperties([defaultProperty()]);
                    setCurrentFilter({
                      properties: [],
                    });
                    setLoading(false);
                  }}
                >
                  Clear Filter
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
