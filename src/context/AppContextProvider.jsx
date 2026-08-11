import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const value = useMemo(() => ({ token, setToken }), [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
