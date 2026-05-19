"use client"

import { useContext } from "react"
import { MoiContext, type MoiContextValue } from "@/providers/MoiProvider"

/**
 * Access the MOI provider/wallet context. Throws if used outside <MoiProvider>
 * because the alternative — a silent `null` — produces hard-to-debug failures
 * downstream.
 */
export function useMoi(): MoiContextValue {
	const ctx = useContext(MoiContext)
	if (!ctx) {
		throw new Error("useMoi must be used inside <MoiProvider> (see app/layout.tsx).")
	}
	return ctx
}
