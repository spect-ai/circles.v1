import EditTag from "@/app/common/components/EditTag";
import ModalOption from "@/app/common/components/ModalOption";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { DashboardOutlined } from "@ant-design/icons";
import { Box, IconSearch, Input, Text } from "degen";
import { matchSorter } from "match-sorter";
import React, { memo, useEffect, useState } from "react";
import { CardType } from "@/app/types";
import useCardService from "@/app/services/Card/useCardService";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";

import {
  Option,
  priorityMapping,
} from "@/app/modules/Project/CreateCardModal/constants";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

type CardProps = {
  id: string;
  card: Partial<CardType>;
};

function CardPriority({ id, card }: CardProps) {
  const { updateProject } = useLocalProject();
  const { updateCard } = useCardService();
  const [priority, setPriority] = useState(card.priority || 0);
  const [modalOpen, setModalOpen] = useState(false);

  const [options, setOptions] = useState<Option[]>();
  const [filteredOptions, setFilteredOptions] = useState<Option[]>();

  const { canTakeAction } = useRoleGate();
  const { getOptions } = useModalOptions();

  useEffect(() => {
    const ops = getOptions("priority") as Option[];
    setOptions(ops);
    setFilteredOptions(ops);
  }, []);

  const onCardUpdate = async () => {
    const payload: { [key: string]: any } = {
      priority: priority,
    };
    const res = await updateCard(payload, id);
    console.log(res);
    if (res?.id) updateProject(res.project);
  };

  return (
    <EditTag
      tourId="create-card-modal-priority"
      name={priorityMapping[priority]}
      modalTitle="Select Priority"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <DashboardOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(191, 90, 242, 1)",
          }}
        />
      }
      disabled={!canTakeAction("cardPriority")}
      handleClose={() => {
        if (card?.priority !== priority) {
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
              isSelected={priority === item.value}
              item={item}
              onClick={() => {
                setPriority(item.value);
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
                  weight="semiBold"
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

export default memo(CardPriority);
