import client from "../api/client";
import { Redis } from "../models/redis";
import { IRedisInfo } from "../types/model.type";

const BASE_CONNECTION_URL = "/connection";

export const useConnection = () => {
  const checkConnection = async (
    host: string,
    port: number,
    username?: string,
    password?: string
  ): Promise<{
    connected: boolean;
  }> => {
    const response = await client.post(
      `${BASE_CONNECTION_URL}/check-connection`,
      {
        host,
        port,
        username,
        password,
      }
    );
    return response?.data;
  };

  const getRedisInfo = async (
    host: string,
    port: number,
    username?: string,
    password?: string
  ): Promise<IRedisInfo> => {
    const response = await client.post(`${BASE_CONNECTION_URL}/redis-info`, {
      host,
      port,
      username,
      password,
    });

    return new Redis(response?.data).getData();
  };

  return {
    checkConnection,
    getRedisInfo,
  };
};
