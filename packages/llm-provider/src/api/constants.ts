/**
 * Kilo Gateway Configuration Constants
 * Centralized configuration for all API endpoints, headers, and settings
 */

/** Environment variable for the Relay gateway URL. */
export const ENV_KILO_API_URL = "RELAY_GATEWAY_URL"

/**
 * Default Relay gateway URL.
 *
 * Relay never talks to api.kilo.ai. The gateway is one of:
 *   - Relay Cloud, the hosted production gateway (the default below).
 *   - A local Docker container — override with
 *     RELAY_GATEWAY_URL=http://localhost:4000.
 *   - A customer's self-hosted gateway in their VPC — set
 *     RELAY_GATEWAY_URL to that cluster's service URL or external
 *     ingress hostname.
 *
 * The hostname below will be replaced with the gateway.relay.dev
 * vanity URL once DNS is configured.
 *
 * Legacy KILO_API_URL is honored as a fallback so the transition
 * doesn't surprise users who already had it set.
 */
export const DEFAULT_KILO_API_URL = "https://gateway-production-30d5.up.railway.app"

/** Base URL for the Relay gateway. */
export const KILO_API_BASE =
  process.env[ENV_KILO_API_URL] || process.env.KILO_API_URL || DEFAULT_KILO_API_URL

// Kilo Chat / Event Service used to point at chat.kiloapps.io and
// wss://events.kiloapps.io. Relay doesn't ship these features (they
// were part of Kilo's commercial bundle, killed in Paso 0). The env
// vars are kept so any user configuration that sets them still parses,
// but the defaults are empty — the constants are exported only because
// a few files in the legacy code path still import them; they reach
// the bundle as empty strings and produce no network traffic.
export const KILO_CHAT_URL_ENV = "KILO_CHAT_URL"
export const KILO_DEFAULT_CHAT_URL = ""
export const KILO_CHAT_URL = process.env[KILO_CHAT_URL_ENV] || KILO_DEFAULT_CHAT_URL

export const KILO_EVENT_SERVICE_URL_ENV = "EVENT_SERVICE_URL"
export const KILO_DEFAULT_EVENT_SERVICE_URL = ""
export const KILO_EVENT_SERVICE_URL = process.env[KILO_EVENT_SERVICE_URL_ENV] || KILO_DEFAULT_EVENT_SERVICE_URL

/**
 * Default base URL for the gateway's OpenAI-compatible endpoint.
 *
 * LiteLLM exposes `/v1/chat/completions`, `/v1/embeddings`, `/v1/models`,
 * etc. Just `${gateway}/v1`. The constant keeps its legacy name so we
 * don't churn 20 importers; the value it returns is what's accurate.
 */
export const KILO_OPENROUTER_BASE = `${KILO_API_BASE}/v1`

/** Device auth polling interval in milliseconds */
export const POLL_INTERVAL_MS = 3000

/**
 * Default model used when no profile-selected model is available.
 *
 * Resolves to a stable model_name registered on the Relay gateway:
 *   - "primary"   triggers the multi-provider fallback chain
 *                 (Claude → Gemini → Kimi). The model the user
 *                 actually gets depends on which provider's BYOK
 *                 key is set and healthy.
 *   - A direct provider/model name (e.g. "anthropic/claude-sonnet-4-6")
 *     pins to one provider via the gateway's pass-through alias.
 *
 * We default to "primary" so a fresh install with only an Anthropic
 * key configured still works AND benefits from automatic failover
 * when Anthropic returns 429/5xx.
 *
 * NOT "kilo-auto/free" anymore — that was a Kilo Code gateway alias
 * for "the free model of the day" backed by Kilo's commercial
 * inference. Relay is BYOK; there's no free model.
 */
export const DEFAULT_MODEL = "primary"

/** Same as DEFAULT_MODEL — Relay doesn't distinguish free vs paid. */
export const DEFAULT_FREE_MODEL = "primary"

/** Token expiration duration in milliseconds (1 year) */
export const TOKEN_EXPIRATION_MS = 365 * 24 * 60 * 60 * 1000

/** User-Agent header base value for requests */
export const USER_AGENT_BASE = "opencode-kilo-provider"

/** Content-Type header value for requests */
export const CONTENT_TYPE = "application/json"

/** Default provider name */
export const DEFAULT_PROVIDER_NAME = "kilo"

/** Default API key for anonymous requests */
export const ANONYMOUS_API_KEY = "anonymous"

/** Fetch timeout for model requests in milliseconds (10 seconds) */
export const MODELS_FETCH_TIMEOUT_MS = 10 * 1000

/**
 * Header constants for KiloCode API requests
 */
export const HEADER_ORGANIZATIONID = "X-KILOCODE-ORGANIZATIONID"
export const HEADER_TASKID = "X-KILOCODE-TASKID"
export const HEADER_PARENT_TASKID = "X-KILOCODE-PARENT-TASKID"
export const HEADER_PROJECTID = "X-KILOCODE-PROJECTID"
export const HEADER_TESTER = "X-KILOCODE-TESTER"
export const HEADER_EDITORNAME = "X-KILOCODE-EDITORNAME"
export const HEADER_MACHINEID = "X-KILOCODE-MACHINEID"

/** Default editor name value */
export const DEFAULT_EDITOR_NAME = "Kilo CLI"

/** Environment variable name for custom editor name */
export const ENV_EDITOR_NAME = "KILOCODE_EDITOR_NAME"

/** Environment variable name for version (set by CLI at startup) */
export const ENV_VERSION = "KILOCODE_VERSION"

/** Tester header value for suppressing warnings */
export const TESTER_SUPPRESS_VALUE = "SUPPRESS"

/** Header name for feature tracking */
export const HEADER_FEATURE = "X-KILOCODE-FEATURE"

/** Environment variable name for feature override */
export const ENV_FEATURE = "KILOCODE_FEATURE"

export const PROMPTS = [
  "codex",
  "gemini",
  "beast",
  "anthropic",
  "trinity",
  "anthropic_without_todo",
  "ling",
  "gpt55",
] as const

export const AI_SDK_PROVIDERS = [
  "alibaba",
  "anthropic",
  "mistral",
  "openai",
  "openai-compatible",
  "openrouter",
] as const
