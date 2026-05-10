import { useState } from "react";
import { createProjectWallet } from "./solana";

// ── FUEL Design System ─────────────────────────────────────────────────────
// Logo gradient: #41ECFF (cyan) → #7E2EFF (purple)
const C = {
  bg:       "#06080F",
  surface:  "#0C1020",
  card:     "#101828",
  inner:    "#141D2E",
  border:   "rgba(255,255,255,0.07)",
  borderMd: "rgba(255,255,255,0.12)",
  cyan:     "#41ECFF",
  purple:   "#7E2EFF",
  purpleD:  "#6118E8",
  green:    "#22D47E",
  red:      "#FF4D4D",
  light:    "#F0F4FF",
  mid:      "#8A96B0",
  dim:      "#4A5570",
};

const fontDisplay = "'Sora', 'DM Sans', sans-serif";
const fontBody    = "'IBM Plex Sans', 'DM Sans', sans-serif";
const fontMono    = "'IBM Plex Mono', monospace";

const COLORS = ["#7E2EFF", "#41ECFF", "#22D47E", "#FF6B6B", "#F59E0B"];
const memberColors = ["#7E2EFF", "#41ECFF", "#22D47E", "#F59E0B", "#FF6B6B"];

const TRIGGER_OPTIONS = [
  { id:"instant",   label:"Instant",   sub:"On deposit", desc:"Splits fire the moment funds arrive. Best for project-based work.",              color:C.cyan,   icon:"⚡" },
  { id:"threshold", label:"Threshold", sub:"On balance",  desc:"Fires when wallet reaches a set amount. Great for donation wallets and DAOs.",   color:C.purple, icon:"◈"  },
  { id:"scheduled", label:"Scheduled", sub:"Time-based",  desc:"Weekly or monthly distributions, like a salary. Best for retainers.",            color:"#22D47E",icon:"◷"  },
];

const inp = {
  width:"100%", background:"#080B14", border:"1px solid rgba(255,255,255,0.08)",
  borderRadius:8, padding:"11px 14px", fontSize:13.5, color:"#F0F4FF",
  fontFamily:"'IBM Plex Sans', 'DM Sans', sans-serif", outline:"none",
  marginBottom:14, boxSizing:"border-box",
};

const Label = ({ children }) => (
  <div style={{ fontSize:10.5, fontWeight:600, color:"#4A5570", textTransform:"uppercase", letterSpacing:".1em", marginBottom:7, fontFamily:"'IBM Plex Sans', sans-serif" }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize:10, fontWeight:700, color:"#41ECFF", textTransform:"uppercase", letterSpacing:".12em", marginBottom:14, fontFamily:"'IBM Plex Sans', sans-serif" }}>
    {children}
  </div>
);

const BtnPrimary = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#7E2EFF,#6118E8)",
    color: disabled ? "#4A5570" : "#fff",
    border:"none", borderRadius:9, padding:"11px 22px", fontSize:13, fontWeight:600,
    cursor: disabled ? "default" : "pointer",
    fontFamily:"'IBM Plex Sans', sans-serif", letterSpacing:".02em",
    boxShadow: disabled ? "none" : "0 4px 20px rgba(126,46,255,0.35)",
  }}>
    {children}
  </button>
);

const BtnGhost = ({ onClick, children }) => (
  <button onClick={onClick} style={{
    background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9,
    padding:"11px 18px", fontSize:13, color:"#8A96B0", cursor:"pointer",
    fontFamily:"'IBM Plex Sans', sans-serif",
  }}>
    {children}
  </button>
);

const StepBar = ({ step }) => (
  <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
    {[["1","Details"],["2","Members"],["3","Wallet"]].map(([n,lbl],i) => {
      const done = step > i + 1;
      const active = step === i + 1;
      return (
        <div key={n} style={{ display:"flex", alignItems:"center" }}>
          {i > 0 && (
            <div style={{
              width:48, height:1, margin:"0 12px",
              background: step > i ? "linear-gradient(90deg,#7E2EFF,#41ECFF)" : "rgba(255,255,255,0.08)",
            }} />
          )}
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{
              width:30, height:30, borderRadius:"50%",
              background: done ? "#22D47E" : active ? "#7E2EFF" : "rgba(255,255,255,0.06)",
              color: (done || active) ? "#fff" : "#4A5570",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: done ? 13 : 12, fontWeight:700,
              fontFamily:"'Sora', sans-serif",
              boxShadow: active ? "0 0 16px rgba(126,46,255,0.45)" : "none",
            }}>
              {done ? "✓" : n}
            </div>
            <span style={{
              fontSize:12.5, fontWeight: active ? 600 : 400,
              color: active ? "#F0F4FF" : done ? "#41ECFF" : "#4A5570",
              fontFamily:"'IBM Plex Sans', sans-serif",
            }}>
              {lbl}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

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
      splitMembers: members.map(m => ({ ...m, role: m.name.includes("owner") ? "Owner" : "Contributor" })),
      walletAddress: wallet?.address,
      trigger: form.trigger,
      thresholdAmount: form.thresholdAmount,
      scheduleFrequency: form.scheduleFrequency,
    });
  }

  const panel = {
    background:"#101828", border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:16, padding:28,
  };

  return (
    <div style={{ padding:"36px 32px", fontFamily:"'IBM Plex Sans', sans-serif", background:"#06080F", minHeight:"100vh" }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:10.5, color:"#4A5570", textTransform:"uppercase", letterSpacing:".12em", marginBottom:8 }}>
          New project
        </div>
        <h1 style={{
          fontSize:30, fontWeight:700, letterSpacing:"-.6px", margin:0,
          fontFamily:"'Sora', sans-serif",
          background:"linear-gradient(135deg,#F0F4FF 40%,#41ECFF)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>
          Create project
        </h1>
      </div>

      <StepBar step={step} />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div style={panel}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>

            {/* Left */}
            <div>
              <SectionTitle>Project info</SectionTitle>
              <Label>Project name *</Label>
              <input style={inp} placeholder="e.g. Brand Campaign 2026" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              <Label>Description</Label>
              <input style={inp} placeholder="What is this project for?" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
              <Label>Category</Label>
              <input style={inp} placeholder="e.g. Creative, Tech, Research" value={form.category} onChange={e => setForm({...form, category:e.target.value})} />
              <Label>Currency</Label>
              <select style={{...inp, marginBottom:0}} value={form.currency} onChange={e => setForm({...form, currency:e.target.value})}>
                <option>USD</option><option>EUR</option><option>CAD</option><option>MXN</option>
              </select>
            </div>

            {/* Right */}
            <div>
              <SectionTitle>Appearance & rules</SectionTitle>
              <Label>Project color</Label>
              <div style={{ display:"flex", gap:10, marginBottom:22 }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({...form, color:c})} style={{
                    width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer",
                    outline: form.color===c ? "2px solid #F0F4FF" : "2px solid transparent",
                    outlineOffset:3,
                    boxShadow: form.color===c ? `0 0 12px ${c}88` : "none",
                  }} />
                ))}
              </div>

              <Label>Split trigger</Label>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
                {TRIGGER_OPTIONS.map(opt => {
                  const active = form.trigger === opt.id;
                  return (
                    <div key={opt.id} onClick={() => setForm({...form, trigger:opt.id})} style={{
                      display:"flex", alignItems:"flex-start", gap:12,
                      padding:"12px 14px",
                      border:`1px solid ${active ? opt.color+"66" : "rgba(255,255,255,0.07)"}`,
                      borderRadius:10, cursor:"pointer",
                      background: active ? `${opt.color}10` : "transparent",
                    }}>
                      <div style={{
                        width:32, height:32, borderRadius:8, flexShrink:0,
                        background: active ? `${opt.color}22` : "rgba(255,255,255,0.04)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14, color: active ? opt.color : "#4A5570",
                      }}>
                        {opt.icon}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: active ? "#F0F4FF" : "#8A96B0", marginBottom:3 }}>
                          {opt.label}
                          <span style={{
                            fontSize:10.5, fontWeight:500, color:opt.color,
                            background:`${opt.color}18`, padding:"2px 7px",
                            borderRadius:20, marginLeft:8,
                          }}>
                            {opt.sub}
                          </span>
                        </div>
                        <div style={{ fontSize:11, color:"#4A5570", lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {form.trigger === "threshold" && (
                <>
                  <Label>Trigger amount (USD)</Label>
                  <input style={inp} type="number" placeholder="e.g. 5000" value={form.thresholdAmount} onChange={e => setForm({...form, thresholdAmount:e.target.value})} />
                </>
              )}
              {form.trigger === "scheduled" && (
                <>
                  <Label>Distribution frequency</Label>
                  <select style={inp} value={form.scheduleFrequency} onChange={e => setForm({...form, scheduleFrequency:e.target.value})}>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </>
              )}
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:24, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <BtnGhost onClick={onCancel}>Cancel</BtnGhost>
            <BtnPrimary onClick={() => form.name && setStep(2)} disabled={!form.name}>
              Next: Add members →
            </BtnPrimary>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div style={panel}>
          <SectionTitle>Team members</SectionTitle>

          {members.map((m,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{
                width:36, height:36, borderRadius:"50%",
                background:`${m.color}18`, border:`1px solid ${m.color}40`,
                color:m.color, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, flexShrink:0, fontFamily:"'Sora', sans-serif",
              }}>
                {m.initials}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:"#F0F4FF" }}>{m.name}</div>
                <div style={{ fontSize:11, color:"#4A5570", marginTop:2 }}>{m.email}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input type="number" min="0" max="100" value={m.pct} onChange={e => updatePct(i,e.target.value)} style={{
                  width:68, background:"#141D2E", border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:7, padding:"7px 10px", fontSize:13, color:"#F0F4FF",
                  fontFamily:"'IBM Plex Mono', monospace", textAlign:"center", outline:"none",
                }} />
                <span style={{ fontSize:13, color:"#4A5570" }}>%</span>
              </div>
            </div>
          ))}

          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            <input placeholder="teammate@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && addMember()}
              style={{ ...inp, marginBottom:0, flex:1 }} />
            <button onClick={addMember} style={{
              background:"rgba(126,46,255,0.12)", border:"1px solid rgba(126,46,255,0.35)",
              borderRadius:8, padding:"9px 14px", fontSize:13, color:"#41ECFF",
              cursor:"pointer", fontFamily:"'IBM Plex Sans', sans-serif", fontWeight:600,
            }}>
              + Add
            </button>
          </div>

          <div style={{ height:6, borderRadius:3, background:"#141D2E", overflow:"hidden", margin:"18px 0 8px", display:"flex", gap:2 }}>
            {members.map((m,i) => (
              <div key={i} style={{ height:"100%", width:`${m.pct}%`, background:m.color, borderRadius:2, boxShadow:`0 0 8px ${m.color}88` }} />
            ))}
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:24 }}>
            <span style={{ color:"#4A5570" }}>Total allocation</span>
            <span style={{ color: totalPct===100 ? "#22D47E" : "#FF4D4D", fontWeight:700, fontFamily:"'IBM Plex Mono', monospace" }}>
              {totalPct}% {totalPct===100 ? "✓" : "— must equal 100%"}
            </span>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <BtnGhost onClick={() => setStep(1)}>← Back</BtnGhost>
            <BtnPrimary onClick={handleCreateWallet} disabled={totalPct!==100||loading}>
              {loading ? "Creating wallet…" : "Next: Create wallet →"}
            </BtnPrimary>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && wallet && (
        <div style={panel}>
          <div style={{ textAlign:"center", padding:"12px 0 28px" }}>
            <div style={{
              width:60, height:60, borderRadius:"50%", margin:"0 auto 18px",
              background:"linear-gradient(135deg,rgba(126,46,255,0.2),rgba(65,236,255,0.14))",
              border:"1px solid rgba(126,46,255,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, boxShadow:"0 0 30px rgba(126,46,255,0.35)",
            }}>◎</div>
            <div style={{ fontSize:20, fontWeight:700, color:"#F0F4FF", marginBottom:8, fontFamily:"'Sora', sans-serif" }}>
              Project wallet created!
            </div>
            <div style={{ fontSize:13, color:"#8A96B0" }}>
              Solana wallet generated for <span style={{ color:"#41ECFF", fontWeight:600 }}>{form.name}</span>
            </div>
          </div>

          {/* Wallet address */}
          <div style={{ background:"#141D2E", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"13px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:10.5, fontWeight:700, color:"#4A5570", textTransform:"uppercase", letterSpacing:".1em" }}>Wallet address</span>
              <span style={{ fontSize:10, fontWeight:600, padding:"2px 9px", borderRadius:20, background:"rgba(126,46,255,0.15)", color:"#41ECFF", border:"1px solid rgba(126,46,255,0.35)" }}>◎ Solana devnet</span>
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#8A96B0", wordBreak:"break-all", lineHeight:1.7 }}>{wallet.address}</div>
          </div>

          {/* Split rules */}
          <div style={{ background:"#141D2E", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"13px 16px", marginBottom:10 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:"#4A5570", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Split rules</div>
            <div style={{ fontSize:13, color:"#F0F4FF" }}>
              {members.map((m,i) => (
                <span key={i} style={{ marginRight:16 }}>
                  <span style={{ color:m.color, fontWeight:600 }}>{m.name}</span>
                  <span style={{ color:"#4A5570" }}> {m.pct}%</span>
                </span>
              ))}
            </div>
          </div>

          {/* Split trigger */}
          <div style={{ background:"#141D2E", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"13px 16px", marginBottom:10 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:"#4A5570", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Split trigger</div>
            {(() => {
              const opt = TRIGGER_OPTIONS.find(o => o.id === form.trigger);
              return (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:opt.color, boxShadow:`0 0 8px ${opt.color}` }} />
                  <span style={{ fontSize:13, fontWeight:600, color:opt.color }}>{opt.label}</span>
                  <span style={{ fontSize:12, color:"#8A96B0" }}>
                    {opt.sub}
                    {form.trigger==="threshold" && form.thresholdAmount && ` — fires at $${Number(form.thresholdAmount).toLocaleString()}`}
                    {form.trigger==="scheduled" && ` — ${form.scheduleFrequency}`}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Privacy note */}
          <div style={{ background:"#141D2E", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"13px 16px", display:"flex", gap:14, alignItems:"center", marginBottom:28 }}>
            <div style={{ fontSize:22 }}>◎</div>
            <div>
              <div style={{ fontSize:12.5, fontWeight:600, color:"#F0F4FF" }}>Invisible to your team</div>
              <div style={{ fontSize:11.5, color:"#4A5570", marginTop:3 }}>Members see USD. Solana runs silently underneath.</div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <BtnGhost onClick={() => setStep(2)}>← Back</BtnGhost>
            <BtnPrimary onClick={handleLaunch}>Launch project →</BtnPrimary>
          </div>
        </div>
      )}
    </div>
  );
}
