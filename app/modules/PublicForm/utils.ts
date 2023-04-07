/* eslint-disable no-case-declarations */
import { isEmail, isURL } from "@/app/common/utils/utils";
import { FormType } from "@/app/types";

type OptionType = {
  label: string;
  value: string;
};

type Credential = {
  id: string;
};

type Payment = {
  txnHash: string;
};

export const isEmpty = (
  propertyName: string,
  value: unknown,
  form: FormType
) => {
  switch (form?.properties[propertyName].type) {
    case "longText":
    case "shortText":
    case "ethAddress":
    case "user":
    case "date":
    case "singleURL":
    case "email":
      return !value;
    case "singleSelect":
      // convert type of valye from unknown to optiontype
      const optionValue = value as OptionType;
      return !optionValue || !optionValue.value || !optionValue.label;
    case "multiURL":
    case "multiSelect":
    case "milestone":
    case "user[]":
      const multiValue = value as OptionType[];
      return !multiValue || !multiValue.length;
    case "reward":
      const rewardValue = value as OptionType;
      return !rewardValue || !rewardValue.value;
    case "payWall":
      const payWallValue = value as Payment[];
      return !payWallValue?.some((v) => v.txnHash);
    case "discord":
    case "github":
    case "twitter":
    case "telegram":
      const credential = value as Credential;
      return !credential || !credential.id;
    default:
      return false;
  }
};

export const isIncorrectType = (
  propertyName: string,
  value: unknown,
  form: FormType
) => {
  switch (form?.properties[propertyName]?.type) {
    case "email":
      const emailValue = value as string;
      return value && !isEmail(emailValue);

    case "singleURL":
      const singleURLValue = value as string;
      return value && !isURL(singleURLValue);

    default:
      return false;
  }
};
