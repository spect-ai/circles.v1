import React, { createContext, memo, useContext, useState } from "react";
import { FilterType } from "@/app/types";
import { ViewMode } from "gantt-task-react";

interface GlobalContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;
  isProfilePanelExpanded: boolean;
  setIsProfilePanelExpanded: (isProfilePanelExpanded: boolean) => void;
  connectedUser: string;
  connectUser: (userId: string) => void;
  disconnectUser: () => void;
  quickProfileUser: string;
  openQuickProfile: (userId: string) => void;
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
  viewName: string;
  setViewName: React.Dispatch<React.SetStateAction<string>>;
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  notifseen: boolean;
  setNotifSeen: React.Dispatch<React.SetStateAction<boolean>>;
  currentFilter: FilterType;
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  calendarView: ViewMode;
  setCalendarView: React.Dispatch<React.SetStateAction<ViewMode>>;
}

const useProviderGlobalContext = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  // const [registry, setRegistry] = useState<Registry>({} as Registry);
  const [connectedUser, setConnectedUser] = useState("");

  const [isProfilePanelExpanded, setIsProfilePanelExpanded] = useState(false);
  const [quickProfileUser, setQuickProfileUser] = useState("");

  const [viewName, setViewName] = useState("" as string);
  const [view, setView] = useState(0);
  const [calendarView, setCalendarView] = useState<ViewMode>(ViewMode.Day);

  const [tab, setTab] = useState("Work");
  const [notifseen, setNotifSeen] = useState(false);

  const [currentFilter, setCurrentFilter] = useState({} as FilterType);

  function connectUser(userId: string) {
    setConnectedUser(userId);
  }
  const disconnectUser = () => {
    setConnectedUser("");
  };

  const openQuickProfile = (userId: string) => {
    setIsProfilePanelExpanded(true);
    setQuickProfileUser(userId);
  };

  // useEffect(() => {
  //   fetch(`${process.env.API_HOST}/registry/getGlobalRegistry`)
  //     .then(async (res) => {
  //       const data = await res.json();
  //       setRegistry(data);
  //     })
  //     .catch((err) => {
  //       console.log({ err });
  //     });
  // }, []);

  return {
    isSidebarExpanded,
    setIsSidebarExpanded,
    connectedUser,
    connectUser,
    disconnectUser,
    isProfilePanelExpanded,
    setIsProfilePanelExpanded,
    quickProfileUser,
    openQuickProfile,
    view,
    setView,
    viewName,
    setViewName,
    calendarView,
    setCalendarView,
    tab,
    setTab,
    notifseen,
    setNotifSeen,
    currentFilter,
    setCurrentFilter,
  };
};

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobal = () => useContext(GlobalContext);

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const context = useProviderGlobalContext();

  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
}

export default memo(GlobalContextProvider);
