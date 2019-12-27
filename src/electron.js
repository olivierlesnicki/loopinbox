import React, { useCallback, useContext, useEffect, useState } from "react";

const { ipcRenderer } = window;

const context = React.createContext();

export function ElectronProvider(props) {
  const [data, setData] = useState({
    loopCache: {}
  });

  const send = useCallback((name, ...args) => {
    ipcRenderer.send(`loopinbox.${name}`, ...args);
  }, []);

  useEffect(() => {
    const listener = (event, ...args) => {
      console.log(...args);
      setData(...args);
    };

    ipcRenderer.on("loopinbox.data", listener);

    // Notify electron process that client-side app is ready
    send("ready");

    return () => ipcRenderer.removeListener("loopinbox.data", listener);
  }, []);

  return (
    <context.Provider
      value={{
        data,
        send
      }}
      {...props}
    />
  );
}

export function useElectron() {
  return useContext(context);
}
