import { createContext, useMemo, useState } from "react";

export const ChannelContext = createContext();

const ChannelContextProvider = (props) => {
  const [openSidebox, setSideBox] = useState(false);

  const toggleSideBox = () => setSideBox((prev) => !prev);
  const closeSideBox = () => setSideBox(false);

  const value = useMemo(
    () => ({ openSidebox, toggleSideBox, closeSideBox }),
    [openSidebox]
  );

  return (
    <ChannelContext.Provider value={value}>
      {props.children}
    </ChannelContext.Provider>
  );
};

export default ChannelContextProvider;
