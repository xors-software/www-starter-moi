"use client"

import { createContext, useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { Wallet } from "js-moi-sdk"
import {
	DEFAULT_NETWORK,
	getMoiProvider,
	type MoiNetworkId,
	walletFromMnemonic,
} from "@/lib/moi"

export type MoiContextValue = {
	network: MoiNetworkId
	provider: ReturnType<typeof getMoiProvider>
	wallet: Wallet | null
	address: string | null
	isConnected: boolean
	/** Import a mnemonic and produce a connected Wallet stored in context. */
	connectWithMnemonic: (mnemonic: string) => Promise<void>
	disconnect: () => void
}

export const MoiContext = createContext<MoiContextValue | null>(null)

export function MoiProvider({
	children,
	network = DEFAULT_NETWORK,
}: {
	children: ReactNode
	network?: MoiNetworkId
}) {
	const provider = useMemo(() => getMoiProvider(network), [network])
	const [wallet, setWallet] = useState<Wallet | null>(null)
	const [address, setAddress] = useState<string | null>(null)

	const connectWithMnemonic = useCallback(
		async (mnemonic: string) => {
			const next = await walletFromMnemonic(mnemonic, provider)
			setWallet(next)
			setAddress(next.address)
		},
		[provider],
	)

	const disconnect = useCallback(() => {
		setWallet(null)
		setAddress(null)
	}, [])

	const value = useMemo<MoiContextValue>(
		() => ({
			network,
			provider,
			wallet,
			address,
			isConnected: wallet !== null,
			connectWithMnemonic,
			disconnect,
		}),
		[network, provider, wallet, address, connectWithMnemonic, disconnect],
	)

	return <MoiContext.Provider value={value}>{children}</MoiContext.Provider>
}
