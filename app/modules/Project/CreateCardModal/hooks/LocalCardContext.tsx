import { CardType, Chain, CircleType, ProjectType, Token } from "@/app/types";
import { Button, Stack } from "degen";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useLocalProject } from "../../Context/LocalProjectContext";

type Props = {
  handleClose?: () => void;
  createCard?: boolean;
};

type CreateCardContextType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  assignee: string;
  setAssignee: React.Dispatch<React.SetStateAction<string>>;
  reviewer: string[];
  setReviewer: React.Dispatch<React.SetStateAction<string[]>>;
  columnId: string;
  setColumnId: React.Dispatch<React.SetStateAction<string>>;
  cardType: string;
  setCardType: React.Dispatch<React.SetStateAction<string>>;
  chain: Chain;
  setChain: React.Dispatch<React.SetStateAction<Chain>>;
  token: Token;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  deadline: Date;
  setDeadline: React.Dispatch<React.SetStateAction<Date>>;
  priority: number;
  setPriority: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (createAnother: boolean) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  subTasks: {
    title: string;
    assignee: string;
  }[];
  setSubTasks: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        assignee: string;
      }[]
    >
  >;
  submission: string[];
  setSubmission: React.Dispatch<React.SetStateAction<string[]>>;
  project: ProjectType;
  onCardUpdate: () => void;
};

export const LocalCardContext = createContext<CreateCardContextType>(
  {} as CreateCardContextType
);

export function useProviderLocalCard({
  handleClose,
  createCard = false,
}: Props) {
  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: project, isLoading }: any = useQuery<ProjectType>(
    ["project", pId],
    {
      enabled: false,
    }
  );

  const { data: card } = useQuery<CardType>(["card", tId], {
    enabled: false,
  });

  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([] as string[]);
  const [assignee, setAssignee] = useState("");
  const [reviewer, setReviewer] = useState([] as string[]);
  const [columnId, setColumnId] = useState("");
  const [cardType, setCardType] = useState("Task");
  const [chain, setChain] = useState(circle?.defaultPayment?.chain as Chain);
  const [token, setToken] = useState(circle?.defaultPayment?.token as Token);
  const [value, setValue] = useState("0");
  const [deadline, setDeadline] = useState<Date>({} as Date);
  const [priority, setPriority] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subTasks, setSubTasks] = useState<
    {
      title: string;
      assignee: string;
    }[]
  >([] as any);
  const [submission, setSubmission] = useState([] as string[]);

  useEffect(() => {
    if (!createCard && card && card.id && !isLoading) {
      setLoading(true);
      setTitle(card.title);
      setDescription(card.description);
      setLabels(card.labels);
      setAssignee(card.assignee[0]);
      setReviewer(card.reviewer);
      setColumnId(card.columnId);
      setCardType(card.type);
      setChain(card.reward.chain);
      setToken(card.reward.token);
      setValue(card.reward.value?.toString() || "");
      setDeadline(new Date(card.deadline));
      setPriority(card.priority || 0);
      setSubTasks(card.subTasks);
      setSubmission(card.submission);
      setLoading(false);
    }
  }, [card, createCard, isLoading]);

  const onSubmit = (createAnother: boolean) => {
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer,
      assignee: [assignee],
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      deadline,
      labels,
      priority,
      columnId,
      reward: {
        chain,
        token,
        value: Number(value),
      },
    };
    Object.keys(payload).forEach((key) => {
      if (
        typeof payload[key] === "object" &&
        Object.keys(payload[key]).length === 0
      ) {
        delete payload[key];
      } else if (
        Array.isArray(payload[key]) &&
        (payload[key].length === 0 || payload[key][0]?.length === 0)
      ) {
        delete payload[key];
      }
      if (payload[key] === null) {
        delete payload[key];
      }
    });
    console.log({ payload });
    fetch("http://localhost:3000/card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        console.log({ data });
        !createAnother && handleClose && handleClose();
        toast(
          <Stack>
            Card created
            <Stack direction="horizontal">
              <Button size="small" variant="secondary">
                View Card
              </Button>
            </Stack>
          </Stack>,
          {
            theme: "dark",
          }
        );
        queryClient.setQueryData(["project", pId], data);
        resetData();
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onCardUpdate = () => {
    setLoading(true);
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer,
      assignee: [assignee],
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      deadline,
      labels,
      priority,
      columnId,
      reward: {
        chain,
        token,
        value: Number(value),
      },
    };
    // temp fix
    Object.keys(payload).forEach((key) => {
      if (
        typeof payload[key] === "object" &&
        Object.keys(payload[key]).length === 0
      ) {
        delete payload[key];
      } else if (
        Array.isArray(payload[key]) &&
        (payload[key].length === 0 ||
          payload[key][0]?.length === 0 ||
          payload[key][0] === undefined)
      ) {
        delete payload[key];
      }
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });
    console.log({ payload });
    fetch(`http://localhost:3000/card/${card?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        console.log({ data });

        toast(
          <Stack>
            Card saved
            <Stack direction="horizontal">
              <Button size="small" variant="secondary">
                Undo
              </Button>
            </Stack>
          </Stack>,
          {
            theme: "dark",
          }
        );
        queryClient.setQueryData(["card", tId], data);
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setLoading(false);
        toast.error("Error updating card", { theme: "dark" });
      });
  };

  const resetData = () => {
    setTitle("");
    setDescription("");
    setLabels([]);
    setAssignee("");
    setReviewer([]);
    setColumnId("");
    setCardType("Task");
    setChain(circle?.defaultPayment?.chain as Chain);
    setToken(circle?.defaultPayment?.token as Token);
    setValue("");
    setDeadline({} as Date);
    setPriority(0);
    setSubTasks([]);
    setSubmission([]);
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    labels,
    setLabels,
    assignee,
    setAssignee,
    reviewer,
    setReviewer,
    columnId,
    setColumnId,
    cardType,
    setCardType,
    chain,
    setChain,
    token,
    setToken,
    value,
    setValue,
    deadline,
    setDeadline,
    priority,
    setPriority,
    onSubmit,
    loading,
    setLoading,
    subTasks,
    setSubTasks,
    submission,
    setSubmission,
    project,
    onCardUpdate,
  };
}

export const useLocalCard = () => useContext(LocalCardContext);
