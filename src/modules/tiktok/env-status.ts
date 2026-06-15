export type TikTokEnvStatus = {
  clientKey: "Configured" | "Missing";
  clientSecret: "Configured" | "Missing";
  redirectUri: "Configured" | "Missing";
  oauth: "Configured" | "Missing" | "Invalid";
  errors: string[];
};

import { validateTikTokProductionOAuth } from "./production-oauth";

export function getTikTokEnvStatus({
  clientKey,
  clientSecret,
  redirectUri,
  appUrl,
  nodeEnv
}: {
  clientKey?: string;
  clientSecret?: string;
  redirectUri?: string;
  appUrl?: string;
  nodeEnv?: string;
}): TikTokEnvStatus {
  const status = {
    clientKey: clientKey ? "Configured" : "Missing",
    clientSecret: clientSecret ? "Configured" : "Missing",
    redirectUri: redirectUri ? "Configured" : "Missing"
  } as const;

  const production = validateTikTokProductionOAuth({
    clientKey,
    clientSecret,
    redirectUri,
    appUrl,
    nodeEnv
  });

  return {
    ...status,
    oauth: production.status === "configured" ? "Configured" : production.status === "invalid" ? "Invalid" : "Missing",
    errors: production.errors
  };
}
