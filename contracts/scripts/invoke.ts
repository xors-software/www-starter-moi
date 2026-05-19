/**
 * Smoke-test the deployed Flipper LOGIC.
 *
 * 1. Reads current value via the `Get` read endpoint.
 * 2. Calls `Flip!` to mutate it.
 * 3. Reads again and prints both values.
 *
 * Requires LOGIC_ID (from `bun run deploy`) and MNEMONIC in contracts/.env.
 */

import { getLogicDriver, JsonRpcProvider, Wallet } from "js-moi-sdk"
import {
	DEFAULT_DERIVATION_PATH,
	DEFAULT_NETWORK,
	MOI_NETWORKS,
	type MoiNetworkId,
	resolveRpcUrl,
} from "../src/networks"

async function main() {
	const logicId = process.env.LOGIC_ID
	if (!logicId) {
		throw new Error("LOGIC_ID is not set. Deploy first with `bun run deploy` and paste the printed value into contracts/.env.")
	}

	const mnemonic = process.env.MNEMONIC
	if (!mnemonic) {
		throw new Error("MNEMONIC is not set.")
	}

	const network = (process.env.MOI_NETWORK || DEFAULT_NETWORK) as MoiNetworkId
	const rpcUrl = resolveRpcUrl(network)
	const provider = new JsonRpcProvider(rpcUrl)
	const wallet = await Wallet.fromMnemonic(mnemonic, DEFAULT_DERIVATION_PATH)
	wallet.connect(provider)

	console.log(`→ Network:  ${MOI_NETWORKS[network].name}`)
	console.log(`→ RPC:      ${rpcUrl}`)
	console.log(`→ Signer:   ${wallet.address}`)
	console.log(`→ Logic:    ${logicId}`)

	const driver = await getLogicDriver(logicId, wallet)

	const before = await driver.routines.Get()
	console.log(`→ Get() before: ${JSON.stringify(before)}`)

	const ix = await driver.routines.Flip()
	const result = await (typeof ix.result === "function" ? ix.result() : ix)
	console.log(`→ Flip!() result: ${JSON.stringify(result)}`)

	const after = await driver.routines.Get()
	console.log(`→ Get() after:  ${JSON.stringify(after)}`)
}

main().catch((err) => {
	console.error("✗ Invoke failed:", err?.message ?? err)
	process.exit(1)
})
