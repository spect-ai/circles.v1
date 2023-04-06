/* eslint-disable @typescript-eslint/no-explicit-any */
import { Property, CollectionType, Option } from "@/app/types";

export const addField = async (
  collectionId: string,
  createDto: Partial<Property>,
  pageId?: string
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/addProperty?pageId=${pageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(createDto),
      }
    )
  ).json();
};

export const updateField = async (
  collectionId: string,
  name: string,
  update: Partial<Property>
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/updateProperty`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: collectionId,
          propertyId: name,
          ...update,
        }),
      }
    )
  ).json();
};

export const deleteField = async (collectionId: string, name: string) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/removeProperty`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          propertyId: name,
        }),
      }
    )
  ).json();
};

export const updateFormCollection = async (
  collectionId: string,
  update: Partial<CollectionType>
) => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/${collectionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(update),
    })
  ).json();
};

export const deleteCollection = async (collectionId: string) => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/${collectionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  ).json();
};

export const migrateToCollection = async (
  projectId: string,
  circleId: string
) => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/migrateFromProject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        projectId,
        circleId,
      }),
    })
  ).json();
};

export const migrateAllCOllections = async () => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/migrateAllCollections`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  ).json();
};

export const addCollectionData = async (collectionId: string, data: object) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/addDataGuarded`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data,
        }),
      }
    )
  ).json();
};

export const updateCollectionData = async (
  collectionId: string,
  dataId: string,
  update: any
) => {
  delete update.slug;
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/updateData?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data: update,
        }),
      }
    )
  ).json();
};

export const updateCollectionDataGuarded = async (
  collectionId: string,
  dataId: string,
  update: any
) => {
  delete update.slug;
  delete update.id;
  try {
    return await (
      await fetch(
        `${process.env.API_HOST}/collection/v1/${collectionId}/updateDataGuarded?dataId=${dataId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            data: update,
          }),
        }
      )
    ).json();
  } catch (e) {
    console.error(e);
  }
};

export const deleteCollectionData = async (
  collectionId: string,
  dataIds: string[]
) => {
  if (dataIds.length > 1) {
    return await (
      await fetch(
        `${process.env.API_HOST}/collection/v1/${collectionId}/removeMultipleDataGuarded`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            dataIds,
          }),
        }
      )
    ).json();
  }
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/removeDataGuarded?dataId=${dataIds[0]}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
  ).json();
};

export const getForm = async (formId: string) => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/public/slug/${formId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  ).json();
};

export const addData = async (
  collectionId: string,
  data: any,
  anon: boolean
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/addData`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          anon,
        }),
        credentials: "include",
      }
    )
  ).json();
};

export const startVotingPeriod = async (
  collectionId: string,
  dataId: string,
  startVotingPeriodDto?: {
    endsOn?: string;
    postOnSnapshot?: boolean;
    space?: string;
    proposalId?: string;
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/startVotingPeriod?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(startVotingPeriodDto),
      }
    )
  ).json();
};

export const endVotingPeriod = async (collectionId: string, dataId: string) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/endVotingPeriod?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
  ).json();
};

export const recordSnapshotProposal = async (
  collectionId: string,
  dataId: string,
  snapshotProposalDto: {
    snapshotSpace: string;
    proposalId: string;
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/snapshotProposal?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(snapshotProposalDto),
      }
    )
  ).json();
};

export const voteCollectionData = async (
  collectionId: string,
  dataId: string,
  vote: number
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/voteOnData?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          vote,
        }),
      }
    )
  ).json();
};

export const sendFormComment = async (
  collectionId: string,
  dataId: string,
  content: string,
  ref: {
    [id: string]: {
      id: string;
      refType: "circle" | "collection" | "user";
    };
  },
  isPublic: boolean
) => {
  if (!isPublic) {
    return await (
      await fetch(
        `${process.env.API_HOST}/collection/v1/${collectionId}/addComment?dataId=${dataId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content,
            ref,
          }),
        }
      )
    ).json();
  } else {
    return await (
      await fetch(
        `${process.env.API_HOST}/collection/v1/${collectionId}/addCommentPublic?dataId=${dataId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content,
            ref,
          }),
        }
      )
    ).json();
  }
};

export const importFromCsv = async (payload: {
  data: any;
  collectionId: string;
  collectionProperties: {
    [key: string]: Property;
  };
  groupByColumn: string;
  circleId: string;
}) => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/importfromcsv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
  ).json();
};

export const linkDiscord = async (
  collectionId: string,
  dataId: string,
  payload: {
    threadName: string;
    selectedChannel: Option;
    isPrivate: boolean;
    rolesToAdd: { [key: string]: boolean };
    stakeholdersToAdd: string[];
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/linkDiscord?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    )
  ).json();
};

export const linkDiscordToCollection = async (
  collectionId: string,
  payload: {
    threadName: string;
    selectedChannel: Option;
    isPrivate?: boolean;
    rolesToAdd?: { [key: string]: boolean };
    stakeholdersToAdd?: string[];
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/linkDiscordThreadToCollection`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    )
  ).json();
};

export const postFormMessage = async (
  collectionId: string,
  payload: {
    channelId: string;
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/postFormMessage`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    )
  ).json();
};

export type PostSocialsPayload = {
  discordId?: string;
  discordUsername?: string;
  githubId?: string;
  githubUsername?: string;
  telegramId?: string;
  telegramUsername?: string;
  ethAddress?: string;
};

export const postSocials = async (
  channelId: string,
  payload: PostSocialsPayload
) => {
  console.log({ payload });
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${channelId}/saveAndPostSocials`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    )
  ).json();
};
