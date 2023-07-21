import * as ReactTooltip from "@radix-ui/react-tooltip";
import { Box, Text } from "degen";
import styles from "./styles.module.css";

type Props = {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
} & React.PropsWithChildren<{}>;

const Tooltip = ({ content, side = "top", children }: Props) => {
  return (
    <ReactTooltip.Provider delayDuration={0}>
      <ReactTooltip.Root>
        <ReactTooltip.Trigger asChild>{children}</ReactTooltip.Trigger>
        <ReactTooltip.Portal>
          <ReactTooltip.Content side={side}>
            <Box backgroundColor="background" padding="2" borderRadius="large">
              <Text size="extraSmall" color="textTertiary">
                {content}
              </Text>
            </Box>
            <ReactTooltip.Arrow className={styles.TooltipArrow} />
          </ReactTooltip.Content>
        </ReactTooltip.Portal>
      </ReactTooltip.Root>
    </ReactTooltip.Provider>
  );
};

export default Tooltip;
