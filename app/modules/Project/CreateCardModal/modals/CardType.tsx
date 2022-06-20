import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { AuditOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import React, { useEffect, useState } from "react";
import { matchSorter } from "match-sorter";
import { useLocalCard } from "../hooks/LocalCardContext";
import { getOptions, Option } from "../utils";

export default function CardType() {
  const { cardType, setCardType, project } = useLocalCard();
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  useEffect(() => {
    const ops = getOptions("card", project) as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);
  return (
    <EditTag
      name={cardType}
      modalTitle="Select Card Type"
      label="Card Type"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <AuditOutlined
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
              isSelected={cardType === item.value}
              item={item}
              onClick={() => {
                setCardType(item.value);
                setModalOpen(false);
              }}
            >
              <Box style={{ width: "15%" }}>
                <item.icon
                  color={cardType === item.value ? "accent" : "textSecondary"}
                />
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "25%",
                }}
              >
                <Text
                  size="small"
                  color={cardType === item.value ? "accent" : "text"}
                  weight="bold"
                >
                  {item.name}
                </Text>
              </Box>
              <Box style={{ width: "65%" }}>
                <Text size="label" color="textSecondary">
                  {item.secondary}
                </Text>
              </Box>
            </ModalOption>
          ))}
          {!filteredOptions?.length && (
            <Text variant="label">No Card type found</Text>
          )}
        </Box>
      </Box>
    </EditTag>
  );
}
