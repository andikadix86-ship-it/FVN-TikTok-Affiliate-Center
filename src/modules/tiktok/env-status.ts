export type TikTokEnvStatus = {
  clientKey: "Configured" | "Missing";
  clientSecret: "Configured" | "Missing";
  redirectUri: "Configured" | "Missing";
  oauth: "Configured" | "Missing";
};

export function getTikTokEnvStatus({
  clientKey,
  clientSecret,
  redirectUri
}: {
  clientKey?: string;
  clientSecret?: string;
  redirectUri?: string;
}): TikTokEnvStatus {
  const status = {
    clientKey: clientKey ? "Configured" : "Missing",
    clientSecret: clientSecret ? "Configured" : "Missing",
    redirectUri: redirectUri ? "Configured" : "Missing"
  } as const;

  return {
    ...status,
    oauth: status.clientKey === "Configured" && status.clientSecret === "Configured" && status.redirectUri === "Configured" ? "Configured" : "Missing"
  };
}
