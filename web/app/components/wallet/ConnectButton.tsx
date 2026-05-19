"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { useMoi } from "@/hooks/useMoi"
import { shortenAddress } from "@/lib/moi"
import { ConnectModal } from "./ConnectModal"

export function ConnectButton() {
	const { isConnected, address, disconnect } = useMoi()
	const [open, setOpen] = useState(false)

	if (isConnected && address) {
		return (
			<div className="flex items-center gap-2">
				<span
					className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs"
					title={address}
				>
					{shortenAddress(address)}
				</span>
				<Button variant="outline" size="small" onClick={disconnect}>
					Disconnect
				</Button>
			</div>
		)
	}

	return (
		<>
			<Button onClick={() => setOpen(true)} size="default">
				Connect wallet
			</Button>
			<ConnectModal isOpen={open} onClose={() => setOpen(false)} />
		</>
	)
}
