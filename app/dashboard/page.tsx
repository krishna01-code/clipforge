"use client";
import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const { userId, isSignedIn } = useAuth();
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function fetchClips() {
      const { data } = await supabase
        .from("clips")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setClips(data || []);
      setLoading(false);
    }
    fetchClips();
  }, [userId]);

  if (!isSignedIn) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748b" }}>Please sign in to view dashboard</p>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0f1e 100%)", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #22d3ee, #6366f1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
                <span style={{ color: "#22d3ee", fontWeight: "800", fontSize: "20px" }}>ClipForge</span>
              </div>
            </Link>
            <span style={{ color: "#334155", fontSize: "20px" }}>/</span>
            <span style={{ color: "#fff", fontWeight: "600", fontSize: "18px" }}>Dashboard</span>
          </div>
          <UserButton />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Clips", value: clips.length, icon: "🎬" },
            { label: "This Month", value: clips.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length, icon: "📅" },
            { label: "Storage Used", value: `${clips.length * 10}MB`, icon: "☁️" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.1)", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ color: "#22d3ee", fontSize: "24px", fontWeight: "800" }}>{stat.value}</div>
              <div style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Clips List */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.1)", borderRadius: "20px", padding: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "0 0 20px" }}>🎮 Your Clips</h2>
          {loading ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Loading...</p>
          ) : clips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
              <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 20px" }}>No clips yet!</p>
              <Link href="/" style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)", color: "#fff", padding: "12px 28px", borderRadius: "10px", textDecoration: "none", fontWeight: "700" }}>
                ⚡ Create First Clip
              </Link>
            </div>
          ) : (
            clips.map((clip, i) => (
              <div key={clip.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: "14px", margin: "0 0 4px", fontWeight: "600" }}>🎬 Clip #{i + 1}</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>{new Date(clip.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <a href={clip.video_url} target="_blank" style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                  ▶️ View
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}