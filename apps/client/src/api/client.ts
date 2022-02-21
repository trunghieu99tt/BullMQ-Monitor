import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3005/queue-monitor",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
