# MOI Starter

A full-stack starter for building dApps on **[MOI Protocol](https://docs.moi.technology/)** — a [Next.js](https://nextjs.org/) frontend wired up with [`js-moi-sdk`](https://github.com/sarvalabs/js-moi-sdk), an [Elysia](https://elysiajs.com/) backend, and a [Cocolang](https://cocolang.dev/) LOGIC contract with deploy/invoke scripts pre-configured for the public **Voyage Babylon** RPC.

## Technology

### Shared

- [Biome](https://biomejs.dev/) for linting and formatting
- [bun](https://bun.sh/) for package management, workspaces, and running scripts
- [TypeScript](https://www.typescriptlang.org/) for type safety

### Frontend (`web/`)

- [Next.js](https://nextjs.org/) (16) + React 19
- [Tailwind](https://tailwindcss.com/) (v4) + [CVA](https://cva.style/docs)
- [`js-moi-sdk`](https://github.com/sarvalabs/js-moi-sdk) for MOI Protocol RPC + signing
- [shadcn](https://ui.shadcn.com/) primitives, [sonner](https://sonner.emilkowal.ski/) toasts, [svgr](https://react-svgr.com/) icons
- [Vitest](https://vitest.dev/) for unit tests

### Backend (`server/`)

- [Elysia](https://elysiajs.com/) (Bun-native, TypeScript-first)
- `@elysiajs/cors`, `@elysiajs/swagger`

### Contracts (`contracts/`)

- [Cocolang](https://cocolang.dev/) source (`.coco`) targeting MOI's PISA VM
- Pre-compiled manifest (`Flipper.json`) checked in
- Deploy/invoke scripts in TypeScript on `js-moi-sdk`'s `LogicFactory` and `getLogicDriver`

## Networks

MOI has no public mainnet yet. Two public JSON-RPC endpoints exist today:

| Network | RPC | Status | Explorer | Faucet |
| --- | --- | --- | --- | --- |
| Devnet (default) | `https://dev.voyage-rpc.moi.technology/devnet/` | reachable | <https://voyage.moi.technology/> | <https://voyage.moi.technology/faucet/> |
| Babylon Testnet | `https://voyage-rpc.moi.technology/babylon/` | TCP-timeouts at the time of authoring | <https://voyage.moi.technology/> | <https://voyage.moi.technology/faucet/> |

`js-moi-sdk@0.6.x` ships a `VoyageProvider("babylon")` shortcut that hardcodes the Babylon URL. Because that host has been intermittently unreachable through the 0.6.x → 0.7.x SDK transition, this starter uses `JsonRpcProvider` against the configurable URL in `MOI_NETWORKS` instead. Switch networks via `NEXT_PUBLIC_MOI_NETWORK` (web) or `MOI_NETWORK` (contracts), or override the URL entirely with `NEXT_PUBLIC_MOI_RPC_URL` / `MOI_RPC_URL`.

These constants live in two places — keep them in sync if you add/rename networks:

- `web/app/lib/moi/networks.ts` (frontend)
- `contracts/src/networks.ts` (deploy scripts)

## Getting started

1. Clone the repo and [install bun](https://bun.sh/docs/installation).
2. `bun install` — installs all three workspaces.
3. Grab a funded mnemonic from the [Voyage faucet](https://voyage.moi.technology/faucet/).
4. `cp contracts/.env.example contracts/.env` and paste the mnemonic into `MNEMONIC`.
5. `bun run contracts:deploy` — deploys the example Flipper LOGIC. Copy the printed `LOGIC_ID`.
6. `cp .env.example web/.env.local` and set `NEXT_PUBLIC_LOGIC_ID` to that value.
7. `bun dev` — starts both Next.js (`http://localhost:3000`) and the Elysia API (`http://localhost:3001`).

If you skip steps 3–6 the frontend still boots — it'll render a setup hint where the live demo would otherwise be.

## Project layout

```
.
├── web/                  # Next.js frontend
│   └── app/
│       ├── lib/moi/      # SDK adapter — provider singleton, wallet helpers
│       ├── providers/MoiProvider.tsx
│       ├── hooks/useMoi.ts
│       └── components/wallet/
│           ├── ConnectButton.tsx
│           ├── ConnectModal.tsx
│           └── FlipperPanel.tsx
├── server/               # Elysia API
│   └── src/
├── contracts/            # MOI LOGIC contracts
│   ├── coco/             # Cocolang source + compiled manifest
│   ├── scripts/          # deploy.ts, invoke.ts
│   └── src/networks.ts
├── package.json          # workspaces: web, server, contracts
└── README.md
```

## Wallet model

MOI Protocol does **not** have a first-party browser wallet extension (no `window.moi`, nothing on the Chrome Web Store). The recommended dApp pattern is BYOK — the user pastes a mnemonic and the app instantiates an in-process `Wallet`.

This starter follows that pattern:

- `<MoiProvider>` exposes a shared `VoyageProvider` for read flows.
- `ConnectModal` accepts a 12/24-word mnemonic, validates it (`validateMnemonic` from the SDK), and produces a connected `Wallet` via `Wallet.fromMnemonic(...)`.
- The wallet lives **in memory only** — this starter never persists the mnemonic. If your product needs persistence, add encryption-at-rest on top (e.g. WebCrypto-derived key + IndexedDB) before shipping.

The wired BIP-44 path is `m/44'/6174'/7020'/0/0` — MOI's coin type is `6174`, distinct from Ethereum's `60`.

## Contracts

See [`contracts/README.md`](contracts/README.md) for the LOGIC source and deploy flow.

Common commands from the repo root:

```bash
bun run contracts:deploy     # deploy Flipper to Babylon
bun run contracts:invoke     # smoke test: Get → Flip! → Get
bun run contracts:compile    # rebuild Flipper.json (requires Coco CLI installed)
```

## Scripts

### Root (across workspaces)

```bash
bun dev               # start web (3000) + server (3001) in parallel
bun dev:web           # web only
bun dev:server        # server only
bun build             # build web + server for production
bun type-check        # tsc --noEmit across all workspaces
bun lint              # biome lint
bun format            # biome format (check)
bun clean             # nuke node_modules across the monorepo

bun run contracts:deploy
bun run contracts:invoke
bun run contracts:compile
```

### Frontend (`web/`)

```bash
bun run --filter web dev           # Next.js dev server
bun run --filter web turbo         # dev server with Turbopack
bun run --filter web build         # production build
bun run --filter web start         # production server
bun run --filter web test          # vitest
bun run --filter web build-icons   # regenerate icon components from /icon-svg
```

### Backend (`server/`)

```bash
bun run --filter server dev        # Elysia with hot reload
bun run --filter server build      # production build
bun run --filter server start      # production server
```

## Frontend conventions

The web workspace follows the same conventions as our other XORS starters — barrel exports, `@/` alias to `web/app/*`, Tailwind tokens via shadcn, SVGR for icons. See:

- `web/app/components/` — `<Button>`, `<Text>`, typography, plus `wallet/` for MOI UI.
- `web/app/lib/moi/` — narrow SDK adapter; component code imports from here, not from `js-moi-sdk` directly. Easier to stub for tests and to swap out if MOI ships a browser extension later.

## Why not Foundry?

Foundry targets EVM bytecode. MOI Protocol is **not** EVM-compatible — LOGICs compile to PISA via the Coco toolchain and deploy via plain Node/Bun scripts using `LogicFactory`. There's no Hardhat-equivalent today. This starter therefore wires Bun scripts directly against `js-moi-sdk`.

## License

MIT — see [LICENSE.md](LICENSE.md).
