export interface IRedisInfo {
  usedMemory: string;
  peakUsedMemory: string;
  totalMemory: string;
  connectedClients: number;
  blockedClients: number;
  uptime: string;
  fragmentRatio: string;
  version: string;
  mode: string;
  os: string;
  port: number;
}

export interface IJob {
  id: string;
  status: string;
  name: string;
  timestamp: number;
  delay: number;
  attempt: number;
  data: any;
}

export interface IConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  info: IRedisInfo;
}
