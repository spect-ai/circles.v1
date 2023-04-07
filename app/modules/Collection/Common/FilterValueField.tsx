/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import { CollectionType, Option } from "@/app/types";
import { Input, useTheme } from "degen";
import { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import { DateInput } from "../Form/Field";

type Props = {
  value: unknown;
  onChange: (value: unknown) => void;
  collection: CollectionType;
  propertyId: string;
  dropDownPortal: boolean;

  comparatorValue: string;
};

const FilterValueField = ({
  value,
  onChange,
  collection,
  propertyId,
  comparatorValue,
  dropDownPortal,
}: Props) => {
  const type = collection?.properties[propertyId]?.type;
  const [memberOptions, setMemberOptions] = useState<Option[]>([]);
  const [rewardTokenOptions, setRewardTokenOptions] = useState<Option[]>([]);
  const { mode } = useTheme();
  const { circle } = useCircle();

  useEffect(() => {
    if (["user", "user[]"].includes(collection?.properties[propertyId]?.type)) {
      (async () => {
        const res = await (
          await fetch(
            `${process.env.API_HOST}/circle/${circle?.id}/memberDetails?circleIds=${circle?.id}`
          )
        ).json();
        const memberOptions2 = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        setMemberOptions(memberOptions2);
      })();
    }
    if (collection?.properties[propertyId]?.type === "reward") {
      const tokenOptions = Object.entries(
        collection?.properties[propertyId]?.rewardOptions || {}
      )?.map(([key, value2]) =>
        Object.entries((value as any).tokenDetails as any)?.map(
          (token: any) => ({
            label: `${token[1].symbol} on ${value2.name}`,
            value: `${key}:${token[0]}`,
          })
        )
      );
      setRewardTokenOptions(tokenOptions.flat());
    }
  }, [circle?.id, collection?.properties, propertyId]);

  switch (type) {
    case "shortText":
    case "longText":
    case "ethAddress":
    case "email":
    case "singleURL":
      return (
        <Input
          label=""
          placeholder="Enter text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          label=""
          type="number"
          placeholder="Enter number"
          value={value as number}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "singleSelect":
      switch (comparatorValue) {
        case "is":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value as Option}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        case "is not":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value as Option}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        case "is one of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        default:
          return null;
      }
    case "multiSelect":
      switch (comparatorValue) {
        case "does not include":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );

        case "includes all of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        case "includes one of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        default:
          return null;
      }
    case "user":
      switch (comparatorValue) {
        case "is":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value as Option}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              portal={dropDownPortal}
            />
          );
        case "is not":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value as Option}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              portal={dropDownPortal}
            />
          );
        case "is one of":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        default:
          return null;
      }
    case "user[]":
      switch (comparatorValue) {
        case "does not include":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              portal={dropDownPortal}
            />
          );

        case "includes all of":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        case "includes one of":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        default:
          return null;
      }
    case "date":
      return (
        <DateInput
          placeholder="Enter date"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          type="date"
          mode={mode}
          style={{ marginTop: "6px" }}
        />
      );
    case "reward":
      switch (comparatorValue) {
        case "value is":
        case "value is greater than":
        case "value is less than":
          return (
            <Input
              label=""
              type="number"
              placeholder="Enter number"
              value={value as number}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        case "token is":
          return (
            <Dropdown
              options={rewardTokenOptions || []}
              selected={value as Option}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        case "token is one of":
          return (
            <Dropdown
              options={rewardTokenOptions || []}
              selected={value as Option[]}
              onChange={(option) => {
                onChange(option);
              }}
              multiple
              isClearable={false}
              portal={dropDownPortal}
            />
          );
        default:
          return null;
      }
    case "milestone":
      return (
        <Input
          label=""
          type="number"
          placeholder="Enter number"
          value={value as number}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return null;
  }
};

export default FilterValueField;
