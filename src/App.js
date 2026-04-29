import { useEffect, useState } from "react";
import CreateProject from "./CreateProject";
import "./App.css";

const C = {
  bg:"#0A0D0F", sidebar:"#101416", card:"#151A1B",
  border:"rgba(255,255,255,.08)", inner:"rgba(255,255,255,.06)",
  yellow:"#C8FF5A", pink:"#7D8BFF", orange:"#58D5C9",
  light:"#F5F7F7", muted:"#8C979C", dim:"#5A6468",
};
const fonts = "'DM Sans', sans-serif";
const titleFonts = "'DM Sans', sans-serif";
const PROJECTS_KEY = "fuel-projects";
const TRANSACTIONS_KEY = "fuel-transactions";
const USER_KEY = "fuel-user";

const defaultSplitMembers = [
  { name:"Ana Navarro", role:"Design lead", email:"ana@studio.co", initials:"AN", pct:45, color:"#FFDD76" },
  { name:"James K.", role:"Developer", email:"james@studiomail.com", initials:"JK", pct:30, color:"#E74C89" },
  { name:"Maya Chen", role:"Producer", email:"maya@studio.co", initials:"MC", pct:25, color:"#FEA55B" },
];

const defaultProjects = [
  { id:1, initials:"BC", name:"Brand Campaign", members:3, balance:6200, pct:67, split:"45/30/25", accent:"#FFDD76", splitMembers:defaultSplitMembers },
  { id:2, initials:"DS", name:"Dev Sprint Q2", members:2, balance:3750, pct:42, split:"60/40", accent:"#E74C89", splitMembers:[
    { name:"James K.", role:"Developer", email:"james@studiomail.com", initials:"JK", pct:60, color:"#E74C89" },
    { name:"Riley Stone", role:"Product", email:"riley@studio.co", initials:"RS", pct:40, color:"#60a5fa" },
  ] },
  { id:3, initials:"RF", name:"Research Fund", members:3, balance:2530, pct:25, split:"Equal", accent:"#FEA55B", splitMembers:[
    { name:"Maya Chen", role:"Research", email:"maya@studio.co", initials:"MC", pct:34, color:"#FEA55B" },
    { name:"Ana Navarro", role:"Strategy", email:"ana@studio.co", initials:"AN", pct:33, color:"#FFDD76" },
    { name:"Noah Lee", role:"Ops", email:"noah@studio.co", initials:"NL", pct:33, color:"#a78bfa" },
  ] },
];

const defaultTransactions = [
  { id:"seed-1", type:"in", projectId:1, projectName:"Brand Campaign", label:"Client payment received", date:"Today, 2:14 PM", amount:5000, displayAmount:"+$5,000.00", status:"Completed", color:"#FFDD76" },
  { id:"seed-2", type:"split", projectId:1, projectName:"Brand Campaign", label:"Auto split calculated", date:"Today, 2:14 PM", amount:5000, displayAmount:"3 payouts", status:"Ready", color:"#FEA55B" },
  { id:"seed-3", type:"payout", projectId:1, projectName:"Brand Campaign", label:"Payout to Ana Navarro", date:"Yesterday", amount:-1500, displayAmount:"-$1,500.00", status:"Completed", color:"#E74C89", history:["Pending","Sent","Completed"] },
  { id:"seed-4", type:"in", projectId:2, projectName:"Dev Sprint Q2", label:"Invoice paid", date:"Apr 11", amount:3200, displayAmount:"+$3,200.00", status:"Completed", color:"#FFDD76" },
];

const landingMetrics = [
  { label:"One client payment", value:"$5K" },
  { label:"Auto split rules", value:"3 ways" },
  { label:"Global payout rail", value:"USDC" },
];

const demoActivity = [
  { label:"Client payment simulated", amount:"+$5,000.00", status:"Completed", color:"#FFDD76" },
  { label:"FUEL platform fee", amount:"-$50.00", status:"Completed", color:"#888" },
  { label:"Split calculation locked", amount:"3 payouts", status:"Completed", color:"#FEA55B" },
  { label:"Contributor payouts", amount:"$4,950.00", status:"Sent", color:"#E74C89" },
];

const pageIcons = {
  Home:"◌",
  About:"◎",
  Login:"→",
  Dashboard:"◫",
  Projects:"◇",
  Receive:"↓",
  Payments:"↑",
  Activity:"↺",
};

function loadLocal(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Prototype persistence should never break the UI.
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("") || "YN";
}

function formatMoney(value) {
  return `$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 })}`;
}

function signedMoney(value) {
  return `${value >= 0 ? "+" : "-"}${formatMoney(value)}`;
}

function nowLabel() {
  return new Intl.DateTimeFormat(undefined, { hour:"numeric", minute:"2-digit" }).format(new Date());
}

function makeTransaction(input) {
  return {
    id:`tx-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date:`Today, ${nowLabel()}`,
    ...input,
  };
}

function normalizeProjects(projects) {
  return projects.map(project => {
    const splitMembers = project.splitMembers?.length
      ? project.splitMembers
      : [{ name:"You", role:"Owner", email:"you@email.com", initials:"YN", pct:100, color:project.accent || C.yellow }];
    return {
      ...project,
      splitMembers,
      members:project.members || splitMembers.length,
      split:project.split || splitMembers.map(member => `${member.pct}%`).join("/"),
    };
  });
}

function calculateSplit(project, amount) {
  const fee = Number((amount * 0.01).toFixed(2));
  const pool = Number((amount - fee).toFixed(2));
  const recipients = project.splitMembers.map(member => ({
    ...member,
    amount:Number((pool * Number(member.pct) / 100).toFixed(2)),
  }));

  return {
    id:`split-${Date.now()}`,
    projectId:project.id,
    projectName:project.name,
    projectAccent:project.accent,
    amount,
    fee,
    pool,
    recipients,
  };
}

function Sidebar({ page, setPage, projects, user, onLogout }) {
  const nav = user ? ["Home","About","Dashboard","Projects","Receive","Payments","Activity"] : ["Home","About","Login"];
  return (
    <aside className="app-sidebar" style={{ background:C.sidebar, borderRight:`1px solid ${C.border}`, fontFamily:fonts }}>
      <div className="sidebar-brand">
        <div style={{ width:34, height:34, borderRadius:10, background:C.yellow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:C.bg, fontFamily:titleFonts }}>F</div>
        <div>
          <span style={{ display:"block", fontSize:17, fontWeight:700, color:C.light, fontFamily:titleFonts }}>fuel</span>
          <span style={{ display:"block", fontSize:11, color:C.muted }}>Project payouts</span>
        </div>
      </div>
      <div className="sidebar-section-label">Main</div>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item}
            className={`sidebar-item ${page===item ? "is-active" : ""}`}
            onClick={() => setPage(item)}
            style={{
              borderColor: page===item ? "rgba(200,255,90,.2)" : "transparent",
              background: page===item ? "rgba(200,255,90,.08)" : "transparent",
              color: page===item ? C.light : C.muted,
            }}
          >
            <span className="sidebar-item-icon">{pageIcons[item]}</span>
            <span className="sidebar-item-label">{item}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-projects">
        <div className="sidebar-section-label">Projects</div>
        {projects.map(p => (
          <button key={p.id} className="sidebar-project-link" onClick={() => user && setPage("Projects")}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:p.accent, flexShrink:0 }} />
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-footer" style={{ borderTop:`1px solid ${C.border}` }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:C.yellow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:C.bg }}>{user ? user.initials : "?"}</div>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontSize:13, color:C.light, fontWeight:600, fontFamily:fonts, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user ? user.name : "Guest"}</div>
          <div style={{ fontSize:11, color:C.muted }}>{user ? user.provider : "Not signed in"}</div>
        </div>
        {user
          ? <button className="sidebar-auth-button" onClick={onLogout}>Sign out</button>
          : <button className="sidebar-auth-button" onClick={() => setPage("Login")}>Log in</button>
        }
      </div>
    </aside>
  );
}

function AppTopbar({ page, user, projects, transactions }) {
  const totalBalance = projects.reduce((sum, project) => sum + Number(project.balance || 0), 0);
  const completedPayouts = transactions.filter(tx => tx.type === "payout").length;
  return (
    <div className="app-topbar">
      <div>
        <div className="app-topbar-kicker">Workspace</div>
        <div className="app-topbar-title">{page}</div>
      </div>
      <div className="app-topbar-right">
        <div className="topbar-chip">
          <span className="chip-dot live" />
          Solana rail active
        </div>
        <div className="topbar-chip">
          <span className="chip-metric">{formatMoney(totalBalance)}</span>
          Available
        </div>
        <div className="topbar-chip">
          <span className="chip-metric">{completedPayouts}</span>
          Payouts cleared
        </div>
        <div className="topbar-user">{user.initials}</div>
      </div>
    </div>
  );
}

function Home({ setPage, onCreateProject, user }) {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-copy">
          <div className="home-eyebrow">Project payout automation</div>
          <h1>FUEL</h1>
          <p>FUEL is project payout automation for distributed teams. Receive one client payment, split it automatically, and pay collaborators globally.</p>
          <div className="home-actions">
            <button className="primary-action" onClick={user ? onCreateProject : () => setPage("Login")}>{user ? "Create project" : "Log in to start"}</button>
            <button className="secondary-action" onClick={() => setPage("About")}>View demo flow</button>
          </div>
          <div className="hero-trust-row">
            <span>Agencies</span>
            <span>Studios</span>
            <span>Distributed teams</span>
          </div>
        </div>
        <div className="hero-stage">
          <div className="payment-scene" aria-hidden="true">
            <div className="rail rail-one" />
            <div className="rail rail-two" />
            <div className="rail rail-three" />
            <div className="scene-node client-node">Client</div>
            <div className="scene-node fuel-node">FUEL</div>
            <div className="scene-node team-node">Team</div>
            <div className="payment-pulse pulse-one">$5,000</div>
            <div className="payment-pulse pulse-two">45%</div>
            <div className="payment-pulse pulse-three">30%</div>
            <div className="payment-pulse pulse-four">25%</div>
          </div>
          <div className="hero-console">
            <div className="console-card primary">
              <div className="console-label">Incoming payment</div>
              <strong>$5,000.00</strong>
              <span>Brand Campaign · Client paid</span>
            </div>
            <div className="console-grid">
              <div className="console-card">
                <div className="console-label">Platform fee</div>
                <strong>$50.00</strong>
                <span>1.0% automated fee</span>
              </div>
              <div className="console-card">
                <div className="console-label">Net payout pool</div>
                <strong>$4,950.00</strong>
                <span>Ready to route instantly</span>
              </div>
            </div>
            <div className="console-card roster">
              <div className="console-label">Live split rules</div>
              {defaultSplitMembers.map(member => (
                <div className="console-row" key={member.email}>
                  <div className="console-person">
                    <span className="console-badge" style={{ background:member.color }}>{member.initials}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <span>{member.role}</span>
                    </div>
                  </div>
                  <div className="console-amount">
                    <strong>{member.pct}%</strong>
                    <span>{formatMoney(4950 * member.pct / 100)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="home-proof">
        {landingMetrics.map(metric => (
          <div className="proof-block" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const cleanName = username.trim();

  function continueWithUsername(event) {
    event.preventDefault();
    if (!cleanName) return;
    onLogin({
      name: cleanName,
      initials: getInitials(cleanName),
      provider: "Username",
    });
  }

  function continueWithGoogle() {
    onLogin({
      name: "Google Demo User",
      email: "google.demo@fuel.test",
      initials: "GD",
      provider: "Google",
    });
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="home-eyebrow">Welcome back</div>
        <h1>Log in to FUEL</h1>
        <p>Use a username for the prototype, or continue with the demo Google path.</p>
        <button className="google-login-button" onClick={continueWithGoogle}>
          <span>G</span>
          Continue with Google
        </button>
        <div className="login-divider"><span>or</span></div>
        <form onSubmit={continueWithUsername}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder="e.g. Andrea"
          />
          <button className="primary-action" type="submit" disabled={!cleanName}>Continue</button>
        </form>
      </section>
      <aside className="login-preview">
        <div className="panel-title">Session preview</div>
        <div className="preview-avatar">{cleanName ? getInitials(cleanName) : "F"}</div>
        <strong>{cleanName || "Your workspace"}</strong>
        <span>Projects, splits, and payout demos unlock after login.</span>
      </aside>
    </main>
  );
}

function About() {
  const [run, setRun] = useState(0);
  const payment = 5000;
  const fee = 50;
  const payoutPool = payment - fee;

  return (
    <main className="about-page">
      <section className="about-header">
        <div>
          <div className="home-eyebrow">Demo flow</div>
          <h1>From one client payment to global team payouts.</h1>
        </div>
        <button className="primary-action" onClick={() => setRun(run + 1)}>Simulate $5,000 client payment</button>
      </section>

      <section className="flow-stage" key={run}>
        <div className="flow-lane">
          <div className="flow-step step-one">
            <span>01</span>
            <strong>Client payment</strong>
            <em>$5,000.00 received</em>
          </div>
          <div className="flow-step step-two">
            <span>02</span>
            <strong>Split calculation</strong>
            <em>45 / 30 / 25</em>
          </div>
          <div className="flow-step step-three">
            <span>03</span>
            <strong>Platform fee</strong>
            <em>$50.00</em>
          </div>
          <div className="flow-step step-four">
            <span>04</span>
            <strong>Payouts</strong>
            <em>Pending -> sent -> completed</em>
          </div>
        </div>

        <div className="about-grid">
          <div className="split-panel">
            <div className="panel-title">Recipient payouts</div>
            {defaultSplitMembers.map((recipient, index) => {
              const amount = payoutPool * recipient.pct / 100;
              return (
                <div className={`recipient-row recipient-${index + 1}`} key={recipient.email}>
                  <div className="recipient-mark" style={{ background:recipient.color }}>{recipient.initials}</div>
                  <div>
                    <strong>{recipient.name}</strong>
                    <span>{recipient.role} · {recipient.pct}%</span>
                  </div>
                  <em>{formatMoney(amount)}</em>
                </div>
              );
            })}
          </div>

          <div className="status-panel">
            <div className="panel-title">Payout status</div>
            {["Pending","Sent","Completed"].map((status, index) => (
              <div className={`status-row status-${index + 1}`} key={status}>
                <span />
                <strong>{status}</strong>
              </div>
            ))}
          </div>

          <div className="activity-panel">
            <div className="panel-title">Activity feed</div>
            {demoActivity.map((item, index) => (
              <div className={`activity-row activity-${index + 1}`} key={item.label}>
                <span style={{ color:item.color }}>●</span>
                <div>
                  <strong>{item.label}</strong>
                  <em>{item.status}</em>
                </div>
                <b>{item.amount}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Dashboard({ projects, transactions, setPage }) {
  const totalBalance = projects.reduce((sum, project) => sum + Number(project.balance || 0), 0);
  const totalReceived = transactions.filter(tx => tx.type === "in").reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const totalPaid = Math.abs(transactions.filter(tx => tx.type === "payout").reduce((sum, tx) => sum + Number(tx.amount || 0), 0));
  const memberCount = projects.reduce((sum, project) => sum + (project.splitMembers?.length || project.members || 0), 0);
  const nextProject = projects[0];
  const metrics = [
    { label:"Total balance", value:formatMoney(totalBalance), sub:"Across active projects", accent:true },
    { label:"Received", value:formatMoney(totalReceived), sub:"Tracked in local activity" },
    { label:"Paid out", value:formatMoney(totalPaid), sub:"Completed payouts" },
    { label:"Members", value:memberCount, sub:"Across split rules", subYellow:true },
  ];
  const recent = transactions.slice(0, 4);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-kicker">Prototype workspace</div>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="page-actions">
          <button onClick={() => setPage("Receive")} className="secondary-action">Receive</button>
          <button onClick={() => setPage("Payments")} className="primary-action">Send funds</button>
        </div>
      </div>
      <section className="command-deck">
        <div className="command-primary">
          <div className="deck-kicker">Workspace liquidity</div>
          <div className="deck-balance">{formatMoney(totalBalance)}</div>
          <p>One shared layer for receiving client funds, locking split logic, and clearing payouts with a clean audit trail.</p>
          <div className="deck-actions">
            <button className="primary-action" onClick={() => setPage("Receive")}>Receive payment</button>
            <button className="secondary-action" onClick={() => setPage("Activity")}>Open activity</button>
          </div>
        </div>
        <div className="command-secondary">
          <div className="deck-kicker">Next project rail</div>
          <strong>{nextProject?.name}</strong>
          <span>{nextProject?.splitMembers.length} collaborators · {nextProject?.split} split</span>
          <div className="mini-stack">
            <div className="mini-stack-row">
              <span>Available now</span>
              <strong>{formatMoney(nextProject?.balance || 0)}</strong>
            </div>
            <div className="mini-stack-row">
              <span>Recent payment</span>
              <strong>{transactions.find(tx => tx.projectId === nextProject?.id)?.displayAmount || "+$0.00"}</strong>
            </div>
          </div>
        </div>
      </section>
      <div className="metric-grid">
        {metrics.map(m => (
          <div key={m.label} className={`metric-card ${m.accent ? "accent" : ""}`}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className={`metric-sub ${m.subYellow ? "highlight" : ""}`}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="surface-panel">
          <div className="panel-title">Active projects</div>
          {projects.map(p => (
            <div key={p.id} className="project-row">
              <div className="project-avatar" style={{ background:`${p.accent}18`, color:p.accent }}>{p.initials}</div>
              <div className="project-row-copy">
                <div className="project-row-title">{p.name}</div>
                <div className="project-row-subtitle">{p.splitMembers.length} members · {p.split} split</div>
                <div className="project-progress">
                  <div style={{ width:`${p.pct || 0}%`, background:p.accent }} />
                </div>
              </div>
              <div className="project-balance">
                <div>{formatMoney(p.balance || 0)}</div>
                <span>available</span>
              </div>
            </div>
          ))}
        </div>
        <div className="surface-panel">
          <div className="panel-title">Recent activity</div>
          {recent.map(tx => (
            <ActivityRow key={tx.id} tx={tx} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects({ projects, onCreateProject }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-kicker">Workspace projects</div>
          <h1 className="page-title">Projects</h1>
        </div>
        <button onClick={onCreateProject} className="primary-action">New project</button>
      </div>
      <div className="project-card-grid">
        {projects.map(p => (
          <div key={p.id} className="project-card">
            <div className="project-card-top">
              <div className="project-avatar large" style={{ background:`${p.accent}18`, color:p.accent }}>{p.initials}</div>
              <span className="project-badge">Active</span>
            </div>
            <div className="project-card-title">{p.name}</div>
            <div className="project-card-subtitle">{p.splitMembers.length} members · {p.split} split</div>
            <div className="project-card-balance">{formatMoney(p.balance || 0)}</div>
            <div className="project-progress wide">
              <div style={{ width:`${p.pct || 0}%`, background:p.accent }} />
            </div>
            <div className="project-card-meta">
              <span style={{ color:p.accent }}>{p.split} split</span>
              <span>{p.splitMembers.length} members</span>
            </div>
          </div>
        ))}
        <div onClick={onCreateProject} className="ghost-card">
          <div>+</div>
          <span>New project</span>
        </div>
      </div>
    </div>
  );
}

function ReceiveFunds({ projects, onSimulateFunds, onConfirmPayouts, lastSplit }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [amount, setAmount] = useState(5000);
  const [preview, setPreview] = useState(lastSplit);
  const [confirmed, setConfirmed] = useState(null);
  const project = projects.find(item => String(item.id) === String(projectId)) || projects[0];

  function handleSimulate() {
    if (!project || amount <= 0) return;
    const nextPreview = onSimulateFunds(project.id, Number(amount));
    setPreview(nextPreview);
    setConfirmed(null);
  }

  function handleConfirm() {
    if (!preview) return;
    const result = onConfirmPayouts(preview);
    setConfirmed(result);
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-kicker">Receive funds</div>
          <h1 className="page-title">Simulate client payment</h1>
        </div>
        <button onClick={handleSimulate} className="primary-action">Simulate {formatMoney(Number(amount || 0))}</button>
      </div>
      <section className="receive-hero">
        <div>
          <div className="deck-kicker">Payment rail</div>
          <strong>Capture a client payment once, then let FUEL calculate every payout before money moves.</strong>
        </div>
        <div className="receive-hero-stats">
          <div>
            <span>Platform fee</span>
            <strong>1.0%</strong>
          </div>
          <div>
            <span>Settlement mode</span>
            <strong>Stablecoin rail</strong>
          </div>
          <div>
            <span>Payout states</span>
            <strong>Pending → Completed</strong>
          </div>
        </div>
      </section>

      <div className="receive-grid">
        <section className="receive-panel">
          <div className="panel-title">Payment setup</div>
          <label className="field-label">Project</label>
          <select value={projectId} onChange={event => setProjectId(event.target.value)} className="fuel-input">
            {projects.map(item => <option key={item.id} value={item.id}>{item.name} - {formatMoney(item.balance || 0)} available</option>)}
          </select>
          <label className="field-label">Incoming amount</label>
          <input type="number" min="1" value={amount} onChange={event => setAmount(Number(event.target.value))} className="fuel-input" />
          {project && (
            <div className="receive-project-card">
              <div style={{ width:42, height:42, borderRadius:10, background:`${project.accent}18`, color:project.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800 }}>{project.initials}</div>
              <div>
                <strong>{project.name}</strong>
                <span>{project.splitMembers.length} collaborators · {project.split} split</span>
              </div>
            </div>
          )}
        </section>

        <section className="receive-panel">
          <div className="panel-title">Split preview</div>
          {preview ? (
            <>
              <div className="summary-row"><span>Client payment</span><strong>{formatMoney(preview.amount)}</strong></div>
              <div className="summary-row"><span>FUEL fee (1%)</span><strong>-{formatMoney(preview.fee)}</strong></div>
              <div className="summary-row"><span>Payout pool</span><strong>{formatMoney(preview.pool)}</strong></div>
              <div className="recipient-preview-list">
                {preview.recipients.map(recipient => (
                  <div className="recipient-preview" key={`${recipient.email}-${recipient.pct}`}>
                    <div className="recipient-mark" style={{ background:recipient.color }}>{recipient.initials}</div>
                    <div>
                      <strong>{recipient.name}</strong>
                      <span>{recipient.pct}%</span>
                    </div>
                    <em>{formatMoney(recipient.amount)}</em>
                  </div>
                ))}
              </div>
              <button className="primary-action full-width-action" onClick={handleConfirm} disabled={Boolean(confirmed)}>Confirm payouts</button>
            </>
          ) : (
            <p className="empty-state">Simulate a client payment to preview split calculations, platform fee, and recipient payouts.</p>
          )}
        </section>

        <section className="receive-panel">
          <div className="panel-title">Status history</div>
          {(confirmed?.history || ["Pending","Sent","Completed"]).map((status, index) => (
            <div className={`status-row ${confirmed ? `status-${Math.min(index + 1, 3)}` : ""}`} key={status}>
              <span />
              <strong>{confirmed ? status : `${status}${index === 0 ? " after confirmation" : ""}`}</strong>
            </div>
          ))}
          {confirmed && <p className="confirmation-note">{confirmed.count} payouts completed and saved to Activity.</p>}
        </section>
      </div>
    </div>
  );
}

function SendFunds({ projects }) {
  const [amount, setAmount] = useState(1500);
  const [selected, setSelected] = useState(0);
  const recipients = [
    { initials:"AN", name:"Ana Navarro", email:"ana@studio.co", color:C.yellow },
    { initials:"JK", name:"James K.", email:"james@studiomail.com", color:C.pink },
  ];
  const fee = +(amount * 0.01).toFixed(2);
  const receives = +(amount - fee).toFixed(2);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-kicker">Payments</div>
          <h1 className="page-title">Send funds</h1>
        </div>
      </div>
      <div className="payment-layout">
        <div className="surface-panel">
          <div className="panel-title">Amount</div>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="amount-input" />
          <div className="panel-title">To</div>
          {recipients.map((r,i) => (
            <div key={i} onClick={() => setSelected(i)}
              className={`recipient-choice ${selected===i ? "selected" : ""}`}
              style={{ borderColor:selected===i ? r.color : undefined, background:selected===i ? `${r.color}0f` : undefined }}>
              <div className="project-avatar circle" style={{ background:`${r.color}22`, color:r.color }}>{r.initials}</div>
              <div>
                <div className="project-row-title">{r.name}</div>
                <div className="project-row-subtitle">{r.email}</div>
              </div>
              {selected===i && <div className="recipient-selected" style={{ color:r.color }}>Selected</div>}
            </div>
          ))}
          <div className="payment-form-stack">
            <div className="panel-title">From project</div>
            <select className="fuel-input">
              {projects.map(p => <option key={p.id}>{p.name} - {formatMoney(p.balance || 0)} available</option>)}
            </select>
            <div className="panel-title">Note</div>
            <input placeholder="e.g. Design milestone payout" className="fuel-input" />
          </div>
        </div>
        <div className="payment-summary">
          <div className="surface-panel">
            <div className="panel-title">Summary</div>
            {[
              { label:"You send", value:formatMoney(amount) },
              { label:"FUEL fee (1%)", value:formatMoney(fee) },
              { label:"They receive", value:formatMoney(receives), gold:true },
              { label:"Delivery", value:"Instant" },
            ].map((row,i) => (
              <div key={i} className="summary-row">
                <span>{row.label}</span>
                <strong style={{ color:row.gold ? C.yellow : undefined }}>{row.value}</strong>
              </div>
            ))}
          </div>
          <button className="primary-action full-width-action large-action">
            Send {formatMoney(amount)}
          </button>
          <p className="summary-footnote">Instant settlement · No conversion fees</p>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ tx, compact=false }) {
  return (
    <div className={compact ? "activity-line compact" : "activity-line"}>
      <div className="activity-icon" style={{ color:tx.color }}>{tx.type === "in" ? "↓" : tx.type === "payout" ? "↑" : "⋮"}</div>
      <div>
        <strong>{tx.label}</strong>
        <span>{tx.projectName} · {tx.date} · {tx.status}</span>
        {tx.history?.length > 0 && !compact && (
          <div className="mini-history">
            {tx.history.map(status => <em key={status}>{status}</em>)}
          </div>
        )}
      </div>
      <b>{tx.displayAmount}</b>
    </div>
  );
}

function ActivityPage({ transactions }) {
  const latestPayout = transactions.find(tx => tx.type === "payout" && tx.history?.length);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-kicker">Activity</div>
          <h1 className="page-title">Status history</h1>
        </div>
      </div>
      <section className="receive-hero compact">
        <div>
          <div className="deck-kicker">Audit trail</div>
          <strong>Every simulated receipt, fee, payout batch, and delivery state lives in one running ledger.</strong>
        </div>
      </section>
      <div className="activity-page-grid">
        <section className="receive-panel">
          <div className="panel-title">Activity feed</div>
          {transactions.length
            ? transactions.map(tx => <ActivityRow key={tx.id} tx={tx} />)
            : <p className="empty-state">No activity yet. Simulate a client payment to start the feed.</p>
          }
        </section>
        <section className="receive-panel">
          <div className="panel-title">Latest payout status</div>
          {latestPayout ? latestPayout.history.map((status, index) => (
            <div className={`status-row status-${Math.min(index + 1, 3)}`} key={status}>
              <span />
              <strong>{status}</strong>
            </div>
          )) : <p className="empty-state">Confirm a payout to see pending, sent, and completed status history.</p>}
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [creating, setCreating] = useState(false);
  const [projects, setProjects] = useState(() => normalizeProjects(loadLocal(PROJECTS_KEY, defaultProjects)));
  const [transactions, setTransactions] = useState(() => loadLocal(TRANSACTIONS_KEY, defaultTransactions));
  const [lastSplit, setLastSplit] = useState(null);
  const [user, setUser] = useState(() => loadLocal(USER_KEY, null));

  useEffect(() => saveLocal(PROJECTS_KEY, projects), [projects]);
  useEffect(() => saveLocal(TRANSACTIONS_KEY, transactions), [transactions]);

  function handleProjectDone(newProject) {
    const normalizedProject = {
      ...newProject,
      id:Date.now(),
      balance:0,
      pct:0,
      splitMembers:newProject.splitMembers?.length ? newProject.splitMembers : [{ name:"You", role:"Owner", email:"you@email.com", initials:"YN", pct:100, color:newProject.accent }],
    };
    setProjects(prev => [...prev, normalizedProject]);
    setTransactions(prev => [
      makeTransaction({
        type:"project",
        projectId:normalizedProject.id,
        projectName:normalizedProject.name,
        label:"Project created",
        amount:0,
        displayAmount:"New",
        status:"Active",
        color:normalizedProject.accent,
      }),
      ...prev,
    ]);
    setCreating(false);
    setPage("Projects");
  }

  function handleLogin(nextUser) {
    setUser(nextUser);
    saveLocal(USER_KEY, nextUser);
    setCreating(false);
    setPage("Dashboard");
  }

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem(USER_KEY);
    setCreating(false);
    setPage("Home");
  }

  function startCreateProject() {
    if (!user) {
      setPage("Login");
      return;
    }
    setCreating(true);
  }

  function simulateFunds(projectId, amount) {
    const project = projects.find(item => item.id === projectId);
    const split = calculateSplit(project, amount);
    setLastSplit(split);
    setProjects(prev => prev.map(item => item.id === projectId ? { ...item, balance:Number((Number(item.balance || 0) + amount).toFixed(2)), pct:100 } : item));
    setTransactions(prev => [
      makeTransaction({
        type:"split",
        projectId:project.id,
        projectName:project.name,
        label:"Split preview generated",
        amount,
        displayAmount:`${split.recipients.length} payouts`,
        status:"Ready",
        color:C.orange,
      }),
      makeTransaction({
        type:"in",
        projectId:project.id,
        projectName:project.name,
        label:"Client payment simulated",
        amount,
        displayAmount:signedMoney(amount),
        status:"Completed",
        color:C.yellow,
      }),
      ...prev,
    ]);
    return split;
  }

  function confirmPayouts(split) {
    const project = projects.find(item => item.id === split.projectId);
    const payoutTransactions = split.recipients.map(recipient => makeTransaction({
      type:"payout",
      projectId:split.projectId,
      projectName:split.projectName,
      label:`Payout to ${recipient.name}`,
      amount:-recipient.amount,
      displayAmount:signedMoney(-recipient.amount),
      status:"Completed",
      color:recipient.color,
      history:["Pending","Sent","Completed"],
    }));
    const feeTransaction = makeTransaction({
      type:"fee",
      projectId:split.projectId,
      projectName:split.projectName,
      label:"FUEL platform fee",
      amount:-split.fee,
      displayAmount:signedMoney(-split.fee),
      status:"Completed",
      color:C.muted,
    });
    setProjects(prev => prev.map(item => item.id === split.projectId ? { ...item, balance:Number(Math.max(0, Number(item.balance || 0) - split.amount).toFixed(2)), pct:0 } : item));
    setTransactions(prev => [
      ...payoutTransactions,
      feeTransaction,
      makeTransaction({
        type:"split",
        projectId:split.projectId,
        projectName:project?.name || split.projectName,
        label:"Payout batch confirmed",
        amount:-split.pool,
        displayAmount:`${split.recipients.length} sent`,
        status:"Completed",
        color:C.orange,
        history:["Pending","Sent","Completed"],
      }),
      ...prev,
    ]);
    return { history:["Pending","Sent","Completed"], count:split.recipients.length };
  }

  const protectedPage = ["Dashboard","Projects","Receive","Payments","Activity"].includes(page);
  const showAppChrome = user && (protectedPage || creating);

  return (
    <div className="app-shell" style={{ display:"grid", gridTemplateColumns:"240px 1fr", minHeight:"100vh", background:C.bg, fontFamily:fonts }}>
      <Sidebar page={page} setPage={(p) => { setCreating(false); setPage(p); }} projects={projects} user={user} onLogout={handleLogout} />
      <div className="app-main">
        {showAppChrome && <AppTopbar page={creating ? "Create Project" : page} user={user} projects={projects} transactions={transactions} />}
        {creating
          ? <CreateProject onDone={handleProjectDone} onCancel={() => setCreating(false)} />
          : page==="Home" ? <Home setPage={setPage} onCreateProject={startCreateProject} user={user} />
          : page==="About" ? <About />
          : page==="Login" || (!user && protectedPage) ? <Login onLogin={handleLogin} />
          : page==="Dashboard" ? <Dashboard projects={projects} transactions={transactions} setPage={setPage} />
          : page==="Projects" ? <Projects projects={projects} onCreateProject={startCreateProject} />
          : page==="Receive" ? <ReceiveFunds projects={projects} onSimulateFunds={simulateFunds} onConfirmPayouts={confirmPayouts} lastSplit={lastSplit} />
          : page==="Payments" ? <SendFunds projects={projects} />
          : <ActivityPage transactions={transactions} />
        }
      </div>
    </div>
  );
}
