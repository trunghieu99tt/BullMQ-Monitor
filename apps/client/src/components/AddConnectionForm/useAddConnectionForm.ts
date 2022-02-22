import { message } from "antd";
import { useRecoilState } from "recoil";
import { connectionListState } from "../../states/connection.state";
import { useConnection } from "../../talons/useConnection";
import { v4 as uuid } from "uuid";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type Props = {
  onCancel: () => void;
};

export const useAddConnectionForm = ({ onCancel }: Props) => {
  const { checkConnection, getRedisInfo } = useConnection();
  const [connections, setConnections] = useRecoilState(connectionListState);
  const [persistConnection, setPersistConnection] = useLocalStorage<string>(
    "persistConnection",
    ""
  );

  const onAddConnection = async (values: any) => {
    console.log("values", values);
    const { host, port } = values;
    if (!host || !port) {
      message.error("Host and port are required");
      return;
    }

    const testConnection = await checkConnection(
      values.host,
      parseInt(values.port, 10),
      values.username,
      values.password
    );
    if (testConnection?.connected) {
      const isConnectionExist = connections.find(
        (connection) =>
          connection.host === values.host &&
          connection.port === parseInt(values.port, 10)
      );
      if (isConnectionExist) {
        message.info("Connection already exist");
      } else {
        const redisInfo = await getRedisInfo(
          values.host,
          parseInt(values.port, 10),
          values.username,
          values.password
        );
        const newConnection = [
          ...connections,
          {
            id: uuid(),
            name: values.name,
            host: values.host,
            port: parseInt(values.port, 10),
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
