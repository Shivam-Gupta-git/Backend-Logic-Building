import { createContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ChannelContext = createContext();

const ChannelContextProvider = (props) => {
  const [openSidebox, setSideBox] = useState(false);
  
  const toggleSideBox = () => setSideBox((prev) => !prev);
  const closeSideBox = () => setSideBox(false);
  const navigate = useNavigate()

  const value = useMemo(
    () => ({ openSidebox, toggleSideBox, closeSideBox, navigate}),
    [openSidebox]
  );

  

  return (
    <ChannelContext.Provider value={value}>
      {props.children}
    </ChannelContext.Provider>
  );
};

export default ChannelContextProvider;
