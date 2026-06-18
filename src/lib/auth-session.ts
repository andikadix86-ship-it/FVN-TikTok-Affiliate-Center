import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const AUTH_SESSION_COOKIE = "fvn_auth_session";
export const AUTH_GOOGLE_STATE_COOKIE = "fvn_google_login_state";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
};

type AuthSession = {
  user: AuthUser;
  exp: number;
};

const oneDay = 60 * 60 * 24;

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.ENCRYPTION_KEY || "fvn-local-auth-development-secret";
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function encode(value: AuthSession) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decode(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AuthSession;
}

export function createOAuthState() {
  return randomBytes(24).toString("base64url");
}

export function createSignedSession(user: AuthUser, remember = false) {
  const maxAge = remember ? oneDay * 30 : oneDay;
  const payload = encode({ user, exp: Math.floor(Date.now() / 1000) + maxAge });
  return { token: `${payload}.${sign(payload)}`, maxAge };
}

export function readSignedSession(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const session = decode(payload);
    if (!session.user?.email || session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function getRequestSession(request: NextRequest) {
  return readSignedSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
}

export function setAuthCookie(response: NextResponse, user: AuthUser, remember = false) {
  const { token, maxAge } = createSignedSession(user, remember);
  response.cookies.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function inferNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "FVN User";
}
