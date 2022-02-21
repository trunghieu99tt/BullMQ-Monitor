import { atom, selectorFamily } from "recoil";
import { IConnection } from "../types/model.type";

export const connectionListState = atom<IConnection[]>({
  key: "connectionList",
  default: [],
});

export const currentConnectionState = atom<IConnection | null>({
  key: "currentConnection",
  default: null,
});

export const connectionStrSelector = selectorFamily<string, string | undefined>(
  {
    key: "connectionSelector",
    get:
      (connectionId: string | undefined) =>
      ({ get }) => {
        if (!connectionId) {
          return "";
        }

        const connections = get(connectionListState);
        const connection = connections.find(
          (connection) => connection.id === connectionId
        );

        if (connection) {
          return `${connection?.host}:${connection?.port}`;
        }

        return "";
      },
  }
);

export const connectionSelectorByConnectionId = selectorFamily<
  IConnection | null,
  string | undefined
>({
  key: "connectionSelectorByConnectionId",
  get:
    (connectionId: string | undefined) =>
    ({ get }) => {
      if (!connectionId) {
        return null;
      }

      const connections = get(connectionListState);
      const connection = connections.find(
        (connection) => connection.id === connectionId
      );

      return connection || null;
    },
});

