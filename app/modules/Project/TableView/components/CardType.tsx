import useCardService from "@/app/services/Card/useCardService";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";

import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import { AuditOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import React, { memo, useEffect, useState } from "react";
import { matchSorter } from "match-sorter";

import { Option } from "@/app/modules/Project/CreateCardModal/constants";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

export function CardType({
  id,
  type,
}: {
  id: string;
  type: "Bounty" | "Task";
}) {
  const [cardType, setCardType] = useState(type);
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions } = useModalOptions();
  const { updateProject } = useLocalProject();
  const { updateCard } = useCardService();

  const onCardUpdate = async () => {
    const res = await updateCard({ type: cardType }, id);
    console.log(res);
    if (res?.id) updateProject(res.project);
  };

  useEffect(() => {
    const ops = getOptions("card") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);
  return (
    <EditTag
      tourId="card-type"
      name={cardType}
      modalTitle="Select Card Type"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <AuditOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(191, 90, 242, 1)",
          }}
        />
      }
      disabled={!canTakeAction("cardType")}
      handleClose={() => {
        if (type !== cardType) {
          void onCardUpdate();
        }
        setModalOpen(false);
      }}
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
                  weight="semiBold"
                >
                  {item.name}
                </Text>
              </Box>
              <Box style={{ width: "65%" }}>
                <Text size="label" color="textSecondary" whiteSpace="pre-wrap">
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
