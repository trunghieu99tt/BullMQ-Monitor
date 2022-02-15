import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, required = false) => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Environment variable ${key} is required`);
  }

  return value;
};

export const APP_PORT = getEnv("APP_PORT", true);
export const REDIS_HOST = getEnv("REDIS_HOST", true);
export const REDIS_PORT = getEnv("REDIS_PORT", true)
  ? parseInt(getEnv("REDIS_PORT", true)!)
  : 6379;
export const REDIS_PASSWORD = getEnv("REDIS_PASSWORD");
