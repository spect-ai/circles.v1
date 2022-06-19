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
  onSubmit: () => void;
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
  const [value, setValue] = useState("");
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
    if (!createCard && card && !isLoading) {
      console.log({ card });
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

  const onSubmit = () => {
    // console.log({
    //   title,
    //   description,
    //   assignee,
    //   cardType,
    //   labels,
    //   columnId,
    //   token,
    //   chain,
    //   value,
    //   priority,
    //   deadline,
    // });
    // return;
    fetch("http://localhost:3000/card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        console.log({ data });
        handleClose && handleClose();
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
      })
      .catch((err) => {
        console.log({ err });
      });
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
  };
}

export const useLocalCard = () => useContext(LocalCardContext);
