import PrimaryButton from "@/app/common/components/PrimaryButton";
import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import useCardService from "@/app/services/Card/useCardService";
import {
  Activity,
  ApplicationType,
  CardType,
  Chain,
  CircleType,
  ProjectType,
  Token,
  WorkThreadType,
  CardActions,
  KudosForType,
  KudosClaimedType,
} from "@/app/types";
import { Stack } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryObserverResult, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocalProject } from "../../Context/LocalProjectContext";

type Props = {
  handleClose?: () => void;
  createCard?: boolean;
};

type CreateCardContextType = {
  cardId: string;
  setCardId: React.Dispatch<React.SetStateAction<string>>;
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
  projectId: string;
  setProjectId: React.Dispatch<React.SetStateAction<string>>;
  assignedCircle: string;
  setAssignedCircle: React.Dispatch<React.SetStateAction<string>>;
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
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  priority: number;
  setPriority: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (createAnother: boolean) => void;
  subTasks: {
    title: string;
    assignee: string[];
  }[];
  setSubTasks: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        assignee: string[];
      }[]
    >
  >;
  childrenTasks: CardType[];
  setChildrenTasks: React.Dispatch<React.SetStateAction<CardType[]>>;
  parent: CardType;
  setParent: React.Dispatch<React.SetStateAction<CardType>>;
  project: ProjectType | undefined;
  onCardUpdate: () => Promise<void>;
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
  application: {
    [key: string]: ApplicationType;
  };
  setApplication: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ApplicationType;
    }>
  >;
  applicationOrder: string[];
  setApplicationOrder: React.Dispatch<React.SetStateAction<string[]>>;
  card?: CardType;
  setCard: (card: CardType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updating: boolean;
  onArchive: (cardId: string) => Promise<any>;
  cardActions: CardActions | undefined;
  fetchCardActions: () => Promise<QueryObserverResult<CardActions, unknown>>;
  kudosMinted: KudosForType;
  setKudosMinted: React.Dispatch<React.SetStateAction<KudosForType>>;
  eligibleToClaimKudos: KudosClaimedType;
  setEligibleToClaimKudos: React.Dispatch<
    React.SetStateAction<KudosClaimedType>
  >;
  kudosClaimedBy: KudosClaimedType;
  setKudosClaimedBy: React.Dispatch<React.SetStateAction<KudosClaimedType>>;
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
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const { updateProject, fetchQuickActions } = useLocalProject();

  const { data: card, refetch: fetchCard } = useQuery<CardType>(
    ["card", tId],
    () =>
      fetch(
        `${process.env.API_HOST}/card/v1/byProjectSlugAndCardSlug/${pId}/${tId}`,
        { credentials: "include" }
      ).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  const { data: cardActions, refetch: fetchCardActions } =
    useQuery<CardActions>(
      ["cardActions", tId],
      () =>
        fetch(
          `${process.env.API_HOST}/card/myValidActionsInCard/${pId}/${tId}`,
          {
            credentials: "include",
          }
        ).then((res) => res.json()),
      {
        enabled: false,
      }
    );

  const { connectedUser } = useGlobal();

  const setCard = (card: CardType) => {
    queryClient.setQueryData(["card", tId], card);
  };

  const { callCreateCard, updateCard, updating, archiveCard } =
    useCardService();

  const [cardId, setCardId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([] as string[]);
  const [assignees, setAssignees] = useState([] as string[]);
  const [reviewers, setReviewers] = useState([connectedUser] as string[]);
  const [columnId, setColumnId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedCircle, setAssignedCircle] = useState("");
  const [cardType, setCardType] = useState("Task");
  const [chain, setChain] = useState(circle?.defaultPayment?.chain as Chain);
  const [token, setToken] = useState(circle?.defaultPayment?.token as Token);
  const [value, setValue] = useState("0");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState(0);
  const [subTasks, setSubTasks] = useState<
    {
      title: string;
      assignee: string[];
    }[]
  >([] as any);
  const [childrenTasks, setChildrenTasks] = useState<CardType[]>([]);
  const [parent, setParent] = useState({} as CardType);
  const [activity, setActivity] = useState<Activity[]>({} as Activity[]);
  const [workThreads, setWorkThreads] = useState(
    {} as {
      [key: string]: WorkThreadType;
    }
  );
  const [workThreadOrder, setWorkThreadOrder] = useState([] as string[]);
  const [application, setApplication] = useState(
    {} as {
      [key: string]: ApplicationType;
    }
  );
  const [applicationOrder, setApplicationOrder] = useState([] as string[]);
  const [kudosMinted, setKudosMinted] = useState({} as KudosForType);
  const [kudosClaimedBy, setKudosClaimedBy] = useState({} as KudosClaimedType);
  const [eligibleToClaimKudos, setEligibleToClaimKudos] = useState(
    {} as KudosClaimedType
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (tId) {
        await fetchCard();
      }
    };
    void fetchData();
  }, [tId]);

  useEffect(() => {
    if (tId) {
      void fetchCardActions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tId]);

  useEffect(() => {
    if (!createCard && card && card.id) {
      setCardId(card.id);
      setTitle(card.title);
      setDescription(card.description);
      setLabels(card.labels);
      setAssignees(card.assignee);
      setReviewers(card.reviewer);
      setColumnId(card.columnId);
      setProjectId(card.project.id);
      setAssignedCircle(card.assignedCircle);
      setCardType(card.type);
      setChain(card.reward.chain);
      setToken(card.reward.token);
      setValue(card.reward.value?.toString() || "0");
      setDeadline(card.deadline ? new Date(card.deadline) : ({} as Date));
      setStartDate(card.startDate ? new Date(card.startDate) : ({} as Date));
      setPriority(card.priority || 0);
      setActivity(card.activity);
      setWorkThreads(card.workThreads);
      setWorkThreadOrder(card.workThreadOrder);
      setApplication(card.application);
      setApplicationOrder(card.applicationOrder);
      setChildrenTasks(card.children);
      setParent(card.parent);
      setKudosMinted(card.kudosMinted);
      setKudosClaimedBy(card.kudosClaimedBy);
      setEligibleToClaimKudos(card.eligibleToClaimKudos);
      setLoading(false);
    } else if (card?.unauthorized) setLoading(false);
  }, [card, createCard]);

  const onSubmit = async (createAnother: boolean) => {
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer: reviewers,
      assignee: assignees,
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      deadline,
      startDate,
      labels,
      priority,
      columnId,
      reward: {
        chain,
        token,
        value: Number(value),
      },
      parent: card?.id,
      childCards: subTasks,
    };
    if (assignedCircle) payload.assignedCircle = assignedCircle;
    const data = await callCreateCard(payload);
    toast(
      <Stack>
        Card created
        <Stack direction="horizontal">
          <PrimaryButton>
            <Link href={`/${cId}/${pId}/${data.card?.slug}`}>View Card</Link>
          </PrimaryButton>
        </Stack>
      </Stack>,
      {
        theme: "dark",
      }
    );
    updateProject(data.project);
    void fetchQuickActions();
    // queryClient.setQueryData(["project", pId], data.project);
    resetData();
    !createAnother && handleClose && handleClose();
  };

  const onCardUpdate = async () => {
    if (!card?.id) return;
    const payload: { [key: string]: any } = {
      title,
      description,
      reviewer: reviewers,
      assignee: assignees,
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      deadline: deadline?.getDate ? deadline : null,
      startDate: startDate?.getDate ? startDate : null,
      labels,
      priority,
      columnId,
      reward: {
        chain,
        token,
        value: parseFloat(value),
      },
      assignedCircle,
    };
    const res = await updateCard(payload, card.id);
    if (res) {
      setCard(res);
    }
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
    setStartDate(null);
    setPriority(0);
    setSubTasks([]);
  };

  return {
    cardId,
    setCardId,
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
    projectId,
    setProjectId,
    assignedCircle,
    setAssignedCircle,
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
    startDate,
    setStartDate,
    priority,
    setPriority,
    onSubmit,
    loading,
    setLoading,
    updating,
    subTasks,
    setSubTasks,
    childrenTasks,
    setChildrenTasks,
    parent,
    setParent,
    project,
    onCardUpdate,
    activity,
    setActivity,
    workThreads,
    setWorkThreads,
    workThreadOrder,
    setWorkThreadOrder,
    application,
    setApplication,
    applicationOrder,
    setApplicationOrder,
    card,
    setCard,
    onArchive: archiveCard,
    cardActions,
    fetchCardActions,
    kudosMinted,
    setKudosMinted,
    kudosClaimedBy,
    setKudosClaimedBy,
    eligibleToClaimKudos,
    setEligibleToClaimKudos,
  };
}

export const useLocalCard = () => useContext(LocalCardContext);
