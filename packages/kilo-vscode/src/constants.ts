// User-visible product name. Used as:
//   - tab title when the agent panel opens in the editor area
//     ("Relay" → "Relay Chat" after the agent appends " Chat")
//   - sidebar title fallback when no session is active
//   - status bar item label
// This is the single source of truth for the marketing name across
// runtime; the manifest displayName in package.json is a parallel
// declaration only the Marketplace listing reads, and is already
// "Relay: Resilient AI Coding Agent".
export const EXTENSION_DISPLAY_NAME = "Relay"

// URL of the Relay LiteLLM gateway the extension should default to.
// Overridable per-user via Settings → Relay tab. Baked in at build
// time; deployment can override via env vars consumed by esbuild.
export const RELAY_GATEWAY_URL_DEFAULT: string =
  process.env.RELAY_GATEWAY_URL ??
  "https://gateway-production-30d5.up.railway.app"

// URL of the Relay webapp — used by the "Open Relay Dashboard" button
// in the Relay settings tab. Same override mechanism.
export const RELAY_WEBAPP_URL_DEFAULT: string =
  process.env.RELAY_WEBAPP_URL ??
  "https://webapp-production-2f45.up.railway.app"
