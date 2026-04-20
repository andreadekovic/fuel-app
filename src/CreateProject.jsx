import { useState } from "react";
import { createProjectWallet } from "./solana";

const fonts = "'DM Sans', sans-serif";
const titleFonts = "'DM Sans', sans-serif";
const C = {
  bg:"#0F0B2A", sidebar:"#1A0A12", card:"#1A0A12",
  border:"#2a1a2e", inner:"#150818",
  yellow:"#F5E642", pink:"#4B4BD4", orange:"#2B8EF0",
  light:"#F8F8FA", muted:"#888", dim:"#555",
};
const COLORS = ["#F5E642","#4B4BD4","#2B8EF0","#60a5fa","#a78bfa"];
const memberColors = ["#F5E642","#4B4BD4","#2B8EF0","#60a5fa","#a78bfa"];

function generateWallet() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
  return Array.from({length:44}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
}

export default function CreateProject({ onDone, onCancel }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", description:"", category:"", color:"#F5E642", currency:"USD", trigger:"Automatic on receipt" });
  const [members, setMembers] = useState([{ name:"You (owner)", email:"you@email.com", pct:100, color:"#F5E642", initials:"YN" }]);
  const [newEmail, setNewEmail] = useState("");
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalPct = members.reduce((s,m) => s + Number(m.pct), 0);

  function updatePct(i, val) {
    const u = [...members];
    u[i] = {...u[i], pct: Number(val)};
    setMembers(u);
  }

  function addMember() {
    if (!newEmail.trim()) return;
    setMembers([...members, {
      name: newEmail.split("@")[0], email: newEmail, pct: 0,
      color: memberColors[members.length % memberColors.length],
      initials: newEmail.slice(0,2).toUpperCase()
    }]);
    setNewEmail("");
  }

  function handleCreateWallet() {
    setLoading(true);
    setTimeout(() => {
      setWallet({ address: generateWallet() });
      setLoading(false);
      setStep(3);
    }, 1200);
  }

  function handleLaunch() {
    onDone({
      name: form.name || "New Project",
      initials: (form.name || "NP").slice(0,2).toUpperCase(),
      accent: form.color, members: members.length,
      split: members.map(m => m.pct+"%").join("/"),
      walletAddress: wallet?.address,
    });
  }

  const inp = { width:"100%", background:"#0d0820", border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", fontSize:14, color:C.light, fontFamily:fonts, outline:"none", marginBottom:16 };
  const lbl = (t) => <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>{t}</div>;

  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {[["1","Details"],["2","Members"],["3","Wallet"]].map(([n,label],i) => (
        <div key={n} style={{ display:"flex", alignItems:"center" }}>
          {i > 0 && <div style={{ width:40, height:1, background: step>i ? C.yellow : C.border, margin:"0 10px" }} />}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background: step>=i+1 ? C.yellow : "#1a1a2e", color: step>=i+1 ? C.bg : C.dim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>
              {step>i+1 ? "✓" : n}
            </div>
            <span style={{ fontSize:12, fontWeight:600, color: step===i+1 ? C.light : step>i+1 ? C.yellow : C.dim }}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding:32, fontFamily:fonts }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.dim, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>New project</div>
        <h1 style={{ fontSize:28, fontWeight:700, color:C.light, margin:0, fontFamily:titleFonts }}>Create project</h1>
      </div>
      <StepBar />

      {step === 1 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              {lbl("Project name *")}
              <input style={inp} placeholder="e.g. Brand Campaign 2026" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              {lbl("Description")}
              <input style={inp} placeholder="What is this project for?" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
              {lbl("Category")}
              <input style={inp} placeholder="e.g. Creative, Tech, Research" value={form.category} onChange={e => setForm({...form, category:e.target.value})} />
            </div>
            <div>
              {lbl("Project color")}
              <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({...form, color:c})}
                    style={{ width:32, height:32, borderRadius:"50%", background:c, cursor:"pointer", outline: form.color===c ? `2px solid ${C.light}` : "none", outlineOffset:3 }} />
                ))}
              </div>
              {lbl("Currency")}
              <select style={{...inp, marginBottom:16}} value={form.currency} onChange={e => setForm({...form, currency:e.target.value})}>
                <option>USD</option><option>EUR</option><option>CAD</option>
              </select>
              {lbl("Split trigger")}
              <select style={inp} value={form.trigger} onChange={e => setForm({...form, trigger:e.target.value})}>
                <option>Automatic on receipt</option>
                <option>Manual trigger</option>
              </select>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:8 }}>
            <button onClick={onCancel} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 18px", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:fonts }}>Cancel</button>
            <button onClick={() => form.name && setStep(2)} style={{ background: form.name ? C.yellow : "#1a1a2e", color: form.name ? C.bg : C.dim, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:700, cursor: form.name ? "pointer":"default", fontFamily:fonts }}>
              Next: Add members →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          {lbl("Team members")}
          {members.map((m,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.inner}` }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:`${m.color}22`, color:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{m.initials}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.light }}>{m.name}</div>
                <div style={{ fontSize:11, color:C.dim }}>{m.email}</div>
              </div>
              <input type="number" min="0" max="100" value={m.pct} onChange={e => updatePct(i,e.target.value)}
                style={{ width:70, background:"#0d0820", border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 10px", fontSize:13, color:C.light, fontFamily:fonts, textAlign:"center", outline:"none" }} />
              <span style={{ fontSize:13, color:C.dim }}>%</span>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            <input placeholder="teammate@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && addMember()}
              style={{ flex:1, background:"#0d0820", border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:13, color:C.light, fontFamily:fonts, outline:"none" }} />
            <button onClick={addMember} style={{ background:`${C.yellow}22`, border:`1px solid ${C.yellow}44`, borderRadius:8, padding:"9px 14px", fontSize:13, color:C.yellow, cursor:"pointer", fontFamily:fonts }}>+ Add</button>
          </div>
          <div style={{ height:8, borderRadius:4, background:"#0d0820", overflow:"hidden", margin:"16px 0 6px", display:"flex", gap:2 }}>
            {members.map((m,i) => <div key={i} style={{ height:"100%", width:`${m.pct}%`, background:m.color, borderRadius:2 }} />)}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:20 }}>
            <span style={{ color:C.dim }}>Total allocation</span>
            <span style={{ color: totalPct===100 ? "#4ade80":"#f87171", fontWeight:700 }}>{totalPct}% {totalPct===100 ? "✓":"— must equal 100%"}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={() => setStep(1)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 18px", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:fonts }}>← Back</button>
            <button onClick={handleCreateWallet} disabled={totalPct!==100||loading}
              style={{ background: totalPct===100 ? C.yellow:"#1a1a2e", color: totalPct===100 ? C.bg:C.dim, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:700, cursor: totalPct===100?"pointer":"default", fontFamily:fonts }}>
              {loading ? "Creating wallet..." : "Next: Create wallet →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && wallet && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <div style={{ textAlign:"center", padding:"8px 0 24px" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:`${C.yellow}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 16px" }}>◎</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.light, marginBottom:8, fontFamily:titleFonts }}>Project wallet created!</div>
            <div style={{ fontSize:13, color:C.dim }}>Solana wallet generated for <span style={{ color:C.yellow }}>{form.name}</span></div>
          </div>
          <div style={{ background:"#0d0820", border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".06em" }}>Wallet address</span>
              <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:`${C.yellow}22`, color:C.yellow }}>◎ Solana devnet</span>
            </div>
            <div style={{ fontFamily:"monospace", fontSize:11, color:C.muted, wordBreak:"break-all" }}>{wallet.address}</div>
          </div>
          <div style={{ background:"#0d0820", border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Split rules</div>
            <div style={{ fontSize:13, color:C.light }}>{members.map(m => `${m.name}: ${m.pct}%`).join(" · ")}</div>
          </div>
          <div style={{ background:"#0d0820", border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", display:"flex", gap:12, alignItems:"center", marginBottom:24 }}>
            <div style={{ fontSize:20 }}>◎</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.light }}>Invisible to your team</div>
              <div style={{ fontSize:11, color:C.dim, marginTop:2 }}>Members see USD. Solana runs silently underneath.</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={() => setStep(2)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 18px", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:fonts }}>← Back</button>
            <button onClick={handleLaunch} style={{ background:C.yellow, color:C.bg, border:"none", borderRadius:8, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:fonts }}>Launch project →</button>
          </div>
        </div>
      )}
    </div>
  );
}