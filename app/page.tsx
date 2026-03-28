import UploadBox from "@/components/UploadBox";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0f1e 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            width: "48px", height: "48px", background: "linear-gradient(135deg, #22d3ee, #6366f1)",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", boxShadow: "0 0 20px rgba(34,211,238,0.4)"
          }}>⚡</div>
          <h1 style={{
            fontSize: "42px", fontWeight: "800", margin: 0,
            background: "linear-gradient(135deg, #22d3ee, #6366f1, #a855f7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-1px"
          }}>ClipForge</h1>
        </div>
        <p style={{ color: "#64748b", fontSize: "16px", margin: 0, letterSpacing: "0.5px" }}>
          AI-powered gaming clip editor
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px" }}>
          {["🎮 Gaming", "🤖 AI Powered", "⚡ Fast"].map((tag) => (
            <span key={tag} style={{
              background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
              color: "#22d3ee", padding: "4px 12px", borderRadius: "20px", fontSize: "12px"
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div style={{
        width: "100%", maxWidth: "680px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(34,211,238,0.15)",
        borderRadius: "24px", padding: "32px",
        boxShadow: "0 0 40px rgba(34,211,238,0.05), 0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <UploadBox />
      </div>

      {/* Footer */}
      <p style={{ color: "#1e293b", marginTop: "40px", fontSize: "13px" }}>
        ClipForge © 2025 — Built for Gamers
      </p>

    </main>
  );
}