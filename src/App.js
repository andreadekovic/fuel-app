import { useState } from "react";

const projects = [
  { id: 1, initials: "BC", name: "Brand Campaign", members: 4, status: "Active", balance: 6200, pct: 67, split: "40/30/30", color: "#FAECE7", text: "#993C1D", team: ["MR","JK","AN","+1"] },
  { id: 2, initials: "DS", name: "Dev Sprint Q2", members: 2, status: "Active", balance: 3750, pct: 42, split: "60/40", color: "#EEEDFE", text: "#534AB7", team: ["LM","RO"] },
  { id: 3, initials: "RF", name: "Research Fund", members: 3, status: "Active", balance: 2530, pct: 25, split: "Equal", color: "#E1F5EE", text: "#0F6E56", team: ["KP","SB","TN"] },
];

const activity = [
  { type: "in", label: "Client payment · Brand Campaign", date: "Today, 2:14 PM", amount: "+$5,000", color: "#E1F5EE", textColor: "#0F6E56" },
  { type: "split", label: "Auto split triggered", date: "Today, 2:14 PM", amount: "–$5,000", color: "#EEEDFE", textColor: "#534AB7" },
  { type: "out", label: "Payout · Ana N.", date: "Yesterday", amount: "–$1,500", color: "#FAECE7", textColor: "#993C1D" },
  { type: "in", label: "Invoice paid · Dev Sprint", date: "Apr 11", amount: "+$3,200", color: "#E1F5EE", textColor: "#0F6E56" },
];

const recipients = [
  { initials: "AN", name: "Ana Navarro", email: "ana@studio.co", color: "#FAECE7", text: "#993C1D" },
  { initials: "JK", name: "James K.", email: "james@studiomail.com", color: "#EEEDFE", text: "#534AB7" },
];

function Dashboard() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "8px 14px", fontSize: 13, border: "1px solid #ddd", borderRadius: 8, background: "white", cursor: "pointer" }}>Receive</button>
          <button style={{ padding: "8px 16px", fontSize: 13, border: "none", borderRadius: 8, background: "#D85A30", color: "white", cursor: "pointer" }}>+ Send funds</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Total balance", value: "$12,480", sub: "↑ 18% this month", subColor: "#0F6E56" },
          { label: "Received this month", value: "$18,500", sub: "Across 3 projects", subColor: "#aaa" },
          { label: "Paid out", value: "$6,020", sub: "8 transactions", subColor: "#aaa" },
          { label: "Active members", value: "7", sub: "All paid on time", subColor: "#0F6E56" },
        ].map(m => (
          <div key={m.label} style={{ background: "#f5f5f3", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: m.subColor, marginTop: 3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <div style={{ background: "white", border: "1px solid #eee", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Active projects</div>
          {projects.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: p.color, color: p.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{p.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{p.members} members · Split: {p.split}</div>
                <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, marginTop: 6, width: 120 }}>
                  <div style={{ height: "100%", width: `${p.pct}%`, background: "#D85A30", borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>${p.balance.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", border: "1px solid #eee", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Recent activity</div>
          {activity.map((tx, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < activity.length - 1 ? "1px solid #f5f5f5" : "none" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: tx.color, color: tx.textColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                {tx.type === "in" ? "↓" : tx.type === "out" ? "↑" : "⋮"}
              </div>
              <div>
                <div style={{ fontSize: 12 }}>{tx.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{tx.date}</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 12, fontWeight: 500, color: tx.textColor }}>{tx.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects({ setPage }) {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Projects</h1>
        <button style={{ background: "#D85A30", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>+ New project</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: "white", border: "1px solid #eee", borderRadius: 12, padding: 16, cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color, color: p.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{p.initials}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 12 }}>{p.members} members · {p.status}</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>${p.balance.toLocaleString()}</div>
            <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${p.pct}%`, background: "#D85A30", borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                {p.team.map((t, i) => (
                  <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: p.color, color: p.text, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, marginLeft: i > 0 ? -6 : 0 }}>{t}</div>
                ))}
              </div>
              <span style={{ fontSize: 10, color: "#aaa" }}>{p.split}</span>
            </div>
          </div>
        ))}
        <div style={{ border: "1px dashed #ddd", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, cursor: "pointer" }}>
          <div style={{ fontSize: 24, color: "#ccc", marginBottom: 6 }}>+</div>
          <div style={{ fontSize: 12, color: "#aaa" }}>New project</div>
        </div>
      </div>
    </div>
  );
}

function SendFunds() {
  const [amount, setAmount] = useState(1500);
  const [selected, setSelected] = useState(0);
  const fee = +(amount * 0.01).toFixed(2);
  const receives = +(amount - fee).toFixed(2);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#aaa", marginBottom: 4 }}>Payments</div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Send funds</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <div style={{ background: "white", border: "1px solid #eee", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Amount</div>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
            style={{ width: "100%", border: "none", borderBottom: "2px solid #eee", fontSize: 32, fontWeight: 600, textAlign: "center", padding: "8px 0", marginBottom: 20, background: "transparent", outline: "none" }} />
          <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>To</div>
          {recipients.map((r, i) => (
            <div key={i} onClick={() => setSelected(i)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: `1px solid ${selected === i ? "#D85A30" : "#eee"}`, borderRadius: 8, marginBottom: 6, cursor: "pointer", background: selected === i ? "#FAECE7" : "white" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.color, color: r.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{r.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{r.email}</div>
              </div>
              {selected === i && <div style={{ marginLeft: "auto", fontSize: 11, color: "#0F6E56" }}>● Selected</div>}
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>From project</div>
            <select style={{ width: "100%", border: "1px solid #eee", borderRadius: 8, padding: "10px 12px", fontSize: 13, marginBottom: 14, background: "white" }}>
              <option>Brand Campaign — $6,200 available</option>
            </select>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Note</div>
            <input placeholder="e.g. Design milestone payout" style={{ width: "100%", border: "1px solid #eee", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "white", border: "1px solid #eee", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Transaction summary</div>
            {[
              { label: "You send", value: `$${amount.toLocaleString()}` },
              { label: "FUEL fee (1%)", value: `$${fee}` },
              { label: "They receive", value: `$${receives.toLocaleString()}`, green: true },
              { label: "Delivery", value: "Instant" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                <span style={{ color: "#888" }}>{row.label}</span>
                <span style={{ fontWeight: 500, color: row.green ? "#0F6E56" : "inherit" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <button style={{ background: "#D85A30", color: "white", border: "none", borderRadius: 10, padding: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Send ${amount.toLocaleString()}
          </button>
          <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", margin: 0 }}>Funds settle instantly. No conversion fees for USD.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const navItems = ["Dashboard", "Projects", "Payments", "Activity"];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh", fontFamily: "sans-serif", background: "#f5f5f3" }}>
      <div style={{ background: "white", borderRight: "1px solid #eee", padding: "24px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 28px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#D85A30", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>▲</div>
          <span style={{ fontSize: 17, fontWeight: 600 }}>fuel</span>
        </div>
        {navItems.map(item => (
          <div key={item} onClick={() => setPage(item)}
            style={{ padding: "9px 20px", fontSize: 13, cursor: "pointer", borderLeft: page === item ? "2px solid #D85A30" : "2px solid transparent", background: page === item ? "#FAECE7" : "transparent", color: page === item ? "#D85A30" : "#666" }}>
            {item}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FAECE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#993C1D" }}>YN</div>
          <div>
            <div style={{ fontSize: 13 }}>You</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>Owner</div>
          </div>
        </div>
      </div>
      <div>
        {page === "Dashboard" && <Dashboard />}
        {page === "Projects" && <Projects />}
        {page === "Payments" && <SendFunds />}
        {page === "Activity" && <div style={{ padding: 28, color: "#aaa", fontSize: 14 }}>Activity log coming soon</div>}
      </div>
    </div>
  );
}
