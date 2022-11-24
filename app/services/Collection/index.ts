/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormUserType, Registry, Voting } from "@/app/types";

export const addField = async (
  collectionId: string,
  createDto: {
    name: string;
    type: string;
    default?: string;
    options?: { label: string; value: string }[];
    rewardOptions?: Registry;
    isPartOfFormView: boolean;
    userType?: FormUserType;
    onUpdateNotifyUserTypes?: FormUserType[];
    required?: boolean;
    description?: string;
    milestoneFields?: string[];
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/addProperty`,
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
  update: {
    isPartOfFormView?: boolean;
    name?: string;
    type?: string;
    default?: string;
    options?: { label: string; value: string }[];
    rewardOptions?: Registry;
    userType?: FormUserType;
    onUpdateNotifyUserTypes?: FormUserType[];
    required?: boolean;
    description?: string;
    milestoneFields?: string[];
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/updateProperty?propertyId=${name}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: collectionId,
          ...update,
        }),
      }
    )
  ).json();
};

export const deleteField = async (collectionId: string, name: string) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/removeProperty?propertyId=${name}`,
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

export const updateFormCollection = async (
  collectionId: string,
  update: {
    name?: string;
    description?: string;
    propertyOrder?: string[];
    voting?: Voting;
    formMetadata?: {
      messageOnSubmission?: string;
      multipleResponsesAllowed?: boolean;
      updatingResponseAllowed?: boolean;
      circleRolesToNotifyUponNewResponse?: string[];
      circleRolesToNotifyUponUpdatedResponse?: string[];
      logo?: string;
      cover?: string;
      active?: boolean;
    };
  }
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

export const addData = async (collectionId: string, data: any) => {
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
        }),
        credentials: "include",
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
  isPublic?: boolean
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
