import * as vscode from "vscode"
import {
  RELAY_GATEWAY_URL_DEFAULT,
  RELAY_WEBAPP_URL_DEFAULT,
} from "../../constants"

// Where we persist config.
const SECRET_KEY = "relay.virtualKey"       // vscode.SecretStorage (encrypted)
const STATE_KEY_GATEWAY = "relay.gatewayUrl" // vscode.globalState (not secret)

export interface RelayHandlerDeps {
  context: vscode.ExtensionContext
  postMessage: (msg: unknown) => void
}

export async function handleRelayMessage(
  msg: { type: string; [k: string]: unknown },
  deps: RelayHandlerDeps,
): Promise<void> {
  const { context, postMessage } = deps

  switch (msg.type) {
    case "relay/getConfig": {
      const gatewayUrl =
        (context.globalState.get<string>(STATE_KEY_GATEWAY)) ??
        RELAY_GATEWAY_URL_DEFAULT
      const virtualKey = (await context.secrets.get(SECRET_KEY)) ?? null
      postMessage({ type: "relay/config", gatewayUrl, virtualKey })
      return
    }

    case "relay/saveConfig": {
      const gatewayUrl = String(msg.gatewayUrl ?? "").trim()
      const virtualKey = String(msg.virtualKey ?? "").trim()
      if (!gatewayUrl) {
        postMessage({ type: "relay/saveError", error: "Gateway URL is required" })
        return
      }
      await context.globalState.update(STATE_KEY_GATEWAY, gatewayUrl)
      if (virtualKey) {
        await context.secrets.store(SECRET_KEY, virtualKey)
      } else {
        await context.secrets.delete(SECRET_KEY)
      }
      postMessage({ type: "relay/saved" })
      return
    }

    case "relay/testConnection": {
      const gatewayUrl = String(msg.gatewayUrl ?? "").trim()
      const virtualKey = String(msg.virtualKey ?? "").trim()
      try {
        const url = gatewayUrl.replace(/\/+$/, "") + "/v1/models"
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${virtualKey}` },
        })
        if (res.status === 401 || res.status === 403) {
          postMessage({
            type: "relay/testResult",
            ok: false,
            error: "Invalid virtual key. Get one at the Relay Dashboard.",
          })
          return
        }
        if (!res.ok) {
          postMessage({
            type: "relay/testResult",
            ok: false,
            error: `Gateway returned ${res.status}`,
          })
          return
        }
        const body = (await res.json()) as { data?: unknown[] }
        postMessage({
          type: "relay/testResult",
          ok: true,
          modelCount: Array.isArray(body.data) ? body.data.length : 0,
        })
      } catch (err) {
        postMessage({
          type: "relay/testResult",
          ok: false,
          error:
            err instanceof Error
              ? `Cannot reach gateway: ${err.message}`
              : "Cannot reach gateway",
        })
      }
      return
    }

    case "relay/openDashboard": {
      const url =
        (context.globalState.get<string>("relay.webappUrl")) ??
        RELAY_WEBAPP_URL_DEFAULT
      await vscode.env.openExternal(vscode.Uri.parse(url))
      return
    }
  }
}
