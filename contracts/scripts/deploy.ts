/**
 * Deploy the Flipper LOGIC to MOI Protocol.
 *
 * Usage:
 *   1. cp .env.example .env  (fill in MNEMONIC)
 *   2. bun run deploy
 *
 * On success the script prints the LOGIC_ID — paste it into `.env` (contracts/
 * and web/) so the invoke script and the web frontend can target the deployed
 * instance.
 *
 * Override the RPC URL with MOI_RPC_URL or the network with MOI_NETWORK
 * (`devnet` | `babylon`). See `src/networks.ts` for why we default to `devnet`.
 */

import type { LogicManifest } from "js-moi-manifest"
import { JsonRpcProvider, LogicFactory, Wallet } from "js-moi-sdk"
import manifest from "../coco/Flipper.json"
import {
	DEFAULT_DERIVATION_PATH,
	DEFAULT_NETWORK,
	MOI_NETWORKS,
	type MoiNetworkId,
	resolveRpcUrl,
} from "../src/networks"

async function main() {
	const mnemonic = process.env.MNEMONIC
	if (!mnemonic) {
		throw new Error(
			"MNEMONIC is not set. Copy contracts/.env.example to contracts/.env and fill in a funded mnemonic (https://voyage.moi.technology/faucet/).",
		)
	}

	const network = (process.env.MOI_NETWORK || DEFAULT_NETWORK) as MoiNetworkId
	if (!(network in MOI_NETWORKS)) {
		throw new Error(`Unsupported MOI_NETWORK="${network}". Known: ${Object.keys(MOI_NETWORKS).join(", ")}`)
	}
	const rpcUrl = resolveRpcUrl(network)

	console.log(`→ Network:  ${MOI_NETWORKS[network].name}`)
	console.log(`→ RPC:      ${rpcUrl}`)

	const provider = new JsonRpcProvider(rpcUrl)
	const wallet = await Wallet.fromMnemonic(mnemonic, DEFAULT_DERIVATION_PATH)
	wallet.connect(provider)

	console.log(`→ Deployer: ${wallet.address}`)

	// `Seed!(initial Bool)` is the seeded constructor defined in Flipper.coco.
	// The double-cast through unknown is intentional: the Coco compiler emits
	// `"syntax": "0.1.0"` (string) while the SDK 0.6.x type declares
	// `syntax: number`. The runtime accepts the string, the types lag.
	const factory = new LogicFactory(manifest as unknown as LogicManifest.Manifest, wallet)
	const ix = await factory.deploy("Seed!", true)
	console.log("→ Submitted deploy interaction — waiting for receipt…")

	const receipt = await ix.wait()
	// `logic_id` lives in the LogicDeployResult of the first op. The older
	// sarvalabs examples read `receipt.extra_data.logic_id` instead — some
	// node versions still populate that path, so we check both for safety.
	const opResult = receipt.ix_operations?.[0]?.data as { logic_id?: string } | undefined
	const legacyExtra = (receipt as { extra_data?: { logic_id?: string } }).extra_data
	const logicId = opResult?.logic_id ?? legacyExtra?.logic_id
	if (!logicId) {
		console.error("Deploy receipt did not include a logic_id:", JSON.stringify(receipt, null, 2))
		process.exit(1)
	}

	console.log("✓ Deployed Flipper")
	console.log(`  LOGIC_ID = ${logicId}`)
	console.log(`  Explorer = ${MOI_NETWORKS[network].explorer}`)
	console.log("\nPaste LOGIC_ID into:")
	console.log("  - contracts/.env (for `bun run invoke`)")
	console.log("  - web/.env.local as NEXT_PUBLIC_LOGIC_ID (for the frontend)")
}

main().catch((err) => {
	console.error("✗ Deploy failed:", err?.message ?? err)
	process.exit(1)
})
