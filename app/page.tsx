"use client";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import UploadBox from "@/components/UploadBox";

export default function Home() {
  const { isSignedIn } = useAuth();

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
      <div style={{ width: "100%", maxWidth: "680px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #22d3ee, #6366f1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⚡</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, background: "linear-gradient(135deg, #22d3ee, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ClipForge</h1>
        </div>
        <div>
          {isSignedIn ? (
            <UserButton />
```
          ) : (
            <SignInButton mode="modal">
              <button style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)", color: "#fff", fontWeight: "600", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px" }}>
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {isSignedIn ? (
        <div style={{ width: "100%", maxWidth: "680px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.15)", borderRadius: "24px", padding: "32px" }}>
          <UploadBox />
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: "680px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.15)", borderRadius: "24px", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎮</div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 12px" }}>Welcome to ClipForge</h2>
          <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 32px" }}>Sign in to start creating AI-powered gaming highlights</p>
          <SignInButton mode="modal">
            <button style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)", color: "#fff", fontWeight: "700", padding: "14px 40px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px" }}>
              ⚡ Get Started — Sign In
            </button>
          </SignInButton>
        </div>
      )}
    </main>
  );
}
