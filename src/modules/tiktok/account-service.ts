import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { buildSafeOAuthLog, maskOpenId, redactOAuthSecrets } from "./oauth";

export type TikTokAccountView = {
  connected: boolean;
  demoMode: boolean;
  connectionStatus: "Not Connected" | "Connecting" | "Connected" | "Expired";
  username: string;
  displayName: string;
  avatarUrl: string;
  followerCount: string;
  videoCount: string;
  openIdMasked: string;
  connectedAt: string;
  tokenStatus: string;
  scopeStatus: string;
  lastSyncStatus: string;
};

export async function writeTikTokOAuthLog(
  status: "SUCCESS" | "ERROR",
  message: string,
  details?: unknown,
  errorCode?: string
) {
  if (!env.DATABASE_URL || !env.DIRECT_URL) {
    return;
  }

  try {
    const safe = buildSafeOAuthLog(status, message, details, errorCode);
    await prisma.tikTokOAuthLog.create({
      data: {
        status: safe.status,
        errorCode: safe.errorCode,
        message: safe.message,
        safeDetails: safe.safeDetails
      }
    });
  } catch {
    // Logging must never break OAuth flow.
  }
}

export function buildDisconnectedAccountView(): TikTokAccountView {
  return {
    connected: false,
    demoMode: false,
    connectionStatus: "Not Connected",
    username: "Not connected",
    displayName: "Not connected",
    avatarUrl: "",
    followerCount: "Not connected",
    videoCount: "Not connected",
    openIdMasked: "Not connected",
    connectedAt: "Not connected",
    tokenStatus: "not_stored",
    scopeStatus: "unknown",
    lastSyncStatus: "not_synced"
  };
}

export function buildDemoTikTokAccountView(): TikTokAccountView {
  return {
    connected: true,
    demoMode: true,
    connectionStatus: "Connected",
    username: "@fvn_demo_creator",
    displayName: "Demo TikTok Account",
    avatarUrl: "",
    followerCount: "12,480",
    videoCount: "86",
    openIdMasked: "demo_open_id",
    connectedAt: "Demo mode",
    tokenStatus: "demo_not_stored",
    scopeStatus: "demo_profile",
    lastSyncStatus: "demo_connected"
  };
}

export async function getTikTokAccountView(): Promise<TikTokAccountView> {
  if (!env.DATABASE_URL || !env.DIRECT_URL) {
    return buildDisconnectedAccountView();
  }

  try {
    const account = await prisma.tikTokAccount.findFirst({
      orderBy: { connectedAt: "desc" }
    });

    if (!account) {
      return buildDisconnectedAccountView();
    }

    return {
      connected: true,
      demoMode: false,
      connectionStatus: account.tokenExpiresAt && account.tokenExpiresAt < new Date() ? "Expired" : "Connected",
      username: account.profileDeepLink ? account.profileDeepLink.replace("https://www.tiktok.com/", "") : account.displayName ? `@${account.displayName.replace(/^@/, "")}` : "Connected account",
      displayName: account.displayName ?? "Connected Account",
      avatarUrl: account.avatarUrl ?? "",
      followerCount: "0",
      videoCount: "0",
      openIdMasked: maskOpenId(account.openId),
      connectedAt: account.connectedAt.toISOString(),
      tokenStatus: account.tokenStatus,
      scopeStatus: account.scopeStatus,
      lastSyncStatus: account.lastSyncStatus
    };
  } catch {
    return buildDisconnectedAccountView();
  }
}

export async function getLastTikTokOAuthLog() {
  if (!env.DATABASE_URL || !env.DIRECT_URL) {
    return null;
  }

  try {
    return await prisma.tikTokOAuthLog.findFirst({
      orderBy: { createdAt: "desc" }
    });
  } catch {
    return null;
  }
}

export async function saveTikTokAccountConnection({
  openId,
  displayName,
  avatarUrl,
  profileDeepLink,
  accessToken,
  refreshToken,
  expiresIn
}: {
  openId: string;
  displayName?: string;
  avatarUrl?: string;
  profileDeepLink?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}) {
  if (!env.DATABASE_URL || !env.DIRECT_URL) {
    return null;
  }

  const encryptionConfigured = false;
  const connectedAt = new Date();

  return prisma.tikTokAccount.upsert({
    where: { openId },
    update: {
      displayName,
      avatarUrl,
      profileDeepLink,
      connectedAt,
      tokenStatus: encryptionConfigured && accessToken && refreshToken ? "encrypted_stored" : "not_stored",
      scopeStatus: displayName || avatarUrl ? "profile_read" : "profile_unavailable",
      lastSyncStatus: displayName || avatarUrl ? "profile_synced" : "partial_connection",
      tokenExpiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined
    },
    create: {
      openId,
      displayName,
      avatarUrl,
      profileDeepLink,
      connectedAt,
      tokenStatus: encryptionConfigured && accessToken && refreshToken ? "encrypted_stored" : "not_stored",
      scopeStatus: displayName || avatarUrl ? "profile_read" : "profile_unavailable",
      lastSyncStatus: displayName || avatarUrl ? "profile_synced" : "partial_connection",
      tokenExpiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined
    }
  });
}

export function buildTokenStorageWarning() {
  return "Token encryption is not configured, token was not stored.";
}

export function safeOAuthDetails(details: unknown) {
  return redactOAuthSecrets(details);
}
