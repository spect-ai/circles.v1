import SignalUrgentIcon from "@/app/assets/icons/signal-urgent.svg";
import SignalMediumIcon from "@/app/assets/icons/signal-medium.svg";
import SignalStrongIcon from "@/app/assets/icons/signal-strong.svg";
import SignalWeakIcon from "@/app/assets/icons/signal-weak.svg";
import { Box, Tag, Text } from "degen";

interface Props {
  priority: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICONS: { [key: number]: any } = {
  3: SignalStrongIcon,
  2: SignalMediumIcon,
  1: SignalWeakIcon,
  4: SignalUrgentIcon,
  0: SignalWeakIcon,
};

const PriorityIcon: React.FC<Props> = ({ priority }: Props) => {
  const Icon = ICONS[priority];

  if (!Icon) {
    return <div />;
  }

  return (
    <Tag size="small" tone={priority > 2 ? "red" : "secondary"}>
      <Box marginTop="0.5" />
      <Text color={priority > 2 ? "red" : "accent"}>
        <Icon />
      </Text>
    </Tag>
  );
};

export default PriorityIcon;
