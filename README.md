# FUEL

FUEL is project payout automation for distributed teams. Receive one client payment, split it automatically, and pay collaborators globally.

This repo contains the current React prototype for the FUEL product concept. The app is intentionally fiat-first: users see projects, balances, splits, activity, and payout statuses while stablecoin/Solana settlement stays behind the scenes.

## What It Does Today

- Landing page with FUEL positioning and demo flow entry point.
- Prototype login with username login and demo Google login.
- Dashboard with project balances and local transaction metrics.
- Project creation with collaborator split rules.
- Receive funds simulation for a client payment.
- Split preview showing platform fee and each recipient payout.
- Payout confirmation that writes status history.
- Activity feed with persisted transactions.
- Local browser persistence for projects, user session, and transactions.

## Prototype Scope

This is not a production payments app yet. The current version does not move real money, perform real Google OAuth, or create production Solana wallets. It is a clickable MVP meant to validate the workflow:

1. Create a project.
2. Add contributors and payout percentages.
3. Simulate receiving client funds.
4. Preview the automatic split.
5. Confirm payouts.
6. Review activity and payout status history.

## Tech Stack

- React
- Create React App / react-scripts
- Browser `localStorage` for prototype persistence
- Demo Solana wallet helper for devnet-style wallet addresses

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Auth Notes

The current Google login button is a demo path, not real Google OAuth. Real auth should be added through Firebase Auth, Supabase Auth, Auth0, or Google Identity Services with a configured client ID.

## Persistence Notes

The prototype persists these objects in browser localStorage:

- `fuel-user`
- `fuel-projects`
- `fuel-transactions`

This is enough for demos and validation. A later production version should move persistence to Supabase, Firebase, or a dedicated backend with proper auth, auditing, and payment state guarantees.

## Next Production Steps

- Replace demo auth with real authentication.
- Add backend persistence and transaction state machines.
- Integrate regulated fiat payment and payout providers.
- Integrate stablecoin settlement through compliant infrastructure.
- Add KYC/KYB, compliance screening, and tax/reporting workflows.
- Add real accounting exports and project-level audit trails.
