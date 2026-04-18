# FUEL MVP Plan

## Goal

Build a narrow, credible MVP that proves FUEL can help a project lead receive one client payment, split it by agreed percentages, and track collaborator payouts without exposing crypto complexity.

The MVP should validate the workflow before real money movement is introduced.

## MVP Promise

> Create a project, add collaborators, receive funds, preview the split, confirm payouts, and see a clean activity history.

## Current Prototype Status

Already implemented:

- Landing page and app-style navigation.
- Prototype username and demo Google login.
- Project creation with collaborator percentages.
- Local browser persistence for user, projects, and transactions.
- Receive funds simulation.
- Split preview with 1% FUEL fee.
- Payout confirmation and status history.
- Activity feed.
- FUEL-specific README and PRD.

Still mocked:

- Real authentication.
- Real database.
- Real fiat payment intake.
- Real fiat payout.
- Real stablecoin settlement.
- Compliance and KYC/KYB.

## MVP User Flow

1. User logs in.
2. User creates a project.
3. User adds collaborators and assigns percentages.
4. User simulates a client payment.
5. FUEL shows:
   - Gross client payment.
   - FUEL fee.
   - Net payout pool.
   - Each collaborator's payout.
6. User confirms payouts.
7. FUEL writes payout statuses:
   - Pending.
   - Sent.
   - Completed.
8. User reviews the Activity feed.

## Phase 1: Demo Quality

Objective: Make the current prototype convincing enough for user interviews, hackathon review, and founder conversations.

Tasks:

- Polish mobile navigation into an app-style bottom nav.
- Add project detail screens.
- Make the Receive flow feel like the primary product action.
- Add reset/demo data controls for repeat demos.
- Improve empty states and loading states.
- Add simple responsive QA across mobile and desktop.

Success criteria:

- A new viewer understands FUEL in under 30 seconds.
- The demo flow can be completed without explanation.
- The app can be refreshed without losing local prototype data.

## Phase 2: Validation MVP

Objective: Validate that target users recognize the pain and want this workflow.

Tasks:

- Interview 10-20 target users.
- Track current tools, time spent, fees, and payout friction.
- Add user research notes to `docs/USER_RESEARCH.md`.
- Convert common interview findings into product changes.
- Add fake payment links or shareable project summaries if useful for demos.

Success criteria:

- At least 5 target users confirm the workflow maps to a real recurring pain.
- At least 3 users agree to try a live MVP or pilot.
- Clear first niche emerges.

## Phase 3: Real Auth And Database

Objective: Replace localStorage with real user accounts and durable project data.

Recommended stack:

- Supabase Auth for Google and magic link login.
- Supabase Postgres for projects, members, transactions, and payout batches.
- Row-level security for project/member access.

Tasks:

- Add Supabase project.
- Replace demo login with real auth.
- Add database schema.
- Migrate project and transaction state from localStorage to Postgres.
- Add audit events.
- Keep localStorage only for temporary UI preferences.

Success criteria:

- User can log in from another device and see the same projects.
- Users only see projects they belong to.
- Transactions persist server-side.

## Phase 4: Payment Infrastructure Pilot

Objective: Run a narrow, compliant pilot without building regulated infrastructure from scratch.

Tasks:

- Choose payment/stablecoin partners.
- Define first corridor and user type.
- Add provider transaction references.
- Add payout status webhooks.
- Add KYC/KYB provider if needed.
- Add support and dispute handling.

Success criteria:

- One closed beta team can complete a real or semi-real payout workflow.
- Payment state is auditable.
- No private keys, card numbers, bank credentials, or sensitive payment secrets are stored in frontend code.

## Non-Goals For The First MVP

- Full payroll.
- Employee wage compliance.
- Global payout coverage.
- Custom wallet custody.
- Custom money transmission infrastructure.
- Token launch.
- DAO treasury tooling.

## Near-Term Priority Order

1. Mobile app-shell redesign.
2. User interviews.
3. Project detail page.
4. Supabase auth and schema.
5. Real database persistence.
6. Compliance/provider research.
7. Payment partner prototype.
