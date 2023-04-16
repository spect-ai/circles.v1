import { logError } from "@/app/common/utils/utils";
import { Option } from "@/app/types";
import { toast } from "react-toastify";

type AddPaymentsRequestDto = {
  collectionId: string;
  dataSlugs: string[];
};

export const addPendingPayment = async (
  circleId: string,
  body: AddPaymentsRequestDto
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/addPendingPayment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    )
  ).json();
};

type UpdatePaymentsRequestDto = {
  type: "Manually Added" | "Added From Card";
  chain: {
    label: string;
    value: string;
  };
  token: {
    label: string;
    value: string;
  };
  value: number;
  paidTo: {
    propertyType: string;
    value: any;
  }[];
  labels?: Option[];
  transactionHash?: string;
  collection?: {
    label: string;
    value: string;
  };
  data?: {
    label: string;
    value: string;
  };
};

export const updatePayment = async (
  circleId: string,
  paymentId: string,
  body: UpdatePaymentsRequestDto
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/updatePayment?paymentId=${paymentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    )
  ).json();
};

type UpdateMultiplePaymentsRequestDto = {
  type?: "Manually Added" | "Added From Card";
  chain?: {
    label: string;
    value: string;
  };
  token?: {
    label: string;
    value: string;
  };
  value?: number;
  paidTo?: {
    propertyType: string;
    value: any;
  }[];
  labels?: Option[];
  transactionHash?: string;
  safeTransactionHash?: string;
  status?: "Pending" | "Pending Signature" | "Completed" | "Cancelled";
  paymentIds: string[];
  paidOn?: Date;
};

export const updateMultiplePayments = async (
  circleId: string,
  body: UpdateMultiplePaymentsRequestDto
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/updateMultiplePayments`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    )
  ).json();
};

type AddManualPaymentsRequestDto = {
  title: string;

  description?: string;

  type: "Manually Added" | "Added From Card";

  collectionId?: string;

  chain: {
    label: string;
    value: string;
  };

  token: {
    label: string;
    value: string;
  };

  value: number;

  paidTo: {
    propertyType: string;
    value: any;
  }[];
  labels?: Option[];
};

export const addManualPayment = async (
  circleId: string,
  body: AddManualPaymentsRequestDto
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/addManualPayment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    )
  ).json();
};

type PaymentIdsDto = {
  paymentIds: string[];
  transactionHash?: { [key: string]: string };
};

export const makePayments = async (circleId: string, body: PaymentIdsDto) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/makePayments`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  console.log({ res });
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  }
  logError("Error updating payment status");
  return undefined;
};

export const cancelPayments = async (circleId: string, body: PaymentIdsDto) => {
  console.log({ body });
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/cancelPayments`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  console.log({ res });
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  }
  logError("Error updating payment status");
  return undefined;
};
