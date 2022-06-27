import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Activity,
  CardType,
  Chain,
  CircleType,
  ProjectType,
  Token,
  WorkThreadType,
} from "@/app/types";
import { Box, Stack } from "degen";
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
  assignees: string[];
  setAssignees: React.Dispatch<React.SetStateAction<string[]>>;
  reviewers: string[];
  setReviewers: React.Dispatch<React.SetStateAction<string[]>>;
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
  onArchive: () => Promise<boolean>;
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
  const [assignees, setAssignees] = useState([] as string[]);
  const [reviewers, setReviewers] = useState([] as string[]);
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
      setAssignees(card.assignee);
      setReviewers(card.reviewer);
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
      reviewer: reviewers,
      assignee: assignees,
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
    console.log({ payload });
    fetch(`${process.env.API_HOST}/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          toast.error("Error creating card");
          return;
        }
        const data = await res.json();
        !createAnother && handleClose && handleClose();
        toast(
          <Stack>
            Card created
            <Stack direction="horizontal">
              <PrimaryButton>
                <Link href={`/${cId}/${pId}/${data.card?.slug}`}>
                  View Card
                </Link>
              </PrimaryButton>
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

  const onCardUndo = () => {
    setUpdating(true);
    const payload: { [key: string]: any } = {
      title: card?.title,
      description: card?.description,
      reviewer: card?.reviewer,
      assignee: card?.assignee,
      project: project?.id,
      circle: project?.parents[0].id,
      type: card?.type,
      deadline: card?.deadline,
      labels: card?.labels,
      priority: card?.priority,
      columnId: card?.columnId,
      reward: card?.reward,
    };
    console.log({ payload });
    fetch(`${process.env.API_HOST}/card/${card?.id}`, {
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
          toast("Undo Successful", {
            theme: "dark",
          });
        } else {
          toast.error("Error saving card", { theme: "dark" });
        }
        setUpdating(false);
      })
      .catch((err) => {
        console.log({ err });
        setUpdating(false);
        toast.error("Error undoing card changes", { theme: "dark" });
      });
  };

  const onCardUpdate = () => {
    if (!card) return;
    setUpdating(true);
    console.log({ deadline });
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer: reviewers,
      assignee: assignees,
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
        value: parseFloat(value),
      },
    };
    console.log({ payload });
    fetch(`${process.env.API_HOST}/card/${card?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Error updating card");
        }
        const data = await res.json();
        setCard(data);
        console.log("update complete");
        setUpdating(false);
      })
      .catch((err) => {
        console.log({ err });
        setUpdating(false);
        toast.error("Error updating card", { theme: "dark" });
      });
  };

  const onArchive = async () => {
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/archive`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (res.ok) {
      void router.push(`/${cId}/${pId}`);
      return true;
    }
    toast.error("Error archiving card", { theme: "dark" });
    return false;
  };

  const resetData = () => {
    setTitle("");
    setDescription("");
    setLabels([]);
    setAssignees([]);
    // setReviewer("");
    // setColumnId("");
    setCardType("Task");
    setChain(circle?.defaultPayment?.chain as Chain);
    setToken(circle?.defaultPayment?.token as Token);
    setValue("0");
    setDeadline(null);
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
    assignees,
    setAssignees,
    reviewers,
    setReviewers,
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
    onArchive,
  };
}

export const useLocalCard = () => useContext(LocalCardContext);
