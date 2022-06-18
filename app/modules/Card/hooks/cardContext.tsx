import { Chain, CircleType, Token } from "@/app/types";
import { Button, Stack } from "degen";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
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
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  onSave: (tid: string) => void;
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
  submission: string;
  setSubmission: React.Dispatch<React.SetStateAction<string>>;
};

export const CreateCardContext = createContext<CreateCardContextType>(
  {} as CreateCardContextType
);

export function useProviderCreateCard({ handleClose }: Props) {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
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
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [subTasks, setSubTasks] = useState<
    {
      title: string;
      assignee: string;
    }[]
  >([] as any);
  const [submission, setSubmission] = useState("");

  // useEffect(() => {
  //   if (taskId) {
  //     console.log({ taskId });
  //     setLoading(true);
  //     runMoralisFunction("getTask", {
  //       taskId,
  //     })
  //       .then((taskRes: Task) => {
  //         console.log({ taskRes });
  //         setTitle(taskRes.title);
  //         setDescription(taskRes.description);
  //         setLabels(taskRes.tags);
  //         setAssignees(taskRes.assignee as any);
  //         setReviewers(taskRes.reviewer);
  //         setColumnId(taskRes.columnId);
  //         setCardType(taskRes.type);
  //         setChain(taskRes.chain);
  //         setToken(taskRes.token);
  //         setValue(taskRes.value?.toString());
  //         setDate(taskRes.deadline?.toString() || "");
  //         setSubTasks(taskRes.subTasks);
  //         setLoading(false);
  //       })
  //       .catch((err: any) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   }
  // }, [taskId]);

  // setLoading(true);
  // console.log({
  //   subTasks,
  // });
  // runMoralisFunction("addTask", {
  //   boardId: bid as string,
  //   title,
  //   description,
  //   type: cardType,
  //   tags: labels,
  //   deadline: date,
  //   chain,
  //   token,
  //   value,
  //   assignee: [assignees],
  //   reviewer: reviewers,
  //   columnId,
  //   subTasks,
  // })
  //   .then((res: any) => {
  //     setLoading(false);
  //     console.log({ res });
  //     router.push(`/tribe/${id}/space/${bid}`);
  //     setTimeout(() => {
  //       toast("Task created", {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "dark",
  //       });
  //     }, 500);
  //   })
  //   .catch((err: any) => {
  //     console.log({ err });
  //     setLoading(false);
  //   });

  const onSave = async (tid: string) => {
    // setLoading(true);
    // console.log({
    //   title,
    //   description,
    //   labels,
    //   assignees,
    //   reviewers,
    //   columnId,
    //   cardType,
    //   chain,
    //   token,
    //   value,
    //   date,
    // });
    // runMoralisFunction("updateCardSimple", {
    //   boardId: bid as string,
    //   taskId: tid,
    //   title,
    //   description,
    //   type: cardType,
    //   tags: labels,
    //   deadline: date,
    //   chain,
    //   token,
    //   value,
    //   assignee: [assignees],
    //   reviewer: reviewers,
    //   columnId,
    // })
    //   .then((res: any) => {
    //     setLoading(false);
    //     console.log({ res });
    //   })
    //   .catch((err: any) => {
    //     console.log({ err });
    //     setLoading(false);
    //   });
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
    onSave,
    loading,
    setLoading,
    subTasks,
    setSubTasks,
    submission,
    setSubmission,
  };
}

export const useCreateCard = () => useContext(CreateCardContext);
