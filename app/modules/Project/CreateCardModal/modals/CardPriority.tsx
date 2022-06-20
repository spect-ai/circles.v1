import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { DashboardOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import { matchSorter } from "match-sorter";
import React, { useEffect, useState } from "react";
import { useLocalCard } from "../hooks/LocalCardContext";
import { getOptions, Option, priorityMapping } from "../utils";

export default function CardPriority() {
  const { priority, setPriority, project } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  useEffect(() => {
    const ops = getOptions("priority", project) as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  return (
    <EditTag
      name={priorityMapping[priority]}
      modalTitle="Select Priority"
      label="Priority"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <DashboardOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(175, 82, 222, 1)",
          }}
        />
      }
    >
      <Box height="96">
        <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
          <Input
            hideLabel
            label=""
            placeholder="Search"
            prefix={<IconSearch />}
            onChange={(e) => {
              setFilteredOptions(
                matchSorter(options as Option[], e.target.value, {
                  keys: ["name"],
                })
              );
            }}
          />
        </Box>
        <Box>
          {filteredOptions?.map((item: any) => (
            <ModalOption
              key={item.value}
              isSelected={priority === item.value}
              item={item}
              onClick={() => {
                setPriority(item.value);
                setModalOpen(false);
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text
                  size="small"
                  color={priority === item.value ? "accent" : "text"}
                  weight="bold"
                >
                  {item.name}
                </Text>
              </Box>
            </ModalOption>
          ))}
          {!filteredOptions?.length && (
            <Text variant="label">No Priority found</Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}
