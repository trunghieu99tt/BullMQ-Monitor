import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import client from "../api/client";
import { PERSISTED_CONNECTIONS_KEY } from "../constants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { connectionListState } from "../states/connection.state";
import { IConnection } from "../types/model.type";

export const useApp = () => {
  const [persistConnection, _] = useLocalStorage<string>(
    PERSISTED_CONNECTIONS_KEY,
    ""
  );
  const setConnections = useSetRecoilState(connectionListState);

  useEffect(() => {
    if (persistConnection) {
      initData();
    }
  }, [persistConnection]);

  const initData = async () => {
    const connections = JSON.parse(persistConnection);
    setConnections(connections);
    await Promise.all(
      connections.map(async (connection: IConnection) => {
        await client.post("/queue-monitor/init-info", {
          host: connection.host,
          port: connection.port,
        });
      })
    );
  };

  return {
    persistConnection,
  };
};
