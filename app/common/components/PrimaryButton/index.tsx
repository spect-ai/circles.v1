import type { FC } from "react";

import { Button } from "degen";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { motion } from "framer-motion";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  icon?: ReactNodeNoStrings;
  variant?: "primary" | "secondary" | "tertiary" | "transparent";
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  animation?: "fade" | "slide" | "none";
  shape?: "circle" | "square";
  tone?: "red" | "accent" | "green" | "blue";
  type?: "button" | "submit" | "reset";
  tourId?: string;
  suffix?: ReactNodeNoStrings;
  center?: boolean;
}

export const slide = {
  hidden: { height: 0, opacity: 0 },
  open: { height: "2.5rem", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

export const fade = {
  hidden: { opacity: 0, x: 0, y: 0 },
  open: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  collapsed: {
    opacity: 0,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

const animationMapping = {
  slide: slide,
  fade: fade,
  none: {},
};

const PrimaryButton: FC<Props> = ({
  onClick,
  icon,
  variant = "secondary",
  disabled = false,
  loading = false,
  children,
  animation = "none",
  tone = "accent",
  type = "button",
  suffix,
  tourId,
  center = false,
}) => {
  return (
    <motion.div
      key="content"
      initial="hidden"
      animate="open"
      exit="collapsed"
      variants={animationMapping[animation]}
      transition={{ duration: 0.3 }}
    >
      <Button
        data-tour={tourId}
        disabled={disabled}
        loading={loading}
        width="full"
        size="small"
        variant={variant}
        prefix={icon}
        onClick={onClick}
        tone={tone as any}
        type={type}
        suffix={suffix}
        center={center}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default PrimaryButton;

export type { Props as PrimaryButtonProps };
