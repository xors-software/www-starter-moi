/**
 * Singleton JsonRpcProvider for read-only RPC access.
 *
 * Read flows share this provider so we hold a single fetch agent across the
 * app. Write flows pass the user's connected `Wallet`, which carries its own
 * provider after `wallet.connect(provider)`.
 *
 * We use `JsonRpcProvider` rather than `VoyageProvider("babylon")` because the
 * SDK's hardcoded babylon URL has been unreachable from a number of networks
 * during the 0.6.x → 0.7.x transition. See `./networks.ts` for the working URL
 * defaults and override semantics.
 */

import { JsonRpcProvider } from "js-moi-sdk"
import { DEFAULT_NETWORK, MOI_NETWORKS, type MoiNetworkId, RPC_URL_OVERRIDE } from "./networks"

let cached: { url: string; provider: JsonRpcProvider } | null = null

export function getMoiProvider(network: MoiNetworkId = DEFAULT_NETWORK): JsonRpcProvider {
	const url = RPC_URL_OVERRIDE ?? MOI_NETWORKS[network].rpc
	if (!cached || cached.url !== url) {
		cached = { url, provider: new JsonRpcProvider(url) }
	}
	return cached.provider
}
