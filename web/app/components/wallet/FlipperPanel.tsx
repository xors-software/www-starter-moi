"use client"

import { useCallback, useEffect, useState } from "react"
import { getLogicDriver } from "js-moi-sdk"
import { Button } from "@/components/Button"
import { useMoi } from "@/hooks/useMoi"

const LOGIC_ID = process.env.NEXT_PUBLIC_LOGIC_ID ?? ""

/**
 * Live demo panel — drives the deployed Flipper LOGIC.
 *
 * The 0.6.x `getLogicDriver(logicId, signer)` runtime expects a Signer (it
 * calls `signer.getProvider().getLogicManifest(...)`), so all driver calls —
 * including the read — require a connected wallet.
 *
 * States rendered:
 *   - LOGIC_ID not set → setup hint pointing at the deploy script.
 *   - LOGIC_ID set, no wallet → CTA to connect.
 *   - LOGIC_ID set, wallet connected → Get + Flip controls.
 */
export function FlipperPanel() {
	const { wallet, isConnected } = useMoi()
	const [value, setValue] = useState<boolean | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		if (!LOGIC_ID || !wallet) return
		setError(null)
		try {
			const driver = await getLogicDriver(LOGIC_ID, wallet)
			const result = await driver.routines.Get()
			const next =
				typeof result === "object" && result !== null && "value" in result
					? Boolean((result as { value: unknown }).value)
					: Boolean(result)
			setValue(next)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Read failed.")
		}
	}, [wallet])

	useEffect(() => {
		if (LOGIC_ID && wallet) {
			void refresh()
		} else {
			setValue(null)
		}
	}, [refresh, wallet])

	const flip = useCallback(async () => {
		if (!wallet) return
		setError(null)
		setLoading(true)
		try {
			const driver = await getLogicDriver(LOGIC_ID, wallet)
			const ix = await driver.routines.Flip()
			if (ix && typeof (ix as { result?: () => Promise<unknown> }).result === "function") {
				await (ix as { result: () => Promise<unknown> }).result()
			}
			await refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : "Flip failed.")
		} finally {
			setLoading(false)
		}
	}, [wallet, refresh])

	if (!LOGIC_ID) {
		return (
			<div className="rounded-xl border border-dashed border-border bg-card p-6">
				<h3 className="font-semibold">Deploy the example LOGIC</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Set <code className="rounded bg-muted px-1">NEXT_PUBLIC_LOGIC_ID</code>{" "}
					to wire this panel to a deployed Flipper. Run{" "}
					<code className="rounded bg-muted px-1">bun run contracts:deploy</code>{" "}
					and paste the printed value into <code className="rounded bg-muted px-1">web/.env.local</code>.
				</p>
			</div>
		)
	}

	if (!isConnected) {
		return (
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="font-semibold">Flipper LOGIC</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Connect a wallet (top right) to read and flip the boolean stored at{" "}
					<code className="rounded bg-muted px-1 font-mono">{LOGIC_ID.slice(0, 10)}…</code>.
				</p>
			</div>
		)
	}

	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="font-semibold">Flipper LOGIC</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						State.value · read from <code className="rounded bg-muted px-1 font-mono">{LOGIC_ID.slice(0, 10)}…</code>
					</p>
				</div>
				<div
					className={
						"flex h-12 w-12 items-center justify-center rounded-lg font-mono text-sm " +
						(value === null
							? "bg-muted text-muted-foreground"
							: value
								? "bg-green-500/15 text-green-700"
								: "bg-red-500/15 text-red-700")
					}
				>
					{value === null ? "…" : String(value)}
				</div>
			</div>
			{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
			<div className="mt-4 flex items-center gap-2">
				<Button variant="outline" size="default" onClick={refresh} disabled={loading}>
					Refresh
				</Button>
				<Button size="default" onClick={flip} disabled={loading}>
					{loading ? "Flipping…" : "Flip!"}
				</Button>
			</div>
		</div>
	)
}
