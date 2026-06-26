# Relay — Resilient AI Coding Agent

> AI coding agent for VS Code with **multi-provider resilience** and
> **spec-driven development**. Bring your own API keys; never get blocked
> by a single provider outage.

---

## Why Relay

| Pain point | What Relay does |
|---|---|
| Claude hits 429 in the middle of your refactor | Automatic fallback to Gemini → Kimi. Your IDE never stops. |
| "Vague feature → bad code" loop | Spec mode generates `requirements.md` → `design.md` → `tasks.md` you can review and version. |
| Vendor lock-in to one model's billing | BYOK — your Anthropic / Gemini / Moonshot keys, your bill. We charge for the platform, never for tokens. |
| Corporate firewall blocks N AI hostnames | Single endpoint via the Relay gateway. Open one domain, get all providers. |
| Prompts leaving your VPC | Self-host the gateway in your cluster with our Helm chart. |

---

## Quick start

### 1. Install

From VS Code: **Extensions** → search `Relay` → **Install**.
Or from CLI:
```bash
code --install-extension star-enterprise-solution.relay
```

### 2. Bring your keys

Open VS Code settings (⌘, on macOS) and search for `Relay`. Paste:

- **Anthropic API Key** (required — primary provider)
- **Gemini API Key** (optional — second in fallback chain)
- **Moonshot API Key** (optional — third)

Get keys at:
- Anthropic: <https://console.anthropic.com/settings/keys>
- Gemini: <https://aistudio.google.com/app/apikey>
- Moonshot: <https://platform.moonshot.cn/console/api-keys>

You only need Anthropic to start. The other two enable the fallback chain.

### 3. Pick how Relay routes your requests

There are three ways:

#### a) Relay Cloud (default — easiest)
The extension is pre-configured to point at our hosted gateway.
Requires a Relay account — sign up at <https://relay.dev>.

#### b) Self-hosted gateway (enterprise)
Set `Relay › Gateway Url` in settings to your cluster's gateway URL.
See the enterprise install guide:
<https://github.com/star-enterprise-solution/relay-workspace/blob/main/docs/enterprise/INSTALL.md>

#### c) Local gateway (for developers)
```bash
git clone https://github.com/star-enterprise-solution/relay-workspace
cd relay-workspace/gateway
cp .env.example .env  # paste your API keys
docker compose up -d
```
Then set `Relay › Gateway Url` to `http://localhost:4000`.

### 4. First request

Open the Relay sidebar (left activity bar, ⚡ icon). Type:

```
Generate a TypeScript utility that retries an async function with
exponential backoff. Include tests.
```

You should see streaming output. If a provider rate-limits, the agent
fails over to the next without you noticing.

---

## Spec-driven development

Relay's signature feature. Instead of asking the agent to "build a
feature" in one shot, you walk through three reviewable artifacts:

1. **Requirements** — User stories, acceptance criteria, in/out of scope.
2. **Design** — Architecture, data model, API contracts.
3. **Tasks** — Concrete to-do list the agent picks up and executes.

Trigger with the **Spec** agent mode in the sidebar, or the command palette: `Relay: New Spec`.

Each artifact lands as a Markdown file in `docs/specs/<feature>/`. You
review and edit before moving to the next stage. The agent honors the
files as constraints when it implements.

The flow forces you to think before generating, and gives you reviewable
diffs at each step.

---

## Multi-provider resilience

By default, Relay tries providers in this order:

```
Anthropic Claude → Google Gemini → Moonshot Kimi
```

Each provider has retry, cooldown, and failure-budget settings configured
at the gateway. If `anthropic.com` returns a 429 or 5xx, the request
re-routes to the next provider — same prompt, same response format —
without your IDE knowing.

You can change the order or add providers in the gateway's `config.yaml`.
See `docs/specs/multi-provider-resilience.md` in the workspace repo for
the design.

---

## Settings reference

| Setting | Default | Description |
|---|---|---|
| `Relay › Gateway Url` | `https://api.relay.dev` | Where the extension sends inference requests |
| `Relay › Virtual Key` | _empty_ | Auth token for Relay Cloud (issued by the dashboard) |
| `Relay › Anthropic Api Key` | _empty_ | Your Anthropic key, BYOK |
| `Relay › Gemini Api Key` | _empty_ | Your Gemini key, BYOK |
| `Relay › Moonshot Api Key` | _empty_ | Your Moonshot key, BYOK |
| `Relay › Primary Model` | `primary` | Which model_name in gateway config to start with |

For corporate proxy + custom CA bundle setups, use standard
`HTTP_PROXY` / `HTTPS_PROXY` env vars and `NODE_EXTRA_CA_CERTS`. Relay
respects them.

---

## Troubleshooting

### "Cannot reach gateway"
```bash
curl https://api.relay.dev/health
```
If that fails, your network blocks it (check your corporate proxy).
If it works, re-check `Relay › Gateway Url` — typo most likely.

### "401 Unauthorized" on every request
Either your Relay virtual key is invalid/revoked, or you forgot to paste
your provider API key. The latter is more common — check
`Relay › Anthropic Api Key` is set.

### Rate limit errors despite the fallback chain
The chain only kicks in on 429 / 5xx. A 403 ("invalid key") doesn't
trigger fallback — fix the key. Same for 404 ("model not available") —
that means you asked for a model the gateway doesn't have configured.

### Extension activated but sidebar is empty
Reload the window (`⌘⇧P` → `Developer: Reload Window`). If still empty,
check the output panel (`⌘⇧U` → select **Relay** from the dropdown).

### File bugs
<https://github.com/star-enterprise-solution/relay/issues>

---

## What Relay does NOT do

We're upfront about scope:

- **Resell model inference.** You pay providers directly with your own keys.
- **Store prompts or responses.** The hosted gateway logs only metadata
  (timestamps, models, token counts). See
  [PRIVACY.md](https://github.com/star-enterprise-solution/relay-workspace/blob/main/docs/legal/PRIVACY.md).
- **Provide inline ghost-text autocomplete.** We focus on agent / chat
  workflows. Use Copilot or Cursor's autocomplete alongside Relay if you
  want that.

---

## License

MIT. Substantial modifications from upstream
[Kilo Code](https://github.com/Kilo-Org/kilocode); see
[NOTICE.md](https://github.com/star-enterprise-solution/relay-workspace/blob/main/docs/legal/NOTICE.md)
for full attribution.

---

## Links

- Website: <https://relay.dev>
- Dashboard: <https://app.relay.dev>
- Pricing: <https://relay.dev/pricing>
- Enterprise docs: <https://github.com/star-enterprise-solution/relay-workspace/tree/main/docs/enterprise>
- Source code: <https://github.com/star-enterprise-solution/relay>
- Issues: <https://github.com/star-enterprise-solution/relay/issues>
- Contact: hello@relay.dev
