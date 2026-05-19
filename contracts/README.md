# contracts

MOI Protocol LOGIC contracts (Cocolang) and deploy scripts for this starter.

## What's here

```
contracts/
├── coco/
│   ├── Flipper.coco      # Cocolang source for the example LOGIC
│   ├── coco.nut          # Coco build config
│   └── Flipper.json      # Pre-compiled MOI manifest (PISA, JSON format)
├── scripts/
│   ├── deploy.ts         # Deploy Flipper to Babylon testnet
│   └── invoke.ts         # Smoke-test the deployed LOGIC (Get + Flip!)
└── src/
    └── networks.ts       # MOI network constants (RPC, explorer, faucet)
```

The Flipper LOGIC is adapted from
[`sarvalabs/js-moi-examples`](https://github.com/sarvalabs/js-moi-examples/tree/main/Flipper)
— a minimal boolean state contract with `Init!`, `Seed!`, `Flip!`, and `Get`
endpoints. The manifest is checked in so the starter is deployable end-to-end
without installing the Coco toolchain first.

## Deploy

```bash
cp .env.example .env       # fill in MNEMONIC (fund it via the Voyage faucet)
bun run deploy
```

The deploy script prints `LOGIC_ID = …`. Paste that value into:

- `contracts/.env` — so `bun run invoke` can find it.
- `web/.env.local` (or the repo root `.env`) as `NEXT_PUBLIC_LOGIC_ID` — so
  the frontend can wire it into the demo UI.

Faucet: <https://voyage.moi.technology/faucet/> (login required, dispenses
20K KMOI per request).
Explorer: <https://voyage.moi.technology/>.

## Smoke-test the deployment

```bash
bun run invoke
```

This calls `Get`, then `Flip!`, then `Get` again, printing each result.

## Modifying the LOGIC

The Coco CLI is not yet on npm. To iterate on `Flipper.coco`:

1. Install the `coco` toolchain — see <https://cocolang.dev>.
2. `cd contracts/coco && coco compile`
3. The build overwrites `Flipper.json` (the manifest the deploy script imports).

If you change the module name or output filename in `coco.nut`, update the
import path in `scripts/deploy.ts` and `scripts/invoke.ts` to match.

## Why not Foundry?

Foundry targets EVM bytecode. MOI Protocol is not EVM-compatible — LOGICs
compile to PISA (MOI's VM target) via the Coco toolchain. The deploy story
here is plain Node/Bun scripts using `js-moi-sdk`'s `LogicFactory`.
