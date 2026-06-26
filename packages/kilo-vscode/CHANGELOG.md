# Relay — Changelog

Relay is a fork of [Kilo Code](https://github.com/Kilo-Org/kilocode) (MIT)
with substantial modifications. This changelog covers Relay-specific
releases. Upstream Kilo history is preserved in the git log of the source
repository.

---

## 0.1.1 — 2026-06-25

**First publishable build.** Supersedes the v0.1.0 draft after a smoke
test surfaced three phone-home string literals leftover in the bundle.

### Fixed
- Pin `KILO_DEFAULT_CHAT_URL` and `KILO_DEFAULT_EVENT_SERVICE_URL` to
  empty defaults (used to be `chat.kiloapps.io` / `events.kiloapps.io`).
- Pin `INGEST_BASE` in cloud-sessions.ts to empty default (used to be
  `ingest.kilosessions.ai`).
- Pin marketplace `BASE_URL` to empty default and guard fetch helpers to
  return `[]` when unconfigured (used to be `api.kilo.ai/api/marketplace`).
- Result: bundle grep-clean for every `kilo.ai` / `kiloapps.io` /
  `kilosessions.ai` literal.

### Verified at this version
- Identity manifest: `star-enterprise-solution.relay@0.1.1`.
- 251 files in the .vsix (Mach-O arm64 build is ~104 MB).
- VS Code 1.126 activates the extension via `onStartupFinished`
  without errors.
- 61/61 contributed commands carry the `relay.*` prefix.

---

## 0.1.0 — 2026-06-25 (DRAFT, not published)

First end-to-end run of the build → release pipeline. The draft release
exists for the audit trail but should not be promoted to public.

### Changed from upstream Kilo Code
- **Provider runtime** points at the Relay LiteLLM gateway instead of
  `api.kilo.ai`. Package renamed `@kilocode/kilo-gateway` →
  `@relay/llm-provider`.
- **HTTP API group** (`/kilo/profile`, `/kilo/balance`, `/kilo/claw`,
  `/kilo/cloud/*`, `/kilo/notifications`, etc.) stubbed to HTTP 401 — no
  endpoint can leak to Kilo's commercial backend.
- **`kilo-telemetry`** stubbed to no-op. Removes the bundled PostHog
  write key.
- **`session-export`** worker pipeline retired (used to ship full session
  payloads to `supermassive-black-hole.kiloapps.io`).
- **`kilo-sessions`** ingest + token-validity beacon retired (used to ping
  `${KILO_API_BASE}/api/user` every 15 minutes).
- **`HTTP-Referer` / `X-Title`** rebranded from `Kilo Code` to `Relay`
  across all 6 providers in `packages/core/src/plugin/provider/*.ts`.
- **`$schema`** in user config files repointed from
  `https://app.kilo.ai/config.json` to `https://relay.dev/config.json`.
- **414 command IDs** rebranded `kilo-code.*` → `relay.*`.
- **Manifest**: publisher `star-enterprise-solution`, name `relay`,
  display name `Relay: Resilient AI Coding Agent`.

### Added
- Two GitHub Actions workflows:
  - `build-vsix.yml` — packages a `.vsix` on every `v*` tag and creates
    a draft GitHub Release with `generate_release_notes`.
  - `publish.yml` — listens for `release: published` and publishes to the
    VS Code Marketplace + Open VSX in parallel jobs gated by separate
    Environments.

---

For Kilo Code's pre-fork history (versions 7.3.54 and earlier), see
the upstream changelog at
<https://github.com/Kilo-Org/kilocode/blob/main/packages/kilo-vscode/CHANGELOG.md>.
