import Constants from "expo-constants";

const envBaseUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_BASE_URL;
const extraBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl as
  | string
  | undefined;

console.log(envBaseUrl, extraBaseUrl);

export const APP_CONFIG = {
  API_BASE_URL: envBaseUrl || extraBaseUrl || "http://[IP_ADDRESS]",
  API_TIMEOUT_MS: 15000,
  APP_NAME: "Dutu Pulmo",
} as const;
