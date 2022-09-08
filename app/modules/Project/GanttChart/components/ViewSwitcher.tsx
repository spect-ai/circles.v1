import React, { useState } from "react";
import { Box, Tag, Button, IconPlusSmall } from "degen";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "react-toastify";

import PrimaryButton from "@/app/common/components/PrimaryButton";
import CreateCardModal from "../../CreateCardModal";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

import { ViewMode } from "gantt-task-react";

type ViewSwitcherProps = {
  isChecked: boolean;
  viewMode: ViewMode;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

type TagProps = {
  tag: ViewMode;
  tagText: string;
  onClick: () => void;
  viewMode: ViewMode;
};

const ViewContainer = styled(Box)`
  list-style: none;
  -ms-box-orient: horizontal;
  display: flex;
  margin: 0.5rem 1.3rem;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  align-items: center;
`;

const TimeTag = ({ tag, tagText, onClick, viewMode }: TagProps) => {
  return (
    <Box onClick={onClick} cursor="pointer">
      <Tag size="medium" tone={tag == viewMode ? "accent" : "secondary"}>
        {tagText}
      </Tag>
    </Box>
  );
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  viewMode,
}) => {
  const { localProject: project } = useLocalProject();
  const { canDo } = useRoleGate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useHotkeys("c", (e) => {
    e.preventDefault();
    if (!canDo(["steward", "contributor"])) {
      toast.error("You don't have permission to add cards in this column", {
        theme: "dark",
      });
      return;
    }
    setIsOpen(true);
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <CreateCardModal
            column={project?.columnOrder?.[0]}
            handleClose={() => {
              if (isDirty && !showConfirm) {
                setShowConfirm(true);
              } else {
                setIsOpen(false);
              }
            }}
            setIsDirty={setIsDirty}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            setIsOpen={setIsOpen}
          />
        )}
      </AnimatePresence>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          prefix={<IconPlusSmall />}
          size="small"
          variant="secondary"
          onClick={() => {
            if (!canDo(["steward", "contributor"])) {
              toast.error(
                "You don't have permission to add cards in this column",
                { theme: "dark" }
              );
              return;
            }
            setIsOpen(true);
          }}
        >
          Create
        </Button>
        <ViewContainer>
          <Box display="flex" flexDirection="row" gap="3" alignItems="center">
            <TimeTag
              tag={ViewMode.Hour}
              tagText="Hour"
              onClick={() => onViewModeChange(ViewMode.Hour)}
              viewMode={viewMode}
            />
            <TimeTag
              tag={ViewMode.QuarterDay}
              tagText="Quarter of Day"
              onClick={() => onViewModeChange(ViewMode.QuarterDay)}
              viewMode={viewMode}
            />
            <TimeTag
              tag={ViewMode.HalfDay}
              tagText="Half of Day"
              onClick={() => onViewModeChange(ViewMode.HalfDay)}
              viewMode={viewMode}
            />
            <TimeTag
              tag={ViewMode.Day}
              tagText="Day"
              onClick={() => onViewModeChange(ViewMode.Day)}
              viewMode={viewMode}
            />
            <TimeTag
              tag={ViewMode.Week}
              tagText="Week"
              onClick={() => onViewModeChange(ViewMode.Week)}
              viewMode={viewMode}
            />
            <TimeTag
              tag={ViewMode.Month}
              tagText="Month"
              onClick={() => onViewModeChange(ViewMode.Month)}
              viewMode={viewMode}
            />
            <TimeTag
              tag={ViewMode.Year}
              tagText="Year"
              onClick={() => onViewModeChange(ViewMode.Year)}
              viewMode={viewMode}
            />
            <PrimaryButton onClick={() => onViewListChange(!isChecked)}>
              {isChecked ? "Hide" : "Show"} Task List{" "}
            </PrimaryButton>
          </Box>
        </ViewContainer>
      </Box>
    </>
  );
};
