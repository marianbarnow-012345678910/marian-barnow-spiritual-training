import "server-only";
import { config, momenceConfigured } from "@/lib/config";

/**
 * Thin client for the Momence public API (https://api.docs.momence.com).
 * Authenticates as your own staff account (password grant) and uses the Host API:
 *  - GET  /api/v2/host/sessions                       → class calendar
 *  - GET  /api/v2/host/sessions/{id}                  → one class
 *  - POST /api/v2/host/members/list                   → find a client by e-mail
 *  - POST /api/v2/host/members                        → create a client
 *  - POST /api/v2/host/sessions/{id}/bookings/free    → put the paid client on the roster
 */

const BASE = "https://api.momence.com/api/v2";

export interface MomenceSession {
  id: number;
  name: string;
  type: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  durationInMinutes: number;
  capacity: number | null;
  bookingCount: number;
  teacher: { id: number; firstName: string; lastName: string } | null;
  isCancelled: boolean;
  isInPerson: boolean;
  isDraft: boolean;
  inPersonLocation: { id: number; name: string } | null;
  bannerImageUrl: string | null;
}

interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let cached: Token | null = null;

function basicAuth() {
  return "Basic " + Buffer.from(`${config.momence.clientId}:${config.momence.clientSecret}`).toString("base64");
}

async function requestToken(body: Record<string, string>): Promise<Token> {
  const res = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: { Authorization: basicAuth(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Momence login failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return {
    accessToken: json.access_token ?? json.accessToken,
    refreshToken: json.refresh_token ?? json.refreshToken,
    // Refresh a few minutes early.
    expiresAt: json.accessTokenExpiresAt ? new Date(json.accessTokenExpiresAt).getTime() - 5 * 60000 : Date.now() + 60 * 60000,
  };
}

async function getToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) return cached.accessToken;
  if (cached?.refreshToken) {
    try {
      cached = await requestToken({ grant_type: "refresh_token", refresh_token: cached.refreshToken });
      return cached.accessToken;
    } catch {
      cached = null;
    }
  }
  cached = await requestToken({
    grant_type: "password",
    username: config.momence.username,
    password: config.momence.password,
  });
  return cached.accessToken;
}

async function momence<T>(path: string, init: RequestInit & { revalidate?: number } = {}): Promise<T> {
  if (!momenceConfigured) throw new Error("Momence is not configured");
  const { revalidate, ...rest } = init;
  const doFetch = async () =>
    fetch(`${BASE}${path}`, {
      ...rest,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        "Content-Type": "application/json",
        ...(rest.headers ?? {}),
      },
      ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" as const }),
    });

  let res = await doFetch();
  if (res.status === 401) {
    cached = null;
    res = await doFetch();
  }
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Momence ${rest.method ?? "GET"} ${path} failed (${res.status}): ${text}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

/** Upcoming in-person classes, soonest first. Cached for 5 minutes. */
export async function listUpcomingSessions(): Promise<MomenceSession[]> {
  const now = new Date();
  const until = new Date(now.getTime() + config.momence.daysAhead * 86400000);
  const sessions: MomenceSession[] = [];

  for (let page = 0; page < 10; page++) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "100",
      sortBy: "startsAt",
      sortOrder: "ASC",
      startAfter: now.toISOString(),
      startBefore: until.toISOString(),
    });
    if (config.momence.locationId) {
      params.set("locationId", String(config.momence.locationId));
      params.set("includeChildLocations", "true");
    }
    const res = await momence<{ payload: MomenceSession[]; pagination: { totalCount: number } }>(
      `/host/sessions?${params}`,
      { revalidate: 300 },
    );
    sessions.push(...res.payload);
    if (sessions.length >= res.pagination.totalCount || res.payload.length === 0) break;
  }

  return sessions.filter((s) => !s.isCancelled && !s.isDraft && s.isInPerson && s.type !== "private");
}

export async function getSession(id: number): Promise<MomenceSession> {
  return momence<MomenceSession>(`/host/sessions/${id}`);
}

/** Find the client in Momence by e-mail, or create them. Returns the Momence member id. */
export async function findOrCreateMember(input: { email: string; firstName: string; lastName: string }) {
  const email = input.email.trim().toLowerCase();
  const found = await momence<{ payload: { id: number; email: string }[] }>(`/host/members/list`, {
    method: "POST",
    body: JSON.stringify({ page: 0, pageSize: 20, query: email }),
  });
  const match = found.payload.find((m) => m.email?.trim().toLowerCase() === email);
  if (match) return match.id;

  const created = await momence<{ memberId: number }>(`/host/members`, {
    method: "POST",
    body: JSON.stringify({
      email,
      firstName: input.firstName || "Guest",
      lastName: input.lastName || "-",
      ...(config.momence.locationId ? { homeLocationId: config.momence.locationId } : {}),
    }),
  });
  return created.memberId;
}

/** Put the member on the class roster. Payment has already been taken by Stripe. */
export async function addMemberToSession(sessionId: number, memberId: number) {
  const res = await momence<{ sessionBookingId: number }>(`/host/sessions/${sessionId}/bookings/free`, {
    method: "POST",
    body: JSON.stringify({ memberId }),
  });
  return res.sessionBookingId;
}
