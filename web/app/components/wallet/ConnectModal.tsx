"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { useMoi } from "@/hooks/useMoi"
import { isValidMnemonic } from "@/lib/moi"

type Props = {
	isOpen: boolean
	onClose: () => void
}

/**
 * Minimal mnemonic-import modal. MOI has no first-party browser wallet
 * extension yet, so the recommended dApp pattern is BYOK mnemonic. The
 * mnemonic is kept in memory only — never persisted by this starter.
 */
export function ConnectModal({ isOpen, onClose }: Props) {
	const { connectWithMnemonic } = useMoi()
	const [mnemonic, setMnemonic] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	if (!isOpen) return null

	const handleConnect = async () => {
		setError(null)
		const trimmed = mnemonic.trim()
		if (!isValidMnemonic(trimmed)) {
			setError("That doesn't look like a valid 12/24-word mnemonic.")
			return
		}
		setSubmitting(true)
		try {
			await connectWithMnemonic(trimmed)
			setMnemonic("")
			onClose()
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to connect.")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Connect MOI wallet"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose()
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose()
			}}
		>
			<div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
				<h2 className="text-xl font-semibold">Connect a MOI wallet</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Paste a 12 or 24-word mnemonic. It stays in this tab's memory and is
					never persisted by this starter. Get a funded testnet mnemonic from
					the{" "}
					<a
						className="underline hover:text-foreground"
						href="https://voyage.moi.technology/faucet/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Voyage faucet
					</a>
					.
				</p>

				<label htmlFor="mnemonic" className="mt-4 block text-xs font-medium text-muted-foreground">
					Mnemonic phrase
				</label>
				<textarea
					id="mnemonic"
					className="mt-1 h-24 w-full resize-none rounded-md border border-border bg-background p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
					value={mnemonic}
					onChange={(e) => setMnemonic(e.target.value)}
					placeholder="word1 word2 word3 …"
					autoComplete="off"
					spellCheck={false}
				/>
				{error && (
					<p className="mt-2 text-sm text-red-600" role="alert">
						{error}
					</p>
				)}

				<div className="mt-4 flex items-center justify-end gap-2">
					<Button variant="outline" onClick={onClose} disabled={submitting}>
						Cancel
					</Button>
					<Button onClick={handleConnect} disabled={submitting || mnemonic.trim().length === 0}>
						{submitting ? "Connecting…" : "Connect"}
					</Button>
				</div>
			</div>
		</div>
	)
}
