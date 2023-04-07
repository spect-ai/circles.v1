import { recordSnapshotProposal } from "@/app/services/Collection";
import { Box, Input, Stack, Text, useTheme } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";

import PrimaryButton from "@/app/common/components/PrimaryButton";
import Modal from "@/app/common/components/Modal";
import { DateInput } from "@/app/modules/Profile/ProfilePage/AddExperienceModal";
import { dateIsInvalid, smartTrim } from "@/app/common/utils/utils";
import useSnapshot from "@/app/services/Snapshot/useSnapshot";
import { CollectionType, Milestone, Option, Reward } from "@/app/types";
import { useLocation } from "react-use";
import { useRouter } from "next/router";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import Accordian from "@/app/common/components/Accordian";
import uuid from "react-uuid";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleChoiceVotingOnSingleResponse from "../VotingModule/SingleChoiceVotingOnSingleResponse";

type Paywall = { token: Option; chain: Option; value: number };

export const getBodyOfProposal = (
  collection: CollectionType,
  data: Record<string, unknown>,
  hostname: string,
  cId: string,
  dataId: string
) => {
  const res = collection.propertyOrder.map((propertyName: string) => {
    const property = collection.properties[propertyName];
    let response = "";
    if (property.name) {
      response = response.concat(`## ${property.name} \n`);
    }
    if (property.description) {
      response = response.concat(` #### ${property.description} \n`);
    }
    if (data[property.name] === undefined || data[property.name] === null) {
      return response;
    }
    if (
      ["shortText", "ethAddress", "email", "number"].includes(property.type)
    ) {
      response = response.concat(` ${data[property.name]} \n`);
    }
    if (property.type === "longText") {
      response = response.concat(` ${data[property.name]} \n`);
    }
    if (property.type === "date") {
      response = response.concat(
        ` ${(data[property.name] as number)?.toString()} \n`
      );
    }
    if (property.type === "user") {
      response = response.concat(
        ` ${(data[property.name] as Option)?.label} \n`
      );
    }
    if (property.type === "singleURL") {
      response = response.concat(` <${data[property.name]}> \n`);
    }
    if (property.type === "multiURL") {
      (data[property.name] as Option[])?.forEach((url: Option) => {
        response = response.concat(` - ${url.label} : <${url.value}> \n`);
      });
    }
    if (property.type === "singleSelect") {
      response = response.concat(
        ` ${(data[property.name] as Option)?.label} \n`
      );
    }
    if (property.type === "multiSelect") {
      (data[property.name] as Option[])?.forEach((option: Option) => {
        response = response.concat(` - ${option.label} \n`);
      });
    }
    if (property.type === "user[]") {
      (data[property.name] as Option[])?.forEach((user: Option) => {
        response = response.concat(
          ` - ${user.label} : <https://${hostname}/profile/${user.label}>\n`
        );
      });
    }
    if (property.type === "payWall") {
      (data[property.name] as Paywall[])?.map((payment: Paywall) => {
        response = response.concat(
          `- Paid ${payment.value} ${payment.token.label} on ${payment.chain.label}`
        );
        return response;
      });
      if ((data[propertyName] as Paywall[])?.length === 0) {
        response = response.concat(" Unpaid \n");
      }
    }
    if (property.type === "reward") {
      response = response.concat(
        `Reward: ${(data[property.name] as Reward)?.value} ${
          (data[property.name] as Reward)?.token.label
        } on ${(data[property.name] as Reward)?.chain.label}`
      );
    }

    if (property.type === "milestone") {
      (data[property.name] as Milestone[])?.map(
        (milestone: Milestone, index: number) => {
          response = response.concat(
            `## Milestone ${index + 1}: ${milestone.title} \n`
          );
          response = response.concat(
            `Reward: ${milestone.reward.value} ${milestone.reward.token.label} on ${milestone.reward.chain.label} \n`
          );
          response = response.concat(
            `Description: ${milestone.description} \n`
          );
          response = response.concat(
            `Due Date: ${milestone.dueDate?.toString()} \n`
          );
          response = response.concat(`Paid: ${milestone.paid} \n`);
          return response;
        }
      );
    }
    return response;
  });

  let body = res.join("\n");
  body = smartTrim(body, 14300);
  body = body.concat(
    `\n\nThis proposal was created via Spect. View the proposal details at <https://${hostname}/${cId}/r/${collection.slug}?cardSlug=${dataId}> \n`
  );
  return body;
};

export const SnapshotModal = ({
  dataId,
  data,
  setSnapshotModal,
}: {
  dataId: string;
  data: Record<string, unknown>;
  setSnapshotModal: (val: boolean) => void;
}) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { circle } = useCircle();
  const { hostname } = useLocation();
  const { mode } = useTheme();
  const { createProposal } = useSnapshot();
  const router = useRouter();
  const { circle: cId } = router.query;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [votingOptions, setVotingOptions] = useState([
    {
      label: "For",
      value: `option-${uuid()}`,
    },
    {
      label: "Against",
      value: `option-${uuid()}`,
    },
    {
      label: "Abstain",
      value: `option-${uuid()}`,
    },
  ]);
  return (
    <Modal
      handleClose={() => setSnapshotModal(false)}
      title="Create Snapshot Proposal"
    >
      <Box padding="8">
        <Stack space="3">
          <Text variant="label">Title of the proposal</Text>
          <Input
            label
            hideLabel
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Accordian name="Advanced Settings" defaultOpen={false}>
            <Stack space="3">
              <Stack>
                <Text variant="label">Voting Period</Text>
                <Stack direction="horizontal">
                  <DateInput
                    placeholder="Enter Start Date"
                    value={startDate}
                    type="datetime-local"
                    mode={mode}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                  <DateInput
                    placeholder="Enter End Date"
                    value={endDate}
                    type="datetime-local"
                    mode={mode}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </Stack>
                {dateIsInvalid(startDate, endDate) && (
                  <Text color="red">Date is invalid</Text>
                )}
              </Stack>

              <SingleChoiceVotingOnSingleResponse
                options={votingOptions}
                setOptions={setVotingOptions}
                disabled={false}
              />
            </Stack>
          </Accordian>

          <PrimaryButton
            onClick={async () => {
              setSnapshotModal(false);
              const start = Math.floor(new Date(startDate).getTime() / 1000);
              const end = Math.floor(new Date(endDate).getTime() / 1000);
              const bodyOfProposal = getBodyOfProposal(
                collection,
                data,
                hostname as string,
                cId as string,
                dataId
              );
              const snapRes = (await createProposal({
                title,
                body: bodyOfProposal,
                start,
                end,
                choices: votingOptions.map((option) => option.label),
              })) as {
                id: string;
                error: string;
                error_description: string;
              };

              if (!snapRes?.id) {
                toast.error(
                  `Couldn't create Proposal : ${snapRes.error} - ${snapRes.error_description}`
                );
              } else {
                toast.success("Proposal created");
                const res = await recordSnapshotProposal(
                  collection.id,
                  dataId,
                  {
                    snapshotSpace: circle?.snapshot?.id || "",
                    proposalId: snapRes.id,
                  }
                );
                if (!res.id) {
                  toast.error(
                    "Something went wrong while recording snapshot proposal"
                  );
                } else updateCollection(res);
              }
            }}
            disabled={!title || dateIsInvalid(startDate, endDate)}
          >
            Create Proposal
          </PrimaryButton>
        </Stack>
      </Box>
    </Modal>
  );
};
