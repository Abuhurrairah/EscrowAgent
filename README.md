# EscrowAgent

## What it is
EscrowAgent is an AI-assisted escrow dApp for freelance tasks. A client creates a task, locks ETH in a smart contract, the worker submits proof of work, and the client releases payment. If the deadline passes, the client can refund the escrow.

## Problem
Online freelance work depends on trust. Clients do not want to pay before work is delivered, and workers do not want to work without proof that payment is reserved.

## Solution
EscrowAgent uses a smart contract as a neutral enforcement layer:
- client creates task
- client funds escrow
- worker submits proof URL + proof hash
- client approves release
- client can refund after deadline if conditions are unmet

## Why this matters
This fits the “Agents that cooperate” theme because it lets two parties coordinate around a neutral onchain commitment instead of trusting a centralized platform.

## Features
- Create task with worker address, amount, and deadline
- Fund escrow in ETH
- Submit work proof
- Approve release
- Refund after deadline
- Task details/status view
- AI agreement assist for structured task drafting

## Tech stack
- Next.js
- Tailwind CSS
- Solidity
- Hardhat
- MetaMask
- Local Hardhat network for demo/testing

## How it works
1. Client creates a task
2. Smart contract stores terms
3. Client funds escrow
4. Worker submits proof
5. Client approves release
6. Or client refunds after deadline

## Local setup
1. npm install
2. npx hardhat compile
3. npx hardhat node
4. npx hardhat run scripts/deploy.ts --network localhost
5. add deployed contract address to .env.local
6. npm run dev

## MetaMask local setup
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH
- Import two Hardhat accounts: client and worker

## Demo flows
### Happy path
Create → Fund → Submit → Approve

### Protection path
Create → Fund → Wait until deadline → Refund

## Limitations
- Built for hackathon MVP/demo use
- Local network demo first
- No advanced dispute arbitration yet
- No production security audit
