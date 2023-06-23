import { Flow, workflowContract } from "@avp1598/spect-shared-types";
import { initClient } from "@ts-rest/core";
import { toast } from "react-toastify";
import { z } from "zod";

const client = initClient(workflowContract, {
  baseUrl: process.env.API_HOST || "http://localhost:3000",
  baseHeaders: {},
  credentials: "include",
});

export const getWorkflows = async (circleId: string) => {
  try {
    const res = await client.getAllFlowsByCircle({
      query: {
        circle: z.string().parse(circleId) as any,
      },
    });
    if (res.status === 200) {
      return res.body;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getFlow = async (flowId: string) => {
  try {
    const res = await client.getFlow({
      params: {
        id: z.string().parse(flowId) as any,
      },
    });
    if (res.status === 200) {
      return res.body;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const createFlow = async (createFlowDto: {
  name: string;
  circle: string;
}) => {
  try {
    const res = await client.createFlow({
      body: {
        name: createFlowDto.name as any,
        circle: createFlowDto.circle as any,
      },
    });
    console.log({ res });
    if (res.status === 201) {
      return res.body;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateFlow = async (
  updateFlowDto: Partial<Flow>,
  flowId: string
) => {
  try {
    const res = await client.updateFlow({
      params: {
        id: flowId as any,
      },
      body: updateFlowDto,
    });
    if (res.status === 200) {
      return res.body;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const runFlow = async (flowId: string) => {
  try {
    const res = await client.runFlow({
      params: {
        id: flowId as any,
      },
    });
    console.log({ res });
    if (res.status === 200) {
      return res.body;
    } else if (res.status === 403) {
      toast.error(
        "During beta, only whitelisted users can run AI workflows, please contact us on discord/twitter to get whitelisted."
      );
      return false;
    } else {
      toast.error((res.body as any).message);
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
