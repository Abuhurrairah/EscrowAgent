# EscrowAgent

EscrowAgent is a local-first hackathon escrow dApp for freelance task payments. A client creates a task, funds it with ETH, the worker submits proof as a URL plus content hash, and the client either releases funds or refunds after the deadline.

## Features

- Next.js frontend with Tailwind and a clean demo-ready UI
- Solidity escrow contract with Hardhat
- MetaMask wallet connect for local testing
- Core flow pages:
  - Create Task
  - Fund Task
  - Submit Work
  - Approve Release
  - Task Details
- Deadline per task
- Client refund after deadline if the task is funded but not released
- On-chain task status tracking:
  - created
  - funded
  - work submitted
  - released
  - refunded
- Task ID surfaced from the `TaskCreated` event
- Lightweight AI agreement generator with OpenAI support and mock fallback

## Architecture

- Frontend: Next.js App Router in `app/`
- Shared UI: `components/`
- Contract helpers and task formatting: `lib/`
- Solidity contract: `contracts/EscrowAgent.sol`
- Hardhat config and deploy script:
  - `hardhat.config.ts`
  - `scripts/deploy.ts`
- AI agreement route: `app/api/agreement/route.ts`

## Local setup

Prerequisites:

- Node.js 20+
- MetaMask in your browser

Install dependencies:

```bash
npm install
```

Copy environment defaults if needed:

```bash
copy .env.example .env.local
```

`OPENAI_API_KEY` is optional. If it is not set, the AI agreement generator uses a mock response so the demo still works.

## Compile, deploy, run

1. Compile the contract:

```bash
npx hardhat compile
```

2. Start a local Hardhat node:

```bash
npx hardhat node
```

3. In a second terminal, deploy to localhost:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

The deploy script automatically writes the deployed address to `.env.local` as:

```bash
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
```

4. Start the frontend:

```bash
npm run dev
```

5. Open the app:

```bash
http://localhost:3000
```

## MetaMask local network setup

Add a custom network in MetaMask with:

- Network name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

## Import Hardhat test accounts into MetaMask

When `npx hardhat node` starts, it prints funded test accounts and private keys.

Import at least two accounts into MetaMask:

- Account 1: use as the client
- Account 2: use as the worker

In MetaMask:

1. Click the account menu.
2. Choose `Import Account`.
3. Paste one of the private keys from the Hardhat node output.

## Demo flow

1. Connect MetaMask in the app using the client wallet.
2. Open `Create Task`.
3. Optionally generate an agreement draft from a plain-English brief.
4. Enter the worker wallet, budget, and deadline.
5. Create the task and note the displayed task ID.
6. Fund the task from the client wallet on `Fund Task`.
7. Switch MetaMask to the worker wallet.
8. Submit proof URL and proof hash on `Submit Work`.
9. Switch back to the client wallet.
10. Review the task on `Task Details`.
11. Approve release on `Approve Release`.

Refund demo:

1. Create and fund a task with a short deadline.
2. Wait until the deadline passes.
3. Open `Task Details`.
4. Load the task and click `Refund After Deadline`.

## AI agreement generator

The agreement generator accepts a plain-English task brief and returns:

- title
- worker role
- budget suggestion
- deadline suggestion
- acceptance criteria
- short agreement summary

If `OPENAI_API_KEY` is missing or the live request fails, the route falls back to a deterministic mock response so the demo stays usable.

## Hackathon positioning

EscrowAgent is intentionally simple:

- no database
- no authentication
- no dispute resolution layer
- no off-chain job queue

That makes it strong for demos:

- easy to explain
- fully local
- visible on-chain state
- real MetaMask interactions
- clear AI-assisted story for turning briefs into escrow tasks

## Notes

- Manual browser and MetaMask interaction is still required for wallet connection, account switching, and transaction confirmation.
- The AI agreement generator is assistive only. It does not auto-enforce acceptance criteria on-chain.
