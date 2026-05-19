"use client"

import { ConnectButton, FlipperPanel } from "@/components"
import { useMoi } from "@/hooks"
import { MOI_NETWORKS } from "@/lib/moi"

export default function Home() {
	const { network } = useMoi()
	const net = MOI_NETWORKS[network]

	return (
		<main className="min-h-dvh bg-background">
			{/* Header */}
			<header className="border-b border-border">
				<div className="container mx-auto flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
							<span className="font-bold text-sm text-background">M</span>
						</div>
						<span className="font-semibold">MOI Starter</span>
						<span className="ml-2 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							{net.name}
						</span>
					</div>
					<nav className="flex items-center gap-4">
						<a
							href={net.explorer}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Explorer
						</a>
						<a
							href={net.faucet}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Faucet
						</a>
						<a
							href="https://docs.moi.technology/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Docs
						</a>
						<ConnectButton />
					</nav>
				</div>
			</header>

			{/* Hero */}
			<section className="container mx-auto px-6 py-20 text-center">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
					<span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
					Next.js + Elysia + js-moi-sdk
				</div>
				<h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
					Ship dApps on
					<br />
					<span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
						MOI Protocol
					</span>
				</h1>
				<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
					A full-stack starter pre-wired for MOI Protocol: Next.js frontend with{" "}
					<code className="rounded bg-muted px-1 font-mono text-base">js-moi-sdk</code>,
					Elysia backend, and a Cocolang LOGIC + deploy scripts targeting the
					Voyage Babylon RPC.
				</p>
				<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
					<span>RPC</span>
					<code className="rounded border border-border bg-card px-2 py-1 font-mono">{net.rpc}</code>
				</div>
			</section>

			{/* Live demo */}
			<section className="border-t border-border bg-muted/30">
				<div className="container mx-auto px-6 py-16">
					<div className="mb-8 text-center">
						<h2 className="text-3xl font-bold">Live demo</h2>
						<p className="mt-2 text-muted-foreground">
							Connect a mnemonic from the{" "}
							<a className="underline hover:text-foreground" href={net.faucet} target="_blank" rel="noopener noreferrer">
								Voyage faucet
							</a>{" "}
							and flip a boolean stored on-chain.
						</p>
					</div>

					<div className="mx-auto max-w-2xl">
						<FlipperPanel />
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border bg-muted/30">
				<div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
					<p className="text-sm text-muted-foreground">
						Built on{" "}
						<a className="underline hover:text-foreground" href="https://docs.moi.technology/" target="_blank" rel="noopener noreferrer">
							MOI Protocol
						</a>{" "}
						with Next.js + Elysia.
					</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<a className="hover:text-foreground" href="https://github.com/sarvalabs/js-moi-sdk" target="_blank" rel="noopener noreferrer">
							SDK
						</a>
						<a className="hover:text-foreground" href="https://cocolang.dev" target="_blank" rel="noopener noreferrer">
							Cocolang
						</a>
						<a className="hover:text-foreground" href="https://github.com/sarvalabs/js-moi-examples" target="_blank" rel="noopener noreferrer">
							Examples
						</a>
					</div>
				</div>
			</footer>
		</main>
	)
}
