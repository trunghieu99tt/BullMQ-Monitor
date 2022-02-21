import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { connectionListState } from "../states/connection.state";

export const useApp = () => {
  const [persistConnection, _] = useLocalStorage<string>(
    "persistConnection",
    ""
  );
  const setConnections = useSetRecoilState(connectionListState);

  useEffect(() => {
    if (persistConnection) {
      console.log("persistConnection", persistConnection);
      const connections = JSON.parse(persistConnection);
      console.log("connections", connections);
      setConnections(connections);
    }
  }, [persistConnection]);

  return {
    persistConnection,
  };
};
