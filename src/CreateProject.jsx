import { useState } from "react";
import { createProjectWallet } from "./solana";

const C = {
  bg:"#080B14", card:"#0F1525", border:"rgba(255,255,255,.06)", inner:"rgba(255,255,255,.06)",
  inputBg:"#060912",
  yellow:"#7E2EFF", pink:"#41ECFF", orange:"#41ECFF",
  light:"#F5F7F7", muted:"#8C979C", dim:"#5A6468",
  onAccent:"#F5F7F7",
};
const fonts = "'IBM Plex Sans', system-ui, sans-serif";
const titleFonts = "'Sora', system-ui, sans-serif";
const COLORS = ["#7E2EFF","#41ECFF","#080B14","#0F1525","#5B1FD9"];
const memberColors = ["#7E2EFF","#41ECFF","#9D7AFF","#5B1FD9","#6B4DFF"];

const TRIGGER_OPTIONS = [
  { id:"instant",   label:"Instant",   sub:"On deposit", desc:"Splits fire the moment funds arrive. Best for project-based work.", color:"#7E2EFF" },
  { id:"threshold", label:"Threshold", sub:"On balance",  desc:"Fires when wallet reaches a set amount. Great for donation wallets and DAOs.", color:"#41ECFF" },
  { id:"scheduled", label:"Scheduled", sub:"Time-based",  desc:"Weekly or monthly distributions, like a salary. Best for retainers.", color:"#9D7AFF" },
];

export default function CreateProject({ onDone, onCancel }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name:"", description:"", category:"", color:"#7E2EFF", currency:"USD",
    trigger:"instant", thresholdAmount:"", scheduleFrequency:"weekly",
  });
  const [members, setMembers] = useState([{ name:"You (owner)", email:"you@email.com", pct:100, color:"#7E2EFF", initials:"YN" }]);
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

  async function handleCreateWallet() {
    setLoading(true);
    const projectWallet = await createProjectWallet();
    setWallet(projectWallet);
    setLoading(false);
    setStep(3);
  }

  function handleLaunch() {
    onDone({
      name: form.name || "New Project",
      initials: (form.name || "NP").slice(0,2).toUpperCase(),
      accent: form.color,
      members: members.length,
      split: members.map(m => m.pct+"%").join("/"),
      splitMembers: members.map(m => ({ ...m, role:m.name.includes("owner") ? "Owner" : "Contributor" })),
      walletAddress: wallet?.address,
      trigger: form.trigger,
      thresholdAmount: form.thresholdAmount,
      scheduleFrequency: form.scheduleFrequency,
    });
  }

  const inp = { width:"100%", background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", fontSize:14, color:C.light, fontFamily:fonts, outline:"none", marginBottom:16 };
  const label = (t) => <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>{t}</div>;

  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {[["1","Details"],["2","Members"],["3","Wallet"]].map(([n,lbl],i) => (
        <div key={n} style={{ display:"flex", alignItems:"center" }}>
          {i > 0 && <div style={{ width:40, height:1, background: step>i ? C.yellow : C.border, margin:"0 10px" }} />}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background: step>=i+1 ? C.yellow : "rgba(255,255,255,.08)", color: step>=i+1 ? C.onAccent : C.dim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>
              {step>i+1 ? "✓" : n}
            </div>
            <span style={{ fontSize:12, fontWeight:600, color: step===i+1 ? C.light : step>i+1 ? C.yellow : C.dim }}>{lbl}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding:32, fontFamily:fonts }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.dim, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>New project</div>
        <h1 style={{ fontSize:28, fontWeight:700, color:C.light, letterSpacing:"-.5px", margin:0, fontFamily:titleFonts }}>Create project</h1>
      </div>
      <StepBar />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              {label("Project name *")}
              <input style={inp} placeholder="e.g. Brand Campaign 2026" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              {label("Description")}
              <input style={inp} placeholder="What is this project for?" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
              {label("Category")}
              <input style={inp} placeholder="e.g. Creative, Tech, Research" value={form.category} onChange={e => setForm({...form, category:e.target.value})} />
              {label("Currency")}
              <select style={{...inp, marginBottom:0}} value={form.currency} onChange={e => setForm({...form, currency:e.target.value})}>
                <option>USD</option><option>EUR</option><option>CAD</option><option>MXN</option>
              </select>
            </div>
            <div>
              {label("Project color")}
              <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({...form, color:c})}
                    style={{ width:32, height:32, borderRadius:"50%", background:c, cursor:"pointer", outline: form.color===c ? "2px solid #F5F7F7" : "none", outlineOffset:3 }} />
                ))}
              </div>

              {label("Split trigger")}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                {TRIGGER_OPTIONS.map(opt => (
                  <div key={opt.id}
                    onClick={() => setForm({...form, trigger:opt.id})}
                    style={{
                      display:"flex", alignItems:"flex-start", gap:12,
                      padding:"12px 14px",
                      border:`1px solid ${form.trigger===opt.id ? opt.color : C.border}`,
                      borderRadius:10, cursor:"pointer",
                      background: form.trigger===opt.id ? `${opt.color}18` : "transparent",
                    }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", marginTop:4,
                      background: form.trigger===opt.id ? opt.color : "rgba(255,255,255,.2)",
                      flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color: form.trigger===opt.id ? C.light : C.muted }}>
                        {opt.label}
                        <span style={{ fontSize:11, fontWeight:400, color:opt.color, marginLeft:8 }}>{opt.sub}</span>
                      </div>
                      <div style={{ fontSize:10, color:C.dim, marginTop:3 }}>{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {form.trigger === "threshold" && (
                <div>
                  {label("Trigger amount (USD)")}
                  <input style={inp} type="number" placeholder="e.g. 5000"
                    value={form.thresholdAmount}
                    onChange={e => setForm({...form, thresholdAmount:e.target.value})} />
                </div>
              )}
              {form.trigger === "scheduled" && (
                <div>
                  {label("Distribution frequency")}
                  <select style={inp} value={form.scheduleFrequency}
                    onChange={e => setForm({...form, scheduleFrequency:e.target.value})}>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:8 }}>
            <button onClick={onCancel} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 18px", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:fonts }}>Cancel</button>
            <button onClick={() => form.name && setStep(2)} style={{ background: form.name ? C.yellow : "#1a1f2e", color: form.name ? C.onAccent : C.dim, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:700, cursor: form.name ? "pointer":"default", fontFamily:fonts }}>
              Next: Add members →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          {label("Team members")}
          {members.map((m,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.inner}` }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:`${m.color}22`, color:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{m.initials}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.light }}>{m.name}</div>
                <div style={{ fontSize:11, color:C.dim }}>{m.email}</div>
              </div>
              <input type="number" min="0" max="100" value={m.pct} onChange={e => updatePct(i,e.target.value)}
                style={{ width:70, background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 10px", fontSize:13, color:C.light, fontFamily:fonts, textAlign:"center", outline:"none" }} />
              <span style={{ fontSize:13, color:C.dim }}>%</span>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            <input placeholder="teammate@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && addMember()}
              style={{ flex:1, background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:13, color:C.light, fontFamily:fonts, outline:"none" }} />
            <button onClick={addMember} style={{ background:"rgba(126,46,255,.12)", border:"1px solid rgba(126,46,255,.28)", borderRadius:8, padding:"9px 14px", fontSize:13, color:C.pink, cursor:"pointer", fontFamily:fonts }}>+ Add</button>
          </div>
          <div style={{ height:8, borderRadius:4, background:C.inputBg, overflow:"hidden", margin:"16px 0 6px", display:"flex", gap:2 }}>
            {members.map((m,i) => <div key={i} style={{ height:"100%", width:`${m.pct}%`, background:m.color, borderRadius:2 }} />)}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:20 }}>
            <span style={{ color:C.dim }}>Total allocation</span>
            <span style={{ color: totalPct===100 ? "#4ade80":"#f87171", fontWeight:700 }}>{totalPct}% {totalPct===100 ? "✓":"— must equal 100%"}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={() => setStep(1)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 18px", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:fonts }}>← Back</button>
            <button onClick={handleCreateWallet} disabled={totalPct!==100||loading}
              style={{ background: totalPct===100 ? C.yellow:"#1a1f2e", color: totalPct===100 ? C.onAccent:C.dim, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:700, cursor: totalPct===100?"pointer":"default", fontFamily:fonts }}>
              {loading ? "Creating wallet..." : "Next: Create wallet →"}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && wallet && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <div style={{ textAlign:"center", padding:"8px 0 24px" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(126,46,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 16px", color:C.pink }}>◎</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.light, marginBottom:8, fontFamily:titleFonts }}>Project wallet created!</div>
            <div style={{ fontSize:13, color:C.dim }}>Solana wallet generated for <span style={{ color:C.pink }}>{form.name}</span></div>
          </div>

          <div style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".06em" }}>Wallet address</span>
              <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:"rgba(126,46,255,.18)", color:C.pink }}>◎ Solana devnet</span>
            </div>
            <div style={{ fontFamily:fonts, fontSize:11, color:C.muted, wordBreak:"break-all" }}>{wallet.address}</div>
          </div>

          <div style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Split rules</div>
            <div style={{ fontSize:13, color:C.light }}>{members.map(m => `${m.name}: ${m.pct}%`).join(" · ")}</div>
          </div>

          <div style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Split trigger</div>
            {(() => {
              const opt = TRIGGER_OPTIONS.find(o => o.id === form.trigger);
              return (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:opt.color, flexShrink:0 }} />
                  <div>
                    <span style={{ fontSize:13, fontWeight:600, color:opt.color }}>{opt.label}</span>
                    <span style={{ fontSize:12, color:C.muted, marginLeft:8 }}>
                      {opt.sub}
                      {form.trigger==="threshold" && form.thresholdAmount && ` — fires at $${Number(form.thresholdAmount).toLocaleString()}`}
                      {form.trigger==="scheduled" && ` — ${form.scheduleFrequency}`}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          <div style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", display:"flex", gap:12, alignItems:"center", marginBottom:24 }}>
            <div style={{ fontSize:20, color:C.pink }}>◎</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.light }}>Invisible to your team</div>
              <div style={{ fontSize:11, color:C.dim, marginTop:2 }}>Members see USD. Solana runs silently underneath.</div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={() => setStep(2)} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 18px", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:fonts }}>← Back</button>
            <button onClick={handleLaunch} style={{ background:C.yellow, color:C.onAccent, border:"none", borderRadius:8, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:fonts }}>Launch project →</button>
          </div>
        </div>
      )}
    </div>
  );
}