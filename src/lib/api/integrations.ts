/**
 * Typed calls for /api/core/integrations (Backend-AI-OS,
 * core/integrations/router.py) — the "Connect Gmail" flow. See
 * docs/CONNECTORS_NANGO.md in the backend repo: the frontend gets a Nango
 * Connect UI session token here, opens the hosted OAuth popup
 * (@nangohq/frontend), then reports the resulting connectionId back here.
 */
import { api } from "./client";

const BASE = "/api/core/integrations";

export interface ConnectSession {
  session_token: string;
  expires_at: string | null;
}

export function createConnectSession() {
  return api.post<ConnectSession>(`${BASE}/connect-session`);
}

export interface Integration {
  provider: string;
  status: string;
}

export function listIntegrations() {
  return api.get<Integration[]>(`${BASE}/connections`);
}

export function confirmConnection(provider: string, nangoConnectionId: string) {
  return api.post<Integration>(`${BASE}/connections`, {
    provider,
    nango_connection_id: nangoConnectionId,
  });
}

export function disconnectIntegration(provider: string) {
  return api.post<Integration>(`${BASE}/connections/${provider}/disconnect`);
}

export const GOOGLE_MAIL_PROVIDER = "google-mail";
