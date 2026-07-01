import { Component, createSignal, onCleanup, onMount, Show } from "solid-js"
import { Button } from "@kilocode/kilo-ui/button"
import { useVSCode } from "../../context/vscode"

type TestResult =
	| { ok: true; modelCount: number }
	| { ok: false; error: string }
	| null

const RelayTab: Component = () => {
	const vscode = useVSCode()

	const [gatewayUrl, setGatewayUrl] = createSignal("")
	const [virtualKey, setVirtualKey] = createSignal("")
	const [reveal, setReveal] = createSignal(false)
	const [testing, setTesting] = createSignal(false)
	const [testResult, setTestResult] = createSignal<TestResult>(null)
	const [saving, setSaving] = createSignal(false)
	const [savedNotice, setSavedNotice] = createSignal(false)
	const [saveError, setSaveError] = createSignal<string | null>(null)

	const dispose = vscode.onMessage((msg: unknown) => {
		if (typeof msg !== "object" || msg === null || !("type" in msg)) return
		const m = msg as { type: string; [k: string]: unknown }
		switch (m.type) {
			case "relay/config":
				setGatewayUrl(String(m.gatewayUrl ?? ""))
				setVirtualKey(m.virtualKey == null ? "" : String(m.virtualKey))
				return
			case "relay/testResult":
				setTesting(false)
				setTestResult(
					m.ok === true
						? { ok: true, modelCount: typeof m.modelCount === "number" ? m.modelCount : 0 }
						: { ok: false, error: String(m.error ?? "Unknown error") },
				)
				return
			case "relay/saved":
				setSaving(false)
				setSavedNotice(true)
				setTimeout(() => setSavedNotice(false), 2000)
				return
			case "relay/saveError":
				setSaving(false)
				setSaveError(String(m.error ?? "Save failed"))
				return
		}
	})
	onCleanup(dispose)

	onMount(() => {
		vscode.postMessage({ type: "relay/getConfig" } as never)
	})

	const onTest = () => {
		setTesting(true)
		setTestResult(null)
		vscode.postMessage({
			type: "relay/testConnection",
			gatewayUrl: gatewayUrl(),
			virtualKey: virtualKey(),
		} as never)
	}

	const onSave = () => {
		setSaving(true)
		setSaveError(null)
		vscode.postMessage({
			type: "relay/saveConfig",
			gatewayUrl: gatewayUrl(),
			virtualKey: virtualKey(),
		} as never)
	}

	const onOpenDashboard = () => {
		vscode.postMessage({ type: "relay/openDashboard" } as never)
	}

	return (
		<div class="relay-tab" style={{ display: "flex", "flex-direction": "column", gap: "16px", "max-width": "560px" }}>
			<p>Connect this extension to your Relay gateway.</p>

			<label style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
				<span>Gateway URL</span>
				<input
					type="url"
					value={gatewayUrl()}
					onInput={(e) => setGatewayUrl(e.currentTarget.value)}
					style={{ padding: "6px 8px" }}
				/>
			</label>

			<label style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
				<span>Virtual key</span>
				<div style={{ display: "flex", gap: "6px" }}>
					<input
						type={reveal() ? "text" : "password"}
						value={virtualKey()}
						onInput={(e) => setVirtualKey(e.currentTarget.value)}
						placeholder="sk-relay-…"
						style={{ flex: 1, padding: "6px 8px" }}
					/>
					<button type="button" onClick={() => setReveal((r) => !r)}>
						{reveal() ? "Hide" : "Show"}
					</button>
				</div>
			</label>

			<div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
				<Button variant="secondary" onClick={onTest} disabled={testing() || !virtualKey()}>
					{testing() ? "Testing…" : "Test connection"}
				</Button>
				<Button variant="primary" onClick={onSave} disabled={saving() || !gatewayUrl()}>
					{saving() ? "Saving…" : "Save"}
				</Button>
				<Button variant="secondary" icon="square-arrow-top-right" onClick={onOpenDashboard}>
					Open Relay Dashboard
				</Button>
			</div>

			<Show when={testResult()}>
				{(r) => (
					<p style={{ color: r().ok ? "var(--color-success, #2b8a3e)" : "var(--color-danger, #c92a2a)" }}>
						{r().ok
							? `Connected. ${(r() as { ok: true; modelCount: number }).modelCount} models available.`
							: `Error: ${(r() as { ok: false; error: string }).error}`}
					</p>
				)}
			</Show>

			<Show when={savedNotice()}>
				<p style={{ color: "var(--color-success, #2b8a3e)" }}>Saved.</p>
			</Show>

			<Show when={saveError()}>
				{(err) => <p style={{ color: "var(--color-danger, #c92a2a)" }}>{err()}</p>}
			</Show>
		</div>
	)
}

export default RelayTab
