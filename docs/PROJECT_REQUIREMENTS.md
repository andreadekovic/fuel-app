# FUEL Project Requirements Document

## 1. Overview

FUEL is a project-based payment coordination platform for freelancers, agencies, distributed teams, and collaborative work groups. It lets a team receive a client payment, automatically split the funds by predefined percentages, and pay contributors globally through a fiat-first experience.

The core product promise is:

> Coordinating money across a team should be as easy as sending a message.

FUEL uses stablecoin settlement rails, with Solana as the intended intermediary network, to make payouts faster and cheaper. The user experience should abstract away blockchain complexity. Users should see projects, balances, contributors, percentages, and payouts, not wallets, gas fees, seed phrases, or crypto-native workflows.

## 2. Problem Statement

Freelancers, agencies, and distributed teams often need to split project revenue across multiple contributors. Today, that workflow is manual, slow, fragmented, and expensive.

Common pain points:

- A client payment arrives in one account, but several collaborators need to be paid.
- Splits are tracked manually in spreadsheets or messages.
- International payouts require multiple platforms, bank transfers, or peer-to-peer apps.
- Teams lose money to payment fees, wire fees, FX spreads, and platform fees.
- Contributors wait days for settlement, especially across borders or weekends.
- Payment coordination can feel unprofessional and stressful for project leads.

Existing tools solve pieces of the workflow, but they do not own the full financial coordination layer for collaborative project work.

## 3. Target Users

Primary users:

- Freelance collectives that collaborate on client projects.
- Creative agencies paying designers, developers, producers, strategists, and contractors.
- Distributed teams working across countries.
- Project leads who receive client payments and need to distribute funds.
- Early-stage service businesses that are not ready for heavy payroll or accounting systems.

Secondary users:

- Contributors who need fast, predictable payouts.
- Client-facing teams that want a cleaner way to receive and distribute project funds.
- Crypto-friendly teams that still want a fiat-like experience for non-crypto collaborators.

## 4. Customer Need

Users need one place to:

- Create a project.
- Add collaborators.
- Define payment percentages.
- Receive client funds.
- Automatically calculate each person's share.
- Pay contributors quickly across borders.
- Keep a clear record of balances, transactions, and payout history.

The product should reduce the project lead's administrative burden and make contributors trust that payouts are fair, trackable, and timely.

## 5. Market Rationale

The global freelance economy is large and growing, with distributed collaboration becoming normal across creative, technical, and professional services work. As more teams form around projects rather than traditional employment structures, financial coordination becomes a repeated workflow.

The opportunity is to become the financial coordination layer for collaborative work:

- Receive funds.
- Split automatically.
- Pay out globally.
- Preserve a clean project-level record.

The stablecoin and Solana component is an infrastructure advantage, not the user-facing pitch. The product should win because it solves payout coordination, not because it asks users to adopt crypto.

## 6. Product Positioning

FUEL should be positioned as:

> Automated project payout splits for distributed teams.

Avoid leading with:

- Crypto payroll.
- Web3 wallet tooling.
- DAO treasury management.
- Stablecoin infrastructure.

Lead with:

- Fast global payouts.
- Automatic percentage splits.
- Project-level balances.
- Fiat-in, fiat-out experience.
- Clear records for teams.

## 7. Competitive Landscape

### Deel

Deel is strong for contractor payroll, HR, compliance, and global workforce management. It is less focused on project-level revenue splitting for lightweight collaborative teams.

FUEL differentiation:

- Project-centric rather than payroll-centric.
- Built for receiving a project payment and splitting it among collaborators.
- Lightweight enough for small teams, agencies, and freelancers.

### Wise

Wise is strong for international transfers and multi-currency accounts. It does not manage collaborative project splits, contributor rules, or automated revenue allocation.

FUEL differentiation:

- Split logic and team coordination are built into the product.
- Payout records are tied to projects and contributors.

### Request Finance

Request Finance serves crypto-native invoicing and payments. It can feel too blockchain-forward for non-crypto users.

FUEL differentiation:

- Abstracts crypto rails behind fiat-like UX.
- Uses familiar concepts: projects, balances, percentages, payouts.

### Utopia Labs

Utopia Labs focused on DAO operations and crypto-native organizations.

FUEL differentiation:

- Built for mainstream project teams, agencies, freelancers, and distributed collaborators.
- Does not require users to understand DAO tooling or crypto treasury operations.

## 8. Current Project Status

FUEL is currently in the ideation and prototype stage.

Current assets:

- Working React frontend prototype.
- Dashboard UI.
- Project list UI.
- Payment/send funds UI.
- New project creation flow.
- Mocked Solana wallet generation.
- Initial product architecture and business narrative.

Current limitations:

- No real users yet.
- No backend persistence.
- No real fiat payment integration.
- No real stablecoin transaction integration.
- No authentication.
- No compliance workflow.
- No real production payout flow.

The hackathon is the launchpad for validating the idea and converting the prototype into a narrow MVP.

## 9. MVP Goal

The MVP should prove that a project lead can create a project, define contributor splits, receive or simulate incoming funds, and trigger payouts in a clear, trustworthy workflow.

The MVP does not need to solve every compliance, banking, and global payout edge case immediately. It should validate that teams understand and want the workflow.

## 10. MVP User Journey

1. A project lead creates a FUEL project.
2. The lead adds collaborators by name and email.
3. The lead assigns each collaborator a payout percentage.
4. FUEL validates that allocations total 100%.
5. FUEL creates or assigns a project wallet/account.
6. The project receives funds or simulates an incoming client payment.
7. FUEL calculates each collaborator's payout.
8. The lead reviews the split.
9. The lead confirms payout.
10. Contributors receive payout status and transaction history.

## 11. Functional Requirements

### Project Management

- Users can create a project with a name, description, category, currency, and accent color.
- Users can view all active projects.
- Users can view project balance, contributors, and split rules.
- Users can edit project metadata before funds are distributed.

### Contributor Management

- Users can add collaborators by email.
- Users can assign payout percentages.
- The system must validate that total percentages equal 100%.
- The system must prevent payout confirmation if allocation totals are invalid.
- The system should show each contributor's expected payout before funds are sent.

### Payment Intake

- MVP may simulate incoming funds.
- Future versions should support real payment intake by card, ACH, wire, stablecoin, or payment link.
- Incoming funds must be associated with a specific project.

### Split Calculation

- The system calculates each contributor's share based on the project split rules.
- The system should show platform fees, network fees, and net recipient amounts.
- The system should preserve a record of the split calculation.

### Payout Flow

- MVP may simulate payout confirmation.
- Future versions should support fiat payouts to bank accounts or stablecoin payouts where legally supported.
- The payout flow should be fiat-first and hide blockchain details unless the user explicitly asks for them.

### Activity And Records

- Users can view project activity history.
- Users can view incoming funds, split events, and payout events.
- Users can export or copy payout records for bookkeeping.

### Stablecoin Rail Abstraction

- Users should not need to manage private keys, gas, wallets, or seed phrases.
- The product may show a project wallet or settlement reference for transparency.
- The default UX should frame stablecoins as settlement infrastructure, not a user task.

## 12. Non-Functional Requirements

### Usability

- The product must be understandable to non-crypto users.
- Payment setup should feel closer to project management and banking than crypto treasury tooling.
- The UI should prioritize clarity, trust, and low cognitive load.

### Trust And Transparency

- Users must be able to see how each payout was calculated.
- Contributors should understand why they received a specific amount.
- The system should show fees before confirmation.

### Speed

- The product should aim for faster settlement than traditional international bank transfers.
- The app should provide clear payout statuses so users are not left guessing.

### Reliability

- Payment and payout states must be durable once real money movement is introduced.
- The system must avoid duplicate payouts.
- The system must maintain an auditable transaction history.

### Security

- Future wallet, banking, and payout credentials must be handled through secure providers.
- Private keys should not be exposed to users or stored casually in app code.
- Sensitive user and payment data must be protected.

## 13. Compliance And Risk Requirements

FUEL touches regulated money movement. Before real payment processing, the team must assess:

- Money transmission exposure.
- KYC and KYB requirements.
- AML and sanctions screening.
- Stablecoin issuer and stablecoin availability rules.
- Contractor versus employee payment rules.
- Tax reporting obligations.
- State-by-state and country-by-country payout restrictions.

Near-term compliance strategy:

- Avoid positioning the product as payroll.
- Start with contractors, freelancers, agencies, or project collaborators.
- Use regulated payment, stablecoin, and payout partners rather than building money transmission from scratch.
- Keep stablecoin mechanics behind the scenes.

## 14. Business Model

Initial revenue model:

- Charge 0.5% to 2% per transaction processed through the platform.
- Fees may vary by transaction volume, payout method, and geography.

Future revenue opportunities:

- Subscription plans for teams with higher payout volume.
- Premium project controls and approval workflows.
- Accounting exports and integrations.
- Compliance or tax document automation.
- Faster payout tiers.

## 15. Success Metrics

Early validation metrics:

- Number of project leads interviewed.
- Percentage of interviewed users currently using spreadsheets or manual workflows.
- Number of users willing to try a prototype.
- Number of projects created in MVP.
- Number of collaborators added.
- Number of simulated or real split events completed.

Product metrics:

- Time to create project.
- Time to configure splits.
- Time from funds received to payout initiated.
- Payout error rate.
- Percentage of users who return for a second project.
- Transaction volume processed.
- Revenue from transaction fees.

Trust metrics:

- Percentage of contributors who understand their payout calculation.
- Number of support questions per payout.
- Dispute rate.
- Failed or delayed payout rate.

## 16. Launch Plan

### Phase 1: Prototype

- Polish the current frontend.
- Replace mocked copy with product-specific language.
- Make the dashboard, project creation, and payment flow cohesive.
- Add activity history UI.

### Phase 2: MVP Validation

- Add persistence for projects and contributors.
- Add simulated incoming payment events.
- Add simulated payout events.
- Interview target users while walking them through the prototype.
- Capture willingness to pay and most painful current workflows.

### Phase 3: Real Payment Pilot

- Select regulated infrastructure partners.
- Add user authentication.
- Add onboarding and compliance collection.
- Support one narrow payout corridor or use case.
- Run a small closed beta with trusted teams.

### Phase 4: Public Launch

- Add self-serve onboarding.
- Add production monitoring.
- Add support and dispute flows.
- Add accounting exports.
- Expand payment methods and payout corridors.

## 17. Key Assumptions

- Distributed teams have a frequent enough payout coordination problem to justify a dedicated tool.
- Project leads are willing to pay for reduced admin, faster payouts, and cleaner records.
- Non-crypto users will accept stablecoin rails if the UX is fiat-first.
- Stablecoin infrastructure can reduce settlement time and/or cost enough to create a meaningful advantage.
- Compliance can be managed through partners in the early stages.

## 18. Open Questions

- Which first niche has the strongest pain: agencies, freelance collectives, creators, or global contractor teams?
- Should FUEL start with simulated payouts, stablecoin payouts, or fiat payouts through a partner?
- Who is the buyer: project lead, agency owner, operations manager, or finance admin?
- What payout corridors matter most at launch?
- How should FUEL handle contributor onboarding without adding too much friction?
- What records do users need for taxes and bookkeeping?
- Which payment provider or stablecoin infrastructure partner best supports the MVP?
- What fee level is acceptable for the first customer segment?

## 19. Founder Narrative

FUEL comes from a lived problem: coordinating money across cross-border project teams is painful, manual, and often embarrassing. The founder has experienced the friction of getting paid, splitting funds, and coordinating contributors across geographies.

The mission is to make collaborative payments feel simple, fast, and professional.

## 20. Accelerator Answer Bank

### How do you know people actually need this?

Every freelancer, agency, and distributed team hits the same wall: splitting a client payment across multiple people in multiple countries takes hours, multiple platforms, and unnecessary fees. Existing tools solve parts of the workflow, but none unify receive funds, split automatically, and pay out globally in one project-centric flow.

### How far along are you?

FUEL is currently at the prototype stage. The team has a working frontend, product architecture, UI direction, and a clear MVP path. The hackathon is the forcing function to validate the product and recruit early users.

### Who else is building in this space?

Deel solves global workforce payments, Wise solves international transfers, Request Finance solves crypto-native invoicing, and Utopia Labs served DAO operations. FUEL is different because it is project-centric, fiat-first, and built for collaborative teams that should not have to think in blockchain terms.

### How do you make money?

FUEL charges a transaction fee on payment volume processed through the platform, likely between 0.5% and 2%, with future subscription tiers for power users and teams.

### Why this?

Because the problem is personal. Project work has become global and collaborative, but the money coordination layer is still fragmented and manual. FUEL is the tool the founder wishes existed.
