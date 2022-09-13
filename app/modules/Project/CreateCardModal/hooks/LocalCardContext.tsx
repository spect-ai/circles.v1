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
  KudosType,
  KudosClaimedType,
  Properties,
  Condition,
  PropertyType,
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
  columnId: string;
  setColumnId: React.Dispatch<React.SetStateAction<string>>;
  projectId: string;
  setProjectId: React.Dispatch<React.SetStateAction<string>>;
  cardType: string;
  setCardType: React.Dispatch<React.SetStateAction<string>>;
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
  properties: { [id: string]: any };
  setProperties: React.Dispatch<React.SetStateAction<{ [id: string]: any }>>;
  propertyOrder: string[];
  setPropertyOrder: React.Dispatch<React.SetStateAction<string[]>>;
  updatePropertyState: (propertyId: string, value: any) => void;
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
        console.log({ res });
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
  const [columnId, setColumnId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [cardType, setCardType] = useState("Task");
  const [chain, setChain] = useState(circle?.defaultPayment?.chain as Chain);
  const [token, setToken] = useState(circle?.defaultPayment?.token as Token);
  const [value, setValue] = useState("0");
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
  const [propertyOrder, setPropertyOrder] = useState([] as string[]);
  const [properties, setProperties] = useState({} as { [id: string]: any });

  const [loading, setLoading] = useState(false);

  const checkGreaterThanOrEqualTo = (
    propertyVal: any,
    conditionVal: any,
    propertyType: PropertyType
  ) => {
    console.log(propertyVal, conditionVal, propertyType);
    if (propertyType === "date") {
      if (conditionVal)
        return propertyVal.getTime() > new Date(conditionVal).getTime();
    }
    return true;
  };

  const checkLessThanOrEqualTo = (
    propertyVal: any,
    conditionVal: any,
    propertyType: PropertyType
  ) => {
    console.log(propertyVal, conditionVal, propertyType);

    if (propertyType === "date") {
      if (conditionVal)
        return propertyVal.getTime() < new Date(conditionVal).getTime();
    }
    return true;
  };
  const checkCondition = (
    condition: Condition,
    propertyVal: any,
    conditionVal: any,
    propertyType: PropertyType
  ) => {
    if (condition === "greaterThanOrEqualTo")
      return checkGreaterThanOrEqualTo(propertyVal, conditionVal, propertyType);
    else if (condition === "lessThanOrEqualTo")
      return checkLessThanOrEqualTo(propertyVal, conditionVal, propertyType);
  };

  const satisfiesConditions = (propertyId: string, value: any) => {
    const conditions = project?.properties[propertyId]?.conditions;
    console.log(conditions);
    console.log(project?.properties);
    const type = project?.properties[propertyId]?.type;
    if (conditions) {
      for (const condition of conditions) {
        const conditionVal = properties && properties[propertyId];
        console.log(conditionVal);
        const satisfies = checkCondition(
          condition.condition,
          value,
          conditionVal,
          type as PropertyType
        );
        if (!satisfies) {
          if (condition.feedback) toast.error(condition.feedback);
          return false;
        }
      }
    }
    return true;
  };

  const updatePropertyState = (propertyId: string, value: any) => {
    if (!satisfiesConditions(propertyId, value)) return;
    setProperties({
      ...properties,
      [propertyId]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (tId) {
        console.log("Fetching Card");
        await fetchCard();
      }
    };
    void fetchData();
  }, [tId]);

  useEffect(() => {
    if (tId) {
      console.log("Fetching Card Actions");
      void fetchCardActions();
    }
  }, [tId]);

  useEffect(() => {
    if (!createCard && card && card.id) {
      setCardId(card.id);
      setTitle(card.title);
      setDescription(card.description);
      setLabels(card.labels);
      setColumnId(card.columnId);
      setProjectId(card.project.id);
      setCardType(card.type);
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
      setPropertyOrder(
        project?.cardTemplates[cardType].propertyOrder || ([] as string[])
      );
      setProperties(card?.properties || resetProperties());
      setLoading(false);
    } else if (card?.unauthorized) setLoading(false);
  }, [card, createCard]);

  useEffect(() => {
    setPropertyOrder(
      project?.cardTemplates[cardType].propertyOrder || ([] as string[])
    );
    setProperties(card?.properties || resetProperties());
  }, [cardType]);

  const onSubmit = async (createAnother: boolean) => {
    const payload: { [key: string]: any } = {
      title,
      description,
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      labels,
      columnId,
      parent: card?.id,
      childCards: subTasks,
      properties,
      propertyOrder,
    };
    const data = await callCreateCard(payload);
    toast(
      <Stack>
        Card created
        <Stack direction="horizontal">
          <PrimaryButton>
            <Link href={`/${cId}/${pId}/${data.card?._doc?.slug}`}>
              View Card
            </Link>
          </PrimaryButton>
        </Stack>
      </Stack>,
      {
        theme: "dark",
      }
    );
    console.log(data.project);
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
      project: project?.id,
      circle: project?.parents[0].id,
      type: cardType,
      labels,
      priority,
      columnId,
      reward: {
        chain,
        token,
        value: parseFloat(value),
      },
      properties,
      propertyOrder,
    };
    const res = await updateCard(payload, card.id);
    if (res) {
      setCard(res);
    }
  };

  const resetProperties = (): any => {
    const properties = {} as { [id: string]: any };
    for (const [propertyId, val] of Object.entries(project?.properties || {})) {
      properties[propertyId] = val.default;
    }
    setProperties(properties);
  };

  const resetData = () => {
    setTitle("");
    setDescription("");
    setLabels([]);
    setCardType("Task");
    setChain(circle?.defaultPayment?.chain as Chain);
    setToken(circle?.defaultPayment?.token as Token);
    setValue("0");
    setPriority(0);
    setSubTasks([]);
    setPropertyOrder(project?.cardTemplates[cardType].propertyOrder || []);
    const props = resetProperties();
    setProperties(props);
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
    columnId,
    setColumnId,
    projectId,
    setProjectId,
    cardType,
    setCardType,
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
    properties,
    setProperties,
    propertyOrder,
    setPropertyOrder,
    updatePropertyState,
  };
}

export const useLocalCard = () => useContext(LocalCardContext);
