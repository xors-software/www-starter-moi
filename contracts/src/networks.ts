/**
 * MOI Protocol network endpoints used by the deploy/invoke scripts.
 *
 * The `js-moi-sdk` `VoyageProvider("babylon")` shortcut hardcodes
 * `https://voyage-rpc.moi.technology/babylon/`, which at the time this starter
 * was authored was returning TCP connect timeouts from multiple networks. The
 * scripts therefore wire `JsonRpcProvider` against the working `devnet` URL by
 * default, with `babylon` listed as an alternative.
 *
 * Override with the `MOI_RPC_URL` env var to point at any JSON-RPC host
 * (self-hosted node, future mainnet, etc.).
 *
 * Source of truth is mirrored in `web/app/lib/moi/networks.ts` — keep both in
 * sync.
 */

export const MOI_NETWORKS = {
	babylon: {
		name: "Babylon Testnet",
		shortcut: "babylon" as const,
		rpc: "https://voyage-rpc.moi.technology/babylon/",
		explorer: "https://voyage.moi.technology/",
		faucet: "https://voyage.moi.technology/faucet/",
	},
	devnet: {
		name: "Devnet",
		shortcut: "devnet" as const,
		rpc: "https://dev.voyage-rpc.moi.technology/devnet/",
		explorer: "https://voyage.moi.technology/",
		faucet: "https://voyage.moi.technology/faucet/",
	},
} as const

export type MoiNetworkId = keyof typeof MOI_NETWORKS

export const DEFAULT_NETWORK: MoiNetworkId = "devnet"

/** BIP-44 derivation path for the 0th MOI account (coin type 6174). */
export const DEFAULT_DERIVATION_PATH = "m/44'/6174'/7020'/0/0"

export function resolveRpcUrl(network: MoiNetworkId): string {
	const override = process.env.MOI_RPC_URL
	if (override && override.length > 0) return override
	return MOI_NETWORKS[network].rpc
}
