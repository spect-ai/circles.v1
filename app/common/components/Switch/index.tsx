import React from "react";
import * as ReactSwitch from "@radix-ui/react-switch";
import styles from "./styles.module.css";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Switch = ({ checked, onChange }: Props) => {
  return (
    <ReactSwitch.Root
      className={styles.SwitchRoot}
      checked={checked}
      onCheckedChange={onChange}
    >
      <ReactSwitch.Thumb className={styles.SwitchThumb} />
    </ReactSwitch.Root>
  );
};

export default Switch;
