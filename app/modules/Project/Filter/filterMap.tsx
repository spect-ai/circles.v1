import { CircleType, MemberDetails } from "@/app/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalProject } from "../Context/LocalProjectContext";

export default function useFilterMap() {
  const router = useRouter();

  const { circle: cId } = router.query;
  const { localProject: project } = useLocalProject();
  const { circle, registry } = useCircle();

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    { enabled: false }
  );
  const [allMembers, setAllMembers] = useState([] as any[]);

  useEffect(() => {
    if (circle) {
      const circleMembersArray = circle?.members.map((mem) => ({
        name: memberDetails?.memberDetails[mem]?.username as string,
        id: mem,
        label: memberDetails?.memberDetails[mem]?.username as string,
        value: mem,
      }));
      setAllMembers(circleMembersArray);
    }
  }, [circle, memberDetails?.memberDetails]);

  const getConditionOptions = (type: string) => {
    switch (type) {
      case "user[]":
        return [
          {
            label: "is",
            value: "is",
          },
          {
            label: "is one of",
            value: "isOneOf",
          },
        ];
      case "shortText":
        return [
          {
            label: "is",
            value: "is",
          },
          {
            label: "includes",
            value: "includes",
          },
        ];
      case "longText":
        return [
          {
            label: "is",
            value: "is",
          },
          {
            label: "includes",
            value: "includes",
          },
        ];
      case "number":
        return [
          {
            label: "is",
            value: "is",
          },
        ];
      case "reward":
        return [
          {
            label: "value is equal to",
            value: "isValue",
          },
          {
            label: "value is higher than",
            value: "isHigherThanValue",
          },
          {
            label: "value is lower than",
            value: "isLowerThanValue",
          },
        ];

      case "date":
        return [
          {
            label: "is",
            value: "is",
          },
          {
            label: "is After",
            value: "isAfter",
          },
          {
            label: "is Before",
            value: "isBefore",
          },
        ];

      case "singleSelect":
        return [
          {
            label: "is",
            value: "is",
          },
          {
            label: "is one of",
            value: "isOneOf",
          },
        ];

      case "multiSelect":
        return [
          {
            label: "value is exactly",
            value: "isExactly",
          },
        ];

      case "ethAddress":
        return [
          {
            label: "is",
            value: "is",
          },
        ];
    }
  };

  const getValueOptions = (id: string) => {
    const options = project.properties[id]?.options;
    if (options) {
      return options.map((o) => ({
        name: o.label,
        id: o.value,
        label: o.label,
        value: o.value,
      }));
    } else return [];
  };

  const getNetworkOptions = (id: string) => {
    if (registry) {
      return Object.keys(registry).map((o) => ({
        name: registry[o].name,
        id: o,
        label: registry[o].name,
        value: o,
      }));
    } else return [];
  };

  const getValue = (id: string, type: string, conditionValue: string) => {
    switch (type) {
      case "user[]":
        switch (conditionValue) {
          case "is":
            return {
              value: {},
              valueType: "user",
              valueSingleSelectOptions: allMembers,
              valueMultiSelectOptions: [],
            };
          case "isOneOf":
            return {
              value: [],
              valueType: "user[]",
              valueSingleSelectOptions: [],
              valueMultiSelectOptions: allMembers,
            };
        }
        break;
      case "shortText":
      case "longText":
        return {
          value: "",
          valueType: "string",
          valueSingleSelectOptions: [],
          valueMultiSelectOptions: [],
        };

      case "number":
        return {
          value: 0,
          valueType: "number",
          valueSingleSelectOptions: [],
          valueMultiSelectOptions: [],
        };

      case "singleSelect":
        switch (conditionValue) {
          case "is":
            return {
              value: {},
              valueType: "singleSelect",
              valueSingleSelectOptions: getValueOptions(id),
              valueMultiSelectOptions: [],
            };
          case "isOneOf":
            return {
              value: [],
              valueType: "multiSelect",
              valueSingleSelectOptions: [],
              valueMultiSelectOptions: getValueOptions(id),
            };
        }
        break;
      case "multiSelect":
        switch (conditionValue) {
          case "isExactly":
            return {
              value: [],
              valueType: "multiSelect",
              valueSingleSelectOptions: [],
              valueMultiSelectOptions: getValueOptions(id),
            };
          case "isPartially":
            return {
              value: [],
              valueType: "multiSelect",
              valueSingleSelectOptions: [],
              valueMultiSelectOptions: getValueOptions(id),
            };
        }
        break;
      case "date":
        return {
          value: "",
          valueType: "date",
          valueSingleSelectOptions: [],
          valueMultiSelectOptions: [],
        };
      case "ethAddress":
        return {
          value: "",
          valueType: "string",
          valueSingleSelectOptions: [],
          valueMultiSelectOptions: [],
        };
      case "reward":
        return {
          value: 0,
          valueType: "reward",
          valueSingleSelectOptions: [],
          valueMultiSelectOptions: [],
        };
    }
  };

  return {
    getConditionOptions,
    getValue,
  };
}
