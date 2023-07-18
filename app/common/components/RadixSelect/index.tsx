import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import styles from "./styles.module.css";
import { BiCheck, BiChevronDown, BiChevronUp } from "react-icons/bi";

const fruits = [
  { label: "Banana", value: "banana" },
  { label: "Apple", value: "apple" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" },
  { label: "Pineapple", value: "pineapple" },
];

const vegetables = [
  { label: "Carrot", value: "carrot" },
  { label: "Potato", value: "potato" },
  { label: "Onion", value: "onion" },
  { label: "Broccoli", value: "broccoli" },
  { label: "Lettuce", value: "lettuce" },
];

const meat = [
  { label: "Chicken", value: "chicken" },
  { label: "Mutton", value: "mutton" },
];

const RadixSelect = () => (
  <Select.Root>
    <Select.Trigger className={styles.SelectTrigger} aria-label="Food">
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon className={styles.Selecticon}>
        <BiChevronDown />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className={styles.SelectContent}>
        <Select.ScrollUpButton className={styles.SelectScrollButton}>
          <BiChevronUp />
        </Select.ScrollUpButton>
        <Select.Viewport className={styles.SelectViewport}>
          <Select.Group>
            <Select.Label className={styles.SelectLabel}>Fruits</Select.Label>

            {fruits.map((fruit) => (
              <Select.Item
                className={styles.SelectItem}
                value={fruit.value}
                key={fruit.value}
              >
                <Select.ItemText>{fruit.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.SelectItemIndicator}>
                  <BiCheck />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>

          <Select.Separator className={styles.SelectSeparator} />

          <Select.Group>
            <Select.Label className={styles.SelectLabel}>
              Vegetables
            </Select.Label>
            {vegetables.map((vegetable) => (
              <Select.Item
                className={styles.SelectItem}
                value={vegetable.value}
                key={vegetable.value}
              >
                <Select.ItemText>{vegetable.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.SelectItemIndicator}>
                  <BiCheck />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>

          <Select.Separator className={styles.SelectSeparator} />

          <Select.Group>
            <Select.Label className={styles.SelectLabel}>Meat</Select.Label>
            {meat.map((meat) => (
              <Select.Item
                className={styles.SelectItem}
                value={meat.value}
                key={meat.value}
              >
                <Select.ItemText>{meat.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.SelectItemIndicator}>
                  <BiCheck />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className={styles.SelectScrollButton}>
          <BiChevronDown />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

// const SelectItem = React.forwardRef(
//   ({ children, className, ...props }, forwardedRef) => {
//     return (

//     );
//   }
// );

export default RadixSelect;
