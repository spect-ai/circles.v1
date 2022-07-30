import React, { createContext, memo, useContext, useState } from "react";
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
}

const useProviderGlobalContext = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  // const [registry, setRegistry] = useState<Registry>({} as Registry);
  const [connectedUser, setConnectedUser] = useState("");
  const [isProfilePanelExpanded, setIsProfilePanelExpanded] = useState(false);
  const [quickProfileUser, setQuickProfileUser] = useState('');

  function connectUser(userId: string) {
    setConnectedUser(userId);
  }
  const disconnectUser = () => {
    setConnectedUser("");
  };

  const openQuickProfile = (userId: string) =>{
    setIsProfilePanelExpanded(true);
    setQuickProfileUser(userId);
  }

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
