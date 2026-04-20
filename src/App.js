import { useState } from "react";
import CreateProject from "./CreateProject";
import "./App.css";

const C = {
  bg:"#0F0B2A", sidebar:"#1A0A12", card:"#1A0A12",
  border:"rgb(42, 26, 46)", inner:"#150818",
  yellow:"#49b0ff", pink:"#4B4BD4", orange:"#2B8EF0",
  light:"#F8F8FA", muted:"#888", dim:"#555",
};
const fonts = "'DM Sans', sans-serif";
const titleFonts = "'DM Sans', sans-serif";

const defaultProjects = [
  { id:1, initials:"BC", name:"Brand Campaign", members:4, balance:6200, pct:67, split:"40/30/30", accent:"#FFDD76" },
  { id:2, initials:"DS", name:"Dev Sprint Q2",  members:2, balance:3750, pct:42, split:"60/40",    accent:"#E74C89" },
  { id:3, initials:"RF", name:"Research Fund",  members:3, balance:2530, pct:25, split:"Equal",    accent:"#FEA55B" },
];

const activity = [
  { type:"in",    label:"Client payment · Brand",    date:"Today, 2:14 PM", amount:"+$5,000", color:"#FFDD76" },
  { type:"split", label:"Auto split triggered",      date:"Today, 2:14 PM", amount:"–$5,000", color:"#FEA55B" },
  { type:"out",   label:"Payout · Ana N.",           date:"Yesterday",      amount:"–$1,500", color:"#E74C89" },
  { type:"in",    label:"Invoice paid · Dev Sprint", date:"Apr 11",         amount:"+$3,200", color:"#FFDD76" },
];

function Sidebar({ page, setPage, projects }) {
  const nav = ["Dashboard","Projects","Payments","Activity"];
  return (
    <div style={{ background:C.sidebar, borderRight:`1px solid ${C.border}`, padding:"24px 0", display:"flex", flexDirection:"column", fontFamily:fonts, height:"100vh", position:"sticky", top:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 20px 32px" }}>
        <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg, #FEA55B, #E74C89)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"white", fontFamily:titleFonts }}>F</div>
        <span style={{ fontSize:18, fontWeight:700, color:C.light, letterSpacing:"-.3px", fontFamily:titleFonts }}>fuel</span>
      </div>
      <div style={{ fontSize:10, color:C.dim, letterSpacing:".1em", textTransform:"uppercase", padding:"0 20px 8px" }}>Main</div>
      {nav.map(item => (
        <div key={item} onClick={() => setPage(item)}
          style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", fontSize:13, cursor:"pointer",
            borderLeft: page===item ? `2px solid ${C.yellow}` : "2px solid transparent",
            background: page===item ? "rgba(255,221,118,.07)" : "transparent",
            color: page===item ? C.yellow : "#888" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"currentColor", flexShrink:0 }} />
          {item}
        </div>
      ))}
      <div style={{ fontSize:10, color:C.dim, letterSpacing:".1em", textTransform:"uppercase", padding:"20px 20px 8px" }}>Projects</div>
      {projects.map(p => (
        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 20px", fontSize:13, color:"#888", cursor:"pointer" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:p.accent, flexShrink:0 }} />
          {p.name}
        </div>
      ))}
      <div style={{ marginTop:"auto", padding:"16px 20px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:C.yellow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.bg }}>YN</div>
        <div>
          <div style={{ fontSize:13, color:C.light, fontWeight:500, fontFamily:fonts }}>You</div>
          <div style={{ fontSize:11, color:C.dim }}>Owner</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ projects }) {
  const metrics = [
    { label:"Total balance", value:"$12,480", sub:"↑ 18% this month", accent:true },
    { label:"Received",      value:"$18,500", sub:"Across 3 projects" },
    { label:"Paid out",      value:"$6,020",  sub:"8 transactions" },
    { label:"Members",       value:"7",       sub:"All paid on time", subYellow:true },
  ];
  return (
    <div style={{ padding:32, display:"flex", flexDirection:"column", gap:24, fontFamily:fonts }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:11, color:C.dim, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>April 2026</div>
          <h1 style={{ fontSize:32, fontWeight:800, color:C.light, letterSpacing:"-.5px", margin:0, fontFamily:titleFonts }}>Dashboard</h1>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 16px", fontSize:13, color:"#aaa", cursor:"pointer", fontFamily:fonts }}>Receive</button>
          <button style={{ background:C.yellow, color:C.bg, border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:fonts }}>+ Send funds</button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background:m.accent ? C.yellow : C.card, border:`1px solid ${m.accent ? C.yellow : C.border}`, borderRadius:12, padding:18 }}>
            <div style={{ fontSize:11, color:m.accent ? "rgba(30,29,29,.6)":C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>{m.label}</div>
            <div style={{ fontSize:28, fontWeight:800, color:m.accent ? C.bg:C.light, letterSpacing:"-.5px", lineHeight:1, fontFamily:titleFonts }}>{m.value}</div>
            <div style={{ fontSize:11, color:m.accent ? "rgba(30,29,29,.5)":m.subYellow ? C.yellow:C.dim, marginTop:6 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:16 }}>Active projects</div>
          {projects.map(p => (
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.inner}` }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${p.accent}18`, color:p.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{p.initials}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.light }}>{p.name}</div>
                <div style={{ fontSize:11, color:C.dim, marginTop:2 }}>{p.members} members · {p.split} split</div>
                <div style={{ height:2, background:"#222", borderRadius:2, marginTop:7, width:100 }}>
                  <div style={{ height:"100%", width:`${p.pct}%`, background:p.accent, borderRadius:2 }} />
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.light }}>${p.balance.toLocaleString()}</div>
                <div style={{ fontSize:10, color:C.dim, marginTop:3 }}>{p.pct}% remaining</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:16 }}>Recent activity</div>
          {activity.map((tx,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<activity.length-1 ? `1px solid ${C.inner}`:"none" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`${tx.color}18`, color:tx.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>
                {tx.type==="in" ? "↓" : tx.type==="out" ? "↑" : "⋮"}
              </div>
              <div>
                <div style={{ fontSize:12, color:"#ccc" }}>{tx.label}</div>
                <div style={{ fontSize:10, color:C.dim, marginTop:1 }}>{tx.date}</div>
              </div>
              <div style={{ marginLeft:"auto", fontSize:12, fontWeight:600, color:tx.color }}>{tx.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects({ projects, onCreateProject }) {
  return (
    <div style={{ padding:32, fontFamily:fonts }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
        <h1 style={{ fontSize:32, fontWeight:800, color:C.light, letterSpacing:"-.5px", margin:0, fontFamily:titleFonts }}>Projects</h1>
        <button onClick={onCreateProject} style={{ background:C.yellow, color:C.bg, border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:fonts }}>+ New project</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18, cursor:"pointer" }}>
            <div style={{ width:42, height:42, borderRadius:10, background:`${p.accent}18`, color:p.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, marginBottom:14 }}>{p.initials}</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.light, marginBottom:3, fontFamily:titleFonts }}>{p.name}</div>
            <div style={{ fontSize:11, color:C.dim, marginBottom:14 }}>{p.members} members · Active</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.light, marginBottom:6, fontFamily:titleFonts }}>${p.balance.toLocaleString()}</div>
            <div style={{ height:2, background:"#222", borderRadius:2, marginBottom:12 }}>
              <div style={{ height:"100%", width:`${p.pct}%`, background:p.accent, borderRadius:2 }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:p.accent, fontWeight:600 }}>{p.split} split</span>
              <span style={{ fontSize:11, color:C.dim }}>{p.members} members</span>
            </div>
          </div>
        ))}
        <div onClick={onCreateProject} style={{ border:`1px dashed ${C.border}`, borderRadius:14, padding:18, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:180, cursor:"pointer" }}>
          <div style={{ fontSize:28, color:C.border, marginBottom:8 }}>+</div>
          <div style={{ fontSize:13, color:C.dim }}>New project</div>
        </div>
      </div>
    </div>
  );
}

function SendFunds({ projects }) {
  const [amount, setAmount] = useState(1500);
  const [selected, setSelected] = useState(0);
  const recipients = [
    { initials:"AN", name:"Ana Navarro",  email:"ana@studio.co",          color:C.yellow },
    { initials:"JK", name:"James K.",     email:"james@studiomail.com",    color:C.pink },
  ];
  const fee = +(amount * 0.01).toFixed(2);
  const receives = +(amount - fee).toFixed(2);

  return (
    <div style={{ padding:32, fontFamily:fonts }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.dim, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Payments</div>
        <h1 style={{ fontSize:32, fontWeight:800, color:C.light, letterSpacing:"-.5px", margin:0, fontFamily:titleFonts }}>Send funds</h1>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Amount</div>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
            style={{ width:"100%", border:"none", borderBottom:`2px solid ${C.border}`, fontSize:36, fontWeight:700, textAlign:"center", padding:"8px 0", marginBottom:24, background:"transparent", outline:"none", color:C.light, fontFamily:titleFonts }} />
          <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:10 }}>To</div>
          {recipients.map((r,i) => (
            <div key={i} onClick={() => setSelected(i)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", border:`1px solid ${selected===i ? r.color:C.border}`, borderRadius:10, marginBottom:8, cursor:"pointer", background:selected===i ? `${r.color}0f`:"transparent" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:`${r.color}22`, color:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{r.initials}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:C.light }}>{r.name}</div>
                <div style={{ fontSize:11, color:C.dim }}>{r.email}</div>
              </div>
              {selected===i && <div style={{ marginLeft:"auto", fontSize:11, color:r.color, fontWeight:600 }}>● Selected</div>}
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>From project</div>
            <select style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", fontSize:13, marginBottom:14, background:C.bg, color:C.light, fontFamily:fonts }}>
              {projects.map(p => <option key={p.id}>{p.name} — ${p.balance.toLocaleString()} available</option>)}
            </select>
            <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Note</div>
            <input placeholder="e.g. Design milestone payout" style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", fontSize:13, outline:"none", background:C.bg, color:C.light, fontFamily:fonts }} />
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:14 }}>Summary</div>
            {[
              { label:"You send",      value:`$${amount.toLocaleString()}` },
              { label:"FUEL fee (1%)", value:`$${fee}` },
              { label:"They receive",  value:`$${receives.toLocaleString()}`, gold:true },
              { label:"Delivery",      value:"Instant" },
            ].map((row,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"8px 0", borderBottom:i<3 ? `1px solid ${C.inner}`:"none" }}>
                <span style={{ color:C.muted }}>{row.label}</span>
                <span style={{ fontWeight:600, color:row.gold ? C.yellow:C.light }}>{row.value}</span>
              </div>
            ))}
          </div>
          <button style={{ background:C.yellow, color:C.bg, border:"none", borderRadius:10, padding:16, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:fonts }}>
            Send ${amount.toLocaleString()}
          </button>
          <p style={{ fontSize:11, color:C.dim, textAlign:"center", margin:0 }}>Instant settlement · No conversion fees</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [creating, setCreating] = useState(false);
  const [projects, setProjects] = useState(defaultProjects);

  function handleProjectDone(newProject) {
    setProjects(prev => [...prev, { ...newProject, id:Date.now(), balance:0, pct:0 }]);
    setCreating(false);
    setPage("Projects");
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"100vh", background:C.bg, fontFamily:fonts }}>
      <Sidebar page={page} setPage={(p) => { setCreating(false); setPage(p); }} projects={projects} />
      <div>
        {creating
          ? <CreateProject onDone={handleProjectDone} onCancel={() => setCreating(false)} />
          : page==="Dashboard" ? <Dashboard projects={projects} />
          : page==="Projects"  ? <Projects projects={projects} onCreateProject={() => setCreating(true)} />
          : page==="Payments"  ? <SendFunds projects={projects} />
          : <div style={{ padding:32, color:C.dim, fontSize:14, fontFamily:fonts }}>Activity coming soon</div>
        }
      </div>
    </div>
  );
}