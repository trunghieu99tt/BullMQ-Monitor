import { message } from "antd";
import { useRecoilState } from "recoil";
import { connectionListState } from "../../states/connection.state";
import { useConnection } from "../../talons/useConnection";
import { v4 as uuid } from "uuid";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { PERSISTED_CONNECTIONS_KEY } from "../../constants";

type Props = {
  onCancel: () => void;
};

type TAddConnectionForm = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

export const useAddConnectionForm = ({ onCancel }: Props) => {
  const { checkConnection, getRedisInfo } = useConnection();

  const [connections, setConnections] = useRecoilState(connectionListState);
  const [_, setPersistConnection] = useLocalStorage<string>(
    PERSISTED_CONNECTIONS_KEY,
    ""
  );

  const onAddConnection = async (values: TAddConnectionForm) => {
    const { name, host, password, port, username } = values;

    const testConnection = await checkConnection(
      host,
      port,
      username,
      password
    );

    if (testConnection?.connected) {
      const isConnectionExist = connections.find(
        (connection) => connection.host === host && connection.port === port
      );

      if (isConnectionExist) {
        message.info("Connection already exist");
      } else {
        const redisInfo = await getRedisInfo(host, port, username, password);
        const newConnection = [
          ...connections,
          {
            id: uuid(),
            name,
            host,
            port,
            info: redisInfo,
          },
        ];
        setConnections(newConnection);
        setPersistConnection(JSON.stringify(newConnection));
      }
      onCancel();
    } else {
      message.error(`Can't connect to redis server`);
    }
    console.log("testConnection", testConnection);
  };

  return {
    onAddConnection,
  };
};
