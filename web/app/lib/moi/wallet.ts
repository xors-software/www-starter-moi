/**
 * Wallet helpers — thin wrappers around `js-moi-sdk` so component code never
 * imports the SDK directly. Keeping this surface narrow makes it easier to
 * stub for tests and to swap implementations if/when MOI ships a browser
 * extension or a hosted signer.
 */

import { validateMnemonic, Wallet, type AbstractProvider } from "js-moi-sdk"
import { DEFAULT_DERIVATION_PATH } from "./networks"

export { Wallet }

export function isValidMnemonic(mnemonic: string): boolean {
	try {
		return validateMnemonic(mnemonic.trim())
	} catch {
		return false
	}
}

/**
 * Build a connected Wallet from a 12/24-word mnemonic.
 *
 * The wallet is purely in-memory — see the wallet-model section of the root
 * README. We never persist the mnemonic from this starter; layer encrypted
 * storage on top if your product needs to remember the user across reloads.
 */
export async function walletFromMnemonic(
	mnemonic: string,
	provider: AbstractProvider,
	path: string = DEFAULT_DERIVATION_PATH,
): Promise<Wallet> {
	const trimmed = mnemonic.trim()
	if (!isValidMnemonic(trimmed)) {
		throw new Error("Invalid mnemonic phrase.")
	}
	const wallet = await Wallet.fromMnemonic(trimmed, path)
	wallet.connect(provider)
	return wallet
}

/** Short hex-style address abbreviation, e.g. 0xabcd…ef01. */
export function shortenAddress(address: string, head = 6, tail = 4): string {
	if (!address) return ""
	if (address.length <= head + tail + 1) return address
	return `${address.slice(0, head)}…${address.slice(-tail)}`
}
