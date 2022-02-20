import { RedisInfo } from "redis-info";
import { IRedisInfo } from "../types/model.type";

export class Redis {
  info: IRedisInfo;
  constructor(rawRedisInfo: RedisInfo) {
    this.info = this.convertRawData(rawRedisInfo);
  }

  convertRawData(rawRedisInfo: RedisInfo): IRedisInfo {
    return {
      usedMemory: rawRedisInfo.used_memory_human,
      peakUsedMemory: rawRedisInfo.used_memory_peak_human,
      uptime: rawRedisInfo.uptime_in_seconds,
      fragmentRatio: rawRedisInfo.mem_fragmentation_ratio,
      blockedClients:
        (rawRedisInfo.blocked_clients &&
          Number(rawRedisInfo.blocked_clients)) ||
        0,
      connectedClients:
        (rawRedisInfo.connected_clients &&
          Number(rawRedisInfo.connected_clients)) ||
        0,
      mode: rawRedisInfo.redis_mode,
      os: rawRedisInfo.os,
      port: (rawRedisInfo.tcp_port && Number(rawRedisInfo.tcp_port)) || 6379,
      totalMemory: rawRedisInfo.total_system_memory_human,
      version: rawRedisInfo.redis_version,
    };
  }

  getData(): IRedisInfo {
    return this.info;
  }
}
