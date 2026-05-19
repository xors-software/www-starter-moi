/**
 * MOI Protocol network configuration for the frontend.
 *
 * The `js-moi-sdk` `VoyageProvider("babylon")` shortcut hardcodes
 * `https://voyage-rpc.moi.technology/babylon/`, which at the time this starter
 * was authored was returning TCP connect timeouts from multiple networks.
 * To keep the starter usable out of the box we default to MOI's `devnet`
 * endpoint via `JsonRpcProvider`, with the `babylon` URL listed as a fallback.
 *
 * Override with `NEXT_PUBLIC_MOI_RPC_URL` to point at any MOI JSON-RPC host
 * (e.g. a self-hosted node or a future mainnet endpoint).
 *
 * Source of truth for these constants is mirrored in `contracts/src/networks.ts`
 * — keep them in sync.
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

const ENV_NETWORK = process.env.NEXT_PUBLIC_MOI_NETWORK as MoiNetworkId | undefined
export const DEFAULT_NETWORK: MoiNetworkId =
	ENV_NETWORK && ENV_NETWORK in MOI_NETWORKS ? ENV_NETWORK : "devnet"

export const RPC_URL_OVERRIDE: string | undefined =
	process.env.NEXT_PUBLIC_MOI_RPC_URL && process.env.NEXT_PUBLIC_MOI_RPC_URL.length > 0
		? process.env.NEXT_PUBLIC_MOI_RPC_URL
		: undefined

/** BIP-44 derivation path for the 0th MOI account (coin type 6174). */
export const DEFAULT_DERIVATION_PATH = "m/44'/6174'/7020'/0/0"
