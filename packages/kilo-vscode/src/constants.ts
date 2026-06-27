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
