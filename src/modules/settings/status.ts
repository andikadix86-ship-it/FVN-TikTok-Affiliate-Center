import { ProductSource } from "@/modules/affiliate/types";
import { PromptEngineMode } from "@/modules/prompt-engine/types";

export type StatusLabel = "Connected" | "Configured" | "Missing" | "Not Connected" | "Demo Mode" | "Manual" | "CSV" | "Real API";

export type SettingsStatus = {
  appUrl: StatusLabel;
  database: StatusLabel;
  tiktokOAuth: StatusLabel;
  aiProvider: StatusLabel;
  productDataSource: StatusLabel;
};

export function getSettingsStatus({
  appUrl,
  databaseUrl,
  tiktokOAuthConfigured,
  tiktokConnected,
  promptEngineMode,
  productSource
}: {
  appUrl?: string;
  databaseUrl?: string;
  tiktokOAuthConfigured: boolean;
  tiktokConnected: boolean;
  promptEngineMode: PromptEngineMode;
  productSource: ProductSource;
}): SettingsStatus {
  return {
    appUrl: appUrl ? "Configured" : "Missing",
    database: databaseUrl ? "Configured" : "Missing",
    tiktokOAuth: tiktokConnected ? "Connected" : tiktokOAuthConfigured ? "Configured" : "Missing",
    aiProvider: promptEngineMode === "AI_CONNECTED" ? "Connected" : "Not Connected",
    productDataSource: productSource === "DEMO" ? "Demo Mode" : productSource === "CSV_IMPORT" ? "CSV" : productSource === "REAL_API" ? "Real API" : "Manual"
  };
}
