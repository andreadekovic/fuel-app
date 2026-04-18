# FUEL Demo Script

## Demo Goal

Show that FUEL turns a messy project payout workflow into a clean app flow:

> Receive one client payment, split it automatically, confirm payouts, and track status.

## One-Sentence Pitch

FUEL is project payout automation for distributed teams. Receive one client payment, split it automatically, and pay collaborators globally.

## Setup

Before demoing:

- Open the app.
- Clear localStorage if you want a fresh run.
- Confirm the dev server is running.
- Use username login for the fastest path.

Suggested login:

- Username: `Andrea`

## Demo Flow

### 1. Landing Page

Point out:

- The FUEL positioning.
- The app is fiat-first.
- Crypto/stablecoin rails are not the user-facing product.

Say:

> FUEL is for project teams that receive one client payment and need to split it across collaborators without spreadsheets, delays, and awkward follow-ups.

### 2. Login

Click:

- `Log in to start`
- Enter a username.
- Continue.

Say:

> This is prototype auth today. Real Google login and magic links would be handled by Supabase or Firebase later.

### 3. Dashboard

Point out:

- Project balances.
- Received funds.
- Paid out amount.
- Recent activity.

Say:

> The dashboard gives the project lead a quick view of active project balances and payout history.

### 4. Projects

Open:

- `Projects`

Point out:

- Each project has a balance.
- Each project has split rules.
- Project creation supports collaborator percentages.

Optional:

- Create a new project.
- Add a collaborator.
- Show percentage validation.

Say:

> FUEL treats the project as the unit of money coordination, not the individual invoice or contractor.

### 5. Receive Funds

Open:

- `Receive`

Click:

- `Simulate $5,000.00 client payment`

Point out:

- Gross client payment.
- FUEL fee.
- Net payout pool.
- Recipient payout amounts.

Say:

> This is the core workflow. A client payment arrives, FUEL reads the project split rules, calculates every payout, and shows the lead exactly what will happen before funds move.

### 6. Confirm Payouts

Click:

- `Confirm payouts`

Point out:

- Pending.
- Sent.
- Completed.
- Confirmation note.

Say:

> The MVP currently simulates payout status. In production, these statuses would come from payment and stablecoin provider events.

### 7. Activity

Open:

- `Activity`

Point out:

- Client payment event.
- Split preview event.
- Platform fee event.
- Payout records.
- Status history.

Say:

> Activity becomes the source of truth for what happened, who got paid, and what status each payout reached.

## Suggested Closing

Say:

> The current prototype validates the workflow. The next step is moving from browser localStorage to real auth, a database, and regulated payment partners.

## Common Questions

### Is this real money?

Not yet. This is a workflow MVP. It simulates incoming funds and payouts so we can validate the user journey before introducing regulated money movement.

### Is Google login real?

Not yet. The current Google button is a demo path. Real auth should use Supabase Auth, Firebase Auth, Auth0, or Google Identity Services.

### Why Solana?

Solana is intended as a fast, low-cost settlement rail for stablecoin movement. Users should not need to understand or manage wallets.

### Is this payroll?

No. The initial wedge should be project-based collaborator payouts, not employee payroll.

### Who is this for first?

Small creative agencies, freelance collectives, and distributed project teams that split client revenue across collaborators.
