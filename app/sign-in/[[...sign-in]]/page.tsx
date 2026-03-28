import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
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
      <div style={{ width: "100%", maxWidth: "680px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", background: "linear-gradient(135deg, #22d3ee, #6366f1)",
            borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", boxShadow: "0 0 20px rgba(34,211,238,0.4)"
          }}>⚡</div>
          <h1 style={{
            fontSize: "28px", fontWeight: "800", margin: 0,
            background: "linear-gradient(135deg, #22d3ee, #6366f1)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>ClipForge</h1>
        </div>
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{
                background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                color: "#fff", fontWeight: "600", padding: "8px 20px",
                borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px"
              }}>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 12px" }}>
          AI-powered gaming clip editor
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {["🎮 Gaming", "🤖 AI Powered", "⚡ Fast"].map((tag) => (
            <span key={tag} style={{
              background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
              color: "#22d3ee", padding: "4px 12px", borderRadius: "20px", fontSize: "12px"
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <SignedIn>
        <div style={{
          width: "100%", maxWidth: "680px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(34,211,238,0.15)",
          borderRadius: "24px", padding: "32px",
          boxShadow: "0 0 40px rgba(34,211,238,0.05), 0 20px 60px rgba(0,0,0,0.5)"
        }}>
          <UploadBox />
        </div>
      </SignedIn>

      <SignedOut>
        <div style={{
          width: "100%", maxWidth: "680px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(34,211,238,0.15)",
          borderRadius: "24px", padding: "60px 32px",
          textAlign: "center",
          boxShadow: "0 0 40px rgba(34,211,238,0.05)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎮</div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 12px" }}>
            Welcome to ClipForge
          </h2>
          <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 32px" }}>
            Sign in to start creating AI-powered gaming highlights
          </p>
          <SignInButton mode="modal">
            <button style={{
              background: "linear-gradient(135deg, #22d3ee, #6366f1)",
              color: "#fff", fontWeight: "700", padding: "14px 40px",
              borderRadius: "12px", border: "none", cursor: "pointer",
              fontSize: "16px", boxShadow: "0 0 20px rgba(34,211,238,0.3)"
            }}>
              ⚡ Get Started — Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <p style={{ color: "#1e293b", marginTop: "40px", fontSize: "13px" }}>
        ClipForge © 2025 — Built for Gamers
      </p>
    </main>
  );
}