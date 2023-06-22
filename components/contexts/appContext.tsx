import { createContext, useState, useMemo } from "react";

interface AppContextValue {
  authData: any;
  currentTab: string;
  setAuthData: (authData: any) => void;
  setCurrentTab: (currentTab: string) => void;
}

const AppContext = createContext({} as AppContextValue);

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState(null);
  const [currentTab, setCurrentTab] = useState("overview");
  const value = useMemo(() => {
    return {
      authData,
      currentTab,
      setAuthData,
      setCurrentTab,
    };
  }, [authData, currentTab]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider };
