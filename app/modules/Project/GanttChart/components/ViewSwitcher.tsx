import React from "react";
import { Box, Tag } from "degen";
import styled from "styled-components";
import PrimaryButton from "@/app/common/components/PrimaryButton";

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
  return (
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
  );
};
