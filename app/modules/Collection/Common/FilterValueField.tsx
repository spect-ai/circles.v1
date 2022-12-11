/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import { CollectionType, Option } from "@/app/types";
import { Input, useTheme } from "degen";
import { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import { DateInput } from "../Form/Field";

type Props = {
  value: any;
  onChange: (value: any) => void;
  collection: CollectionType;
  propertyId: string;
  comparatorValue: string;
};

export default function FilterValueField({
  value,
  onChange,
  collection,
  propertyId,
  comparatorValue,
}: Props) {
  const type = collection?.properties[propertyId]?.type;
  const [memberOptions, setMemberOptions] = useState<Option[]>([]);
  const [rewardTokenOptions, setRewardTokenOptions] = useState<Option[]>([]);
  const { mode } = useTheme();
  const { circle } = useCircle();

  useEffect(() => {
    if (["user", "user[]"].includes(collection?.properties[propertyId]?.type)) {
      void (async () => {
        const res = await (
          await fetch(
            `${process.env.API_HOST}/circle/${circle.id}/memberDetails?circleIds=${circle.id}`
          )
        ).json();
        const memberOptions = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        setMemberOptions(memberOptions);
      })();
    }
    if ("reward" === collection?.properties[propertyId]?.type) {
      const tokenOptions = Object.entries(
        collection?.properties[propertyId]?.rewardOptions || {}
      )?.map(([key, value]) => {
        return Object.entries(value.tokenDetails)?.map((token) => ({
          label: `${token[1].symbol} on ${value.name}`,
          value: `${key}:${token[0]}`,
        }));
      });
      setRewardTokenOptions(tokenOptions.flat());
    }
  }, [circle.id, collection?.properties, propertyId]);

  switch (type) {
    case "shortText":
    case "longText":
    case "ethAddress":
    case "email":
    case "singleURL":
      return (
        <Input
          label=""
          placeholder={`Enter text`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          label=""
          type="number"
          placeholder={`Enter number`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "singleSelect":
      switch (comparatorValue) {
        case "is":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              isClearable={false}
            />
          );
        case "is not":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              isClearable={false}
            />
          );
        case "is one of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
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
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
            />
          );

        case "includes all of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
            />
          );
        case "includes one of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
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
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
            />
          );
        case "is not":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
            />
          );
        case "is one of":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
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
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
            />
          );

        case "includes all of":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
            />
          );
        case "includes one of":
          return (
            <Dropdown
              options={memberOptions || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
            />
          );
        default:
          return null;
      }
    case "date":
      return (
        <DateInput
          placeholder={`Enter date`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="date"
          mode={mode}
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
              placeholder={`Enter number`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        case "token is":
          return (
            <Dropdown
              options={rewardTokenOptions || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
              isClearable={false}
            />
          );
        case "token is one of":
          return (
            <Dropdown
              options={rewardTokenOptions || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
              isClearable={false}
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
          placeholder={`Enter number`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return null;
  }
}
