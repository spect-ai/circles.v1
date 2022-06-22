import {
  Activity,
  CardType,
  Chain,
  CircleType,
  ProjectType,
  Token,
  WorkThreadType,
} from "@/app/types";
import { Button, Stack } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

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
  reviewer: string;
  setReviewer: React.Dispatch<React.SetStateAction<string>>;
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
  deadline: Date | null;
  setDeadline: React.Dispatch<React.SetStateAction<Date | null>>;
  priority: number;
  setPriority: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (createAnother: boolean) => void;
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
  project: ProjectType;
  onCardUpdate: () => void;
  activity: Activity[];
  setActivity: React.Dispatch<React.SetStateAction<Activity[]>>;
  workThreads: {
    [key: string]: WorkThreadType;
  };
  setWorkThreads: React.Dispatch<
    React.SetStateAction<{
      [key: string]: WorkThreadType;
    }>
  >;
  workThreadOrder: string[];
  setWorkThreadOrder: React.Dispatch<React.SetStateAction<string[]>>;
  card?: CardType;
  setCard: (card: CardType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updating: boolean;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
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

  const setCard = (card: CardType) => {
    queryClient.setQueryData(["card", tId], card);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([] as string[]);
  const [assignee, setAssignee] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [columnId, setColumnId] = useState("");
  const [cardType, setCardType] = useState("Task");
  const [chain, setChain] = useState(circle?.defaultPayment?.chain as Chain);
  const [token, setToken] = useState(circle?.defaultPayment?.token as Token);
  const [value, setValue] = useState("0");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [priority, setPriority] = useState(0);
  const [subTasks, setSubTasks] = useState<
    {
      title: string;
      assignee: string;
    }[]
  >([] as any);
  const [activity, setActivity] = useState<Activity[]>({} as Activity[]);
  const [workThreads, setWorkThreads] = useState(
    {} as {
      [key: string]: WorkThreadType;
    }
  );
  const [workThreadOrder, setWorkThreadOrder] = useState([] as string[]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!createCard && card && card.id && !isLoading) {
      setLoading(true);
      setTitle(card.title);
      setDescription(card.description);
      setLabels(card.labels);
      setAssignee(card.assignee[0]);
      setReviewer(card.reviewer[0]);
      setColumnId(card.columnId);
      setCardType(card.type);
      setChain(card.reward.chain);
      setToken(card.reward.token);
      setValue(card.reward.value?.toString() || "0");
      setDeadline(card.deadline ? new Date(card.deadline) : ({} as Date));
      setPriority(card.priority || 0);
      setActivity(card.activity);
      setWorkThreads(card.workThreads);
      setWorkThreadOrder(card.workThreadOrder);
      setLoading(false);
    }
  }, [card, createCard, isLoading]);

  const onSubmit = (createAnother: boolean) => {
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer: [reviewer],
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
    // Object.keys(payload).forEach((key) => {
    //   if (
    //     typeof payload[key] === "object" &&
    //     Object.keys(payload[key]).length === 0
    //   ) {
    //     delete payload[key];
    //   } else if (
    //     Array.isArray(payload[key]) &&
    //     (payload[key].length === 0 || payload[key][0]?.length === 0)
    //   ) {
    //     delete payload[key];
    //   }
    //   if (payload[key] === null) {
    //     delete payload[key];
    //   }
    // });
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
        !createAnother && handleClose && handleClose();
        toast(
          <Stack>
            Card created
            <Stack direction="horizontal">
              <Button size="small" variant="secondary">
                <Link href={`/${cId}/${pId}/${data.card?.slug}`}>
                  View Card
                </Link>
              </Button>
            </Stack>
          </Stack>,
          {
            theme: "dark",
          }
        );
        queryClient.setQueryData(["project", pId], data.project);
        resetData();
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onCardUpdate = () => {
    setUpdating(true);
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer: [reviewer],
      assignee: [assignee],
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      deadline: deadline?.getDate ? deadline : null,
      labels,
      priority,
      columnId,
      reward: {
        chain,
        token,
        value: Number(value),
      },
    };
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

        if (data.id) {
          queryClient.setQueryData(["card", tId], data);
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
        } else {
          toast.error("Error saving card", { theme: "dark" });
        }

        setUpdating(false);
      })
      .catch((err) => {
        console.log({ err });
        setUpdating(false);
        toast.error("Error updating card", { theme: "dark" });
      });
  };

  const resetData = () => {
    setTitle("");
    setDescription("");
    setLabels([]);
    setAssignee("");
    setReviewer("");
    // setColumnId("");
    setCardType("Task");
    setChain(circle?.defaultPayment?.chain as Chain);
    setToken(circle?.defaultPayment?.token as Token);
    setValue("0");
    setDeadline({} as Date);
    setPriority(0);
    setSubTasks([]);
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
    updating,
    setUpdating,
    subTasks,
    setSubTasks,
    project,
    onCardUpdate,
    activity,
    setActivity,
    workThreads,
    setWorkThreads,
    workThreadOrder,
    setWorkThreadOrder,
    card,
    setCard,
  };
}

export const useLocalCard = () => useContext(LocalCardContext);
