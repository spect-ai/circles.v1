/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCollectionDataGuarded } from "@/app/services/Collection";
import { exportToCsv } from "@/app/services/CsvExport";
import {
  ConditionGroup,
  Milestone,
  Option,
  PropertyType,
  Reward,
  UserType,
} from "@/app/types";
import { Box, Spinner } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  Column,
  DataSheetGrid,
  dateColumn,
  floatColumn,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";
import { useScreenClass } from "react-grid-system";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import CardDrawer from "../../CollectionProject/CardDrawer";
import Filtering from "../../CollectionProject/Filtering";
import IncentiveFilter from "../../CollectionProject/Filtering/IncentiveFilter";
import AddField from "../AddField";
import { isMyCard, paymentStatus } from "../Common/SatisfiesFilter";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import DataDrawer from "../Form/DataDrawer";
import ExpandableCell from "../Form/ExpandableCell";
import CeramicComponent from "./CeramicComponent";
import CredentialComponent from "./CredentialComponent";
import DiscordComponent from "./DiscordComponent";
import GithubComponent from "./GithubComponent";
import GutterColumnComponent from "./GutterColumnComponent";
import HeaderComponent from "./HeaderComponent";
import MilestoneComponent from "./MilestoneComponent";
import MultiMilestoneModal from "./MultiMilestoneModal";
import MultiURLComponent from "./MultiURLComponent";
import MultiURLModal from "./MultiURLModal";
import PaymentComponent from "./PaymentComponent";
import RewardComponent from "./RewardComponent";
import RewardModal from "./RewardModal";
import SelectComponent from "./SelectComponent";
import TelegramComponent from "./TelegramComponent";
import { logError } from "@/app/common/utils/utils";
import { satisfiesAdvancedConditions } from "../Common/SatisfiesAdvancedFilter";
import { sortFieldValues } from "../Common/SortFieldValues";
import { useCircle } from "../../Circle/CircleContext";

export default function TableView() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [isRewardFieldOpen, setIsRewardFieldOpen] = useState(false);
  const [isURLFieldOpen, setIsURLFieldOpen] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [dataId, setDataId] = useState<string>("");
  const [multipleMilestoneModalOpen, setMultipleMilestoneModalOpen] =
    useState(false);
  const [data, setData] = useState<any[]>();
  const { registry } = useCircle();
  const {
    localCollection: collection,
    updateCollection,
    searchFilter,
    projectViewId,
    showMyTasks,
    paymentFilter,
  } = useLocalCollection();

  const { data: currentUser, refetch } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [expandedDataSlug, setExpandedDataSlug] = useState("");
  const [refreshTable, setRefreshTable] = useState(false);

  const screenClass = useScreenClass();

  const router = useRouter();
  const { dataId: dataSlug, cardSlug, newCard } = router.query;

  useEffect(() => {
    if (dataSlug) {
      setExpandedDataSlug(dataSlug as string);
    }
    if (cardSlug) {
      setExpandedDataSlug(cardSlug as string);
    }
    if (newCard) {
      setExpandedDataSlug("");
    }
  }, [dataSlug, setExpandedDataSlug, cardSlug, newCard]);

  const updateData = useCallback(
    async ({ row, collectionId }: { row: any; collectionId: string }) => {
      if (!row) return false;
      const res = await updateCollectionDataGuarded(collectionId, row.id, row);
      if (!res) return false;
      if (res.id) {
        console.log("update success!!");
        updateCollection(res);
        return true;
      } else {
        logError(res.message || "Error updating data");
        return false;
      }
    },
    []
  );

  const debouncedOnChange = _.debounce(async (newData, operations) => {
    // throttle the update to avoid spamming the server
    if (operations[0].type === "UPDATE" && data) {
      const tempData = [...data];
      setData(newData);
      const row = newData.slice(
        operations[0].fromRowIndex,
        operations[0].toRowIndex
      )[0];
      const res = await updateData({ row, collectionId: collection.id });
      !res && setData(tempData);
    }
  }, 300);

  useEffect(() => {
    if (collection.data) {
      // for each date property in the data, convert the date string to a date object for all the rows
      const dateProperties = collection.propertyOrder.map((property) => {
        if (collection.properties[property]?.type === "date")
          return collection.properties[property].id;
      });
      const data = Object.keys(collection.data).map((key) => {
        const row = collection.data?.[key];
        dateProperties.forEach((property) => {
          if (row[property as string]) {
            const dt = new Date(row[property as string]);
            row[property as string] = dt.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: undefined,
              minute: undefined,
              second: undefined,
            });
          }
        });
        return {
          id: key,
          ...row,
        };
      });

      // filter the data based on the search filter
      let filteredData = matchSorter(Object.values(data), searchFilter, {
        keys: Object.keys(data[0] || {}).map((key) => {
          return (item: any) => {
            if (key === "id") return item.id;
            if (collection.properties[key]?.type === "date") {
              const dt = new Date(item[key]);
              if (typeof item[key] === "string") {
                return dt.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: undefined,
                  minute: undefined,
                  second: undefined,
                });
              }
              return dt?.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: undefined,
                minute: undefined,
                second: undefined,
              });
            }
            if (collection.properties[key]?.type === "multiSelect") {
              return item[key]?.map((option: Option) => option.label);
            }
            return item[key]?.label || item[key];
          };
        }),
      });
      if (
        (collection.collectionType === 0 &&
          collection.projectMetadata.views?.["0x0"]?.filters) ||
        (collection.collectionType === 1 &&
          collection.projectMetadata.views[projectViewId].filters)
      ) {
        filteredData = filteredData.filter((row) => {
          return satisfiesAdvancedConditions(
            collection.data?.[row.id],
            collection.properties,
            collection.projectMetadata.views[
              collection.collectionType === 0 ? "0x0" : projectViewId
            ].advancedFilters || ({} as ConditionGroup)
          );
        });
      }

      if (showMyTasks) {
        filteredData = filteredData.filter((row) => {
          return isMyCard(
            collection.data?.[row.id],
            collection.properties,
            currentUser?.id || ""
          );
        });
      }

      if (paymentFilter) {
        filteredData = filteredData.filter((row) => {
          return paymentStatus(
            paymentFilter,
            row.id,
            collection.projectMetadata.paymentStatus
          );
        });
      }

      if (
        (collection.collectionType === 1 &&
          collection.projectMetadata.views[projectViewId].sort?.property) ||
        (collection.collectionType === 0 &&
          collection.projectMetadata.views?.["0x0"]?.sort?.property)
      ) {
        const property =
          collection.properties[
            collection.projectMetadata.views[
              collection.collectionType === 0 ? "0x0" : projectViewId
            ].sort?.property || ""
          ];
        if (!property) {
          setData(filteredData);
          return;
        }
        const direction =
          collection.projectMetadata.views[
            collection.collectionType === 0 ? "0x0" : projectViewId
          ].sort?.direction || "asc";
        const propertyId = property.id;

        sortFieldValues(
          filteredData,
          collection,
          propertyId,
          direction,
          registry
        )
          .then((sortedData) => {
            setData(sortedData);
          })
          .catch((err) => {
            logError(`Error sorting data: ${err}`);
          });
      } else {
        // sort the data based on the timestamp of their first activity
        filteredData = filteredData.sort((a: any, b: any) => {
          if (!collection.dataActivities || !collection.dataActivityOrder)
            return 0;
          const aTime = new Date(
            collection.dataActivities[a.id][
              collection.dataActivityOrder[a.id][0]
            ].timestamp
          );
          const bTime = new Date(
            collection.dataActivities[b.id][
              collection.dataActivityOrder[b.id][0]
            ].timestamp
          );
          return aTime.getTime() - bTime.getTime();
        });
        setData(filteredData);
      }
    }
  }, [
    collection.collectionType,
    collection.data,
    collection.projectMetadata?.views,
    collection.properties,
    collection.propertyOrder,
    projectViewId,
    searchFilter,
    showMyTasks,
    paymentFilter,
  ]);

  // refresh table if new property is added
  useEffect(() => {
    setRefreshTable(true);
    setTimeout(() => {
      setRefreshTable(false);
    }, 300);
  }, [JSON.stringify(collection.propertyOrder)]);

  const getCellComponent = (type: PropertyType) => {
    switch (type) {
      case "shortText":
        return textColumn;
      case "ethAddress":
        return textColumn;
      case "singleURL":
        return textColumn;
      case "longText":
        return ExpandableCell;
      case "number":
        return floatColumn;
      case "slider":
        return textColumn;
      case "date":
        return textColumn;
        return dateColumn;
      case "singleSelect":
        return SelectComponent;
      case "user":
        return SelectComponent;
      case "reward":
        return RewardComponent;
      case "payWall":
        return PaymentComponent;
      case "user[]":
        return ExpandableCell;
      case "multiSelect":
        return ExpandableCell;
      case "multiURL":
        return MultiURLComponent;
      case "milestone":
        return MilestoneComponent;
      case "discord":
        return DiscordComponent;
      case "github":
        return GithubComponent;
      case "telegram":
        return TelegramComponent;
      default:
        return textColumn;
    }
  };
  const columns: Column<any>[] =
    collection.propertyOrder &&
    collection.propertyOrder
      .filter((prop) => prop !== "__cardStatus__")
      .filter((prop) => !!collection.properties[prop])
      .filter((prop) => collection.properties[prop].type !== "readonly")
      .map((propertyId: string) => {
        const property = collection.properties[propertyId];
        if (
          [
            "singleSelect",
            "multiSelect",
            "longText",
            "user",
            "user[]",
            "discord",
            "github",
            "twitter",
            "telegram",
          ].includes(property.type)
        ) {
          return {
            ...keyColumn(property.id, {
              component: getCellComponent(property.type) as any,
              columnData: property,
            }),
            title: (
              <HeaderComponent
                propertyId={property.id}
                columnName={property.name}
                setIsEditFieldOpen={setIsEditFieldOpen}
                setPropertyId={setPropertyId}
                propertyType={property.type}
              />
            ),
            minWidth: 200,
          };
        } else if (["reward"].includes(property.type)) {
          return {
            component: getCellComponent(property.type) as any,
            columnData: {
              property,
              setIsRewardFieldOpen,
              setPropertyId,
              setDataId,
            },
            title: (
              <HeaderComponent
                propertyId={property.id}
                columnName={property.name}
                setIsEditFieldOpen={setIsEditFieldOpen}
                setPropertyId={setPropertyId}
                propertyType={property.type}
              />
            ),
            minWidth: 200,
          };
        } else if (["milestone"].includes(property.type)) {
          return {
            component: getCellComponent(property.type) as any,
            columnData: {
              property,
              setMultipleMilestoneModalOpen,
              setPropertyId,
              setDataId,
            },
            title: (
              <HeaderComponent
                propertyId={property.id}
                columnName={property.name}
                setIsEditFieldOpen={setIsEditFieldOpen}
                setPropertyId={setPropertyId}
                propertyType={property.type}
              />
            ),
            minWidth: 200,
          };
        } else if (["payWall"].includes(property.type)) {
          return {
            component: getCellComponent(property.type) as any,
            columnData: {
              property,
              setPropertyId,
              setDataId,
            },
            title: (
              <HeaderComponent
                propertyId={property.id}
                columnName={property.name}
                setIsEditFieldOpen={setIsEditFieldOpen}
                setPropertyId={setPropertyId}
                propertyType={property.type}
              />
            ),
            minWidth: 200,
          };
        } else {
          return {
            ...keyColumn(property.id, getCellComponent(property.type) as any),
            disabled:
              collection.collectionType === 0
                ? property.isPartOfFormView
                : false,
            title: (
              <HeaderComponent
                propertyId={property.id}
                columnName={property.name}
                setIsEditFieldOpen={setIsEditFieldOpen}
                setPropertyId={setPropertyId}
                propertyType={property.type}
              />
            ),
            minWidth: 200,
          };
        }
      });

  return (
    <Box>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyId={propertyId}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
        {isRewardFieldOpen && (
          <RewardModal
            value={data?.find((row) => row.id === dataId)?.[propertyId]}
            form={collection}
            propertyId={propertyId}
            handleClose={async (
              reward: Reward,
              dataId: string,
              propertyId: string
            ) => {
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                if (data[row] && (row === 0 || row)) {
                  const tempData = [...data];
                  tempData[row][propertyId] = reward;
                  console.log({ tempdata: tempData[row][propertyId] });
                  setData(tempData);
                  setIsRewardFieldOpen(false);
                  await updateData({
                    row: tempData[row],
                    collectionId: collection.id,
                  });
                  console.log({ updatedData: data[row][propertyId] });
                }
                setIsRewardFieldOpen(false);
              }
            }}
            dataId={dataId}
          />
        )}
        {isURLFieldOpen && (
          <MultiURLModal
            form={collection}
            propertyId={propertyId}
            handleClose={async (
              payment: Option[],
              dataId: string,
              propertyId: string
            ) => {
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyId] = payment;
                  setData(tempData);
                  setIsURLFieldOpen(false);
                  await updateData({
                    row: tempData[row],
                    collectionId: collection.id,
                  });
                }
                setIsURLFieldOpen(false);
              }
            }}
            dataId={dataId}
          />
        )}
        {multipleMilestoneModalOpen && (
          <MultiMilestoneModal
            form={collection}
            propertyId={propertyId}
            dataId={dataId}
            disabled={
              collection.collectionType === 0
                ? collection.properties[propertyId].isPartOfFormView
                : false
            }
            handleClose={async (
              value: Milestone[],
              dataId: string,
              propertyId: string
            ) => {
              if (
                collection.collectionType === 0
                  ? collection.properties[propertyId].isPartOfFormView
                  : false
              ) {
                setMultipleMilestoneModalOpen(false);
                return;
              }
              if (!value) {
                setMultipleMilestoneModalOpen(false);
                return;
              }
              if (data) {
                const row = data.findIndex((row) => row.id === dataId);
                console.log({ value });
                if (row === 0 || row) {
                  const tempData = [...data];
                  tempData[row][propertyId] = value;
                  setData(tempData);
                  setMultipleMilestoneModalOpen(false);
                  console.log({ tempData });
                  await updateData({
                    row: tempData[row],
                    collectionId: collection.id,
                  });
                }
                setMultipleMilestoneModalOpen(false);
              }
            }}
          />
        )}
        {collection.collectionType === 0 && expandedDataSlug && (
          <DataDrawer
            expandedDataSlug={expandedDataSlug}
            setExpandedDataSlug={setExpandedDataSlug}
          />
        )}
        {collection.collectionType === 1 && expandedDataSlug && (
          <CardDrawer
            handleClose={() => setExpandedDataSlug("")}
            defaultValue={data?.find((d) => d.slug === expandedDataSlug)}
          />
        )}
      </AnimatePresence>
      {collection.collectionType === 0 && (
        <Box
          display="flex"
          flexDirection="row"
          gap={"2"}
          justifyContent="flex-end"
          width="full"
          marginBottom="4"
        >
          <Filtering />
          <IncentiveFilter />
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              const d = data?.map((da) => {
                const csvData: {
                  [key: string]: string;
                } = {};
                Object.entries(da)
                  .filter(([key, value]) => key !== "id")
                  .forEach(([key, value]: [string, any]) => {
                    const propertyName = collection.properties[key]?.name;
                    if (key === "slug") {
                      csvData["Data Slug"] = value;
                      return;
                    }

                    if (key === "__lookup__") {
                      value = value.map((v: any) => ({
                        contractAddress: undefined,
                        tokenType: undefined,
                        metadata: undefined,
                        token: v.metadata?.name,
                        balance: v.balance,
                        chainId: v.chainId,
                      }));
                      csvData["Tokens Lookup"] = JSON.stringify(value);
                      return;
                    }
                    if (key === "__lookupCommunities__") {
                      value = value.map((v: any) => ({
                        guildName: v.guildName,
                        guildId: v.guildId,
                        guildRoles: v.roles.map((r: any) => ({
                          name: r.name,
                          id: r.id,
                        })),
                      }));
                      csvData["Community Lookup"] = JSON.stringify(value);
                      return;
                    }
                    if (key === "anonymous") {
                      const value =
                        collection?.profiles?.[collection?.dataOwner[da.slug]];
                      csvData["Responder Profile"] = JSON.stringify({
                        username: value?.username,
                        ethAddress: value?.ethAddress,
                      });
                      return;
                    }
                    if (!collection.properties[key]) return;
                    if (collection.properties[key].type === "discord") {
                      csvData[propertyName] = JSON.stringify({
                        username:
                          value?.discriminator === "0"
                            ? value?.username
                            : `${value?.username}#${value?.discriminator}`,
                        id: value?.id,
                      });
                    } else if (collection.properties[key].type === "github") {
                      csvData[propertyName] = JSON.stringify({
                        username: value?.login,
                        id: value?.id,
                      });
                    } else if (collection.properties[key].type === "telegram") {
                      csvData[propertyName] = JSON.stringify({
                        username: value?.username,
                        id: value?.id,
                      });
                    } else if (collection.properties[key].type === "reward") {
                      csvData[propertyName] = JSON.stringify({
                        chain: value?.chain.label,
                        token: value?.token.label,
                        value: value?.value,
                      });
                    } else if (
                      collection.properties[key].type === "milestone"
                    ) {
                      const milestones = value?.map((v: Milestone) => ({
                        ...v,
                        reward: {
                          chain: v?.reward?.chain.label,
                          token: v?.reward?.token.label,
                          value: v?.reward?.value,
                        },
                      }));
                      csvData[propertyName] = JSON.stringify(milestones);
                    } else if (
                      ["user", "singleSelect"].includes(
                        collection.properties[key].type
                      )
                    ) {
                      csvData[propertyName] = value?.label;
                    } else if (collection.properties[key].type === "multiURL") {
                      csvData[propertyName] = JSON.stringify(value);
                    } else if (
                      ["user[]", "multiSelect"].includes(
                        collection.properties[key].type
                      )
                    ) {
                      csvData[propertyName] = JSON.stringify(
                        value?.map((v: Option) => v.label)
                      );
                    } else if (key === "__payment__") {
                      csvData[propertyName] = JSON.stringify(value);
                    } else if (!value) {
                      csvData[propertyName] = "";
                    } else {
                      csvData[propertyName] = value;
                    }
                  });
                return csvData;
              });
              console.log({ d });
              exportToCsv((d as []).reverse(), collection.name);
            }}
          >
            Export CSV
          </PrimaryButton>
        </Box>
      )}
      <AnimatePresence>
        {collection.name && !refreshTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <DataSheetGrid
              rowHeight={41}
              value={data}
              height={
                screenClass === "xxl"
                  ? 700
                  : screenClass === "xl"
                  ? 520
                  : screenClass === "lg"
                  ? 500
                  : screenClass === "md"
                  ? 500
                  : screenClass === "sm"
                  ? 500
                  : 500
              }
              onChange={debouncedOnChange}
              columns={columns}
              gutterColumn={{
                component: GutterColumnComponent,
                minWidth: 50,
              }}
              lockRows
              disableExpandSelection
            />
          </motion.div>
        )}
        {refreshTable && <Spinner color="accent" />}
      </AnimatePresence>
    </Box>
  );
}
