# FUEL Technical Architecture

## Current Architecture

The current FUEL app is a React prototype built with Create React App.

```text
React app
  |
  |-- localStorage
  |     |-- fuel-user
  |     |-- fuel-projects
  |     |-- fuel-transactions
  |
  |-- Demo Solana helper
        |-- generates devnet-style wallet references
```

This architecture is good for a clickable MVP and user interviews. It is not production-ready for real users or money movement.

## Current App Responsibilities

Frontend currently handles:

- Routing between app views.
- Prototype login state.
- Project creation.
- Project persistence in browser storage.
- Transaction persistence in browser storage.
- Receive funds simulation.
- Split calculation.
- Payout confirmation simulation.
- Activity feed and status history.

## Current Data Objects

### User

Stored in `fuel-user`.

Fields:

- `name`
- `email` optional
- `initials`
- `provider`

### Project

Stored in `fuel-projects`.

Fields:

- `id`
- `name`
- `initials`
- `accent`
- `balance`
- `pct`
- `split`
- `splitMembers`
- `walletAddress`

### Split Member

Nested inside projects.

Fields:

- `name`
- `role`
- `email`
- `initials`
- `pct`
- `color`

### Transaction

Stored in `fuel-transactions`.

Fields:

- `id`
- `type`
- `projectId`
- `projectName`
- `label`
- `date`
- `amount`
- `displayAmount`
- `status`
- `color`
- `history` optional

## Production Architecture Direction

Recommended next architecture:

```text
React frontend
  |
  |-- Supabase Auth
  |
  |-- Supabase Postgres
  |     |-- users
  |     |-- workspaces
  |     |-- workspace_members
  |     |-- projects
  |     |-- project_members
  |     |-- transactions
  |     |-- payout_batches
  |     |-- payout_recipients
  |     |-- audit_events
  |
  |-- Payment/stablecoin providers
        |-- fiat intake
        |-- stablecoin settlement
        |-- fiat payout
        |-- KYC/KYB
```

## Recommended Database Tables

### `users`

- `id`
- `auth_user_id`
- `display_name`
- `email`
- `created_at`

### `workspaces`

- `id`
- `name`
- `created_by`
- `created_at`

### `workspace_members`

- `id`
- `workspace_id`
- `user_id`
- `role`
- `created_at`

### `projects`

- `id`
- `workspace_id`
- `name`
- `description`
- `category`
- `currency`
- `accent_color`
- `wallet_reference`
- `balance`
- `status`
- `created_by`
- `created_at`

### `project_members`

- `id`
- `project_id`
- `name`
- `email`
- `role`
- `percentage`
- `user_id`
- `created_at`

### `transactions`

- `id`
- `project_id`
- `type`
- `amount`
- `currency`
- `status`
- `provider_reference`
- `metadata`
- `created_at`

### `payout_batches`

- `id`
- `project_id`
- `gross_amount`
- `fee_amount`
- `net_amount`
- `status`
- `approved_by`
- `created_at`

### `payout_recipients`

- `id`
- `payout_batch_id`
- `project_member_id`
- `amount`
- `percentage`
- `status`
- `provider_reference`
- `created_at`

### `audit_events`

- `id`
- `workspace_id`
- `project_id`
- `actor_user_id`
- `event_type`
- `metadata`
- `created_at`

## Auth Plan

Prototype:

- Username login.
- Demo Google login.
- Session stored in localStorage.

Production:

- Supabase Auth or Firebase Auth.
- Google OAuth.
- Email magic link.
- No custom password handling at first.

## Security Plan

Near-term:

- Keep real money movement out of the frontend.
- Do not store private keys, bank details, or card details.
- Use localStorage only for prototype data.

Production:

- Enforce row-level security.
- Store payment provider references, not secrets.
- Use payment partners for sensitive financial data.
- Add audit logs for every sensitive action.
- Treat transactions and payout batches as append-only where possible.
- Use provider webhooks for payment and payout state changes.

## Stablecoin/Solana Plan

Prototype:

- Use a demo helper that returns a devnet-style wallet reference.
- Show Solana as hidden infrastructure, not a user task.

Production:

- Use regulated stablecoin infrastructure or a custody provider.
- Keep private keys out of frontend code.
- Store only wallet/account references.
- Connect transaction status to provider events.

## Migration Plan From localStorage To Supabase

1. Create Supabase project.
2. Add auth.
3. Add database tables.
4. Add row-level security policies.
5. Replace localStorage reads with Supabase queries.
6. Replace localStorage writes with inserts/updates.
7. Add loading and error states.
8. Keep demo data seed scripts for investor/user demos.

## Open Technical Questions

- Supabase versus Firebase for first backend.
- Which payment provider should handle fiat intake.
- Which provider should handle stablecoin settlement.
- Whether project wallets should be custodial, embedded, or provider-managed.
- How much transaction detail should be visible to non-technical users.
- Which compliance checks are required before live payouts.
