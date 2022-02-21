import { atom } from "recoil";
import { IRedisInfo } from "../types/model.type";

export const redisState = atom<IRedisInfo | null>({
  key: "redis",
  default: null,
});
