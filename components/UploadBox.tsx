"use client";
import { useRef, useState } from "react";

export default function UploadBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clipping, setClipping] = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedUrl(null);
      setHighlights([]);
      setTranscript(null);
      setError(null);
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("video", selectedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
      const cloudUrl = uploadData.result.secure_url;
      setUploadedUrl(cloudUrl);
      setUploading(false);
      setProcessing(true);
      const processRes = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: cloudUrl }),
      });
      const processData = await processRes.json();
      if (!processRes.ok) throw new Error(processData.error || "Processing failed");
      setHighlights(processData.highlights || []);
      setTranscript(processData.transcript || "");
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  }

  async function handleClip(index: number, startMs: number, endMs: number) {
    if (!uploadedUrl) return;
    setClipping(index);
    try {
      const res = await fetch("/api/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: uploadedUrl, startTime: startMs / 1000, endTime: endMs / 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Clip failed");
      window.open(data.clipUrl, "_blank");
    } catch (err: any) {
      setError(err.message || "Clip download failed!");
    } finally {
      setClipping(null);
    }
  }

  return (
    <div style={{ width: "100%" }}>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed rgba(34,211,238,0.3)",
          borderRadius: "16px", padding: "48px 32px",
          textAlign: "center", cursor: "pointer",
          background: "rgba(34,211,238,0.03)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#22d3ee")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)")}
      >
        <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎮</div>
        {selectedFile ? (
          <div>
            <p style={{ color: "#22d3ee", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>✅ {selectedFile.name}</p>
            <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>Click to change file</p>
          </div>
        ) : (
          <div>
            <p style={{ color: "#22d3ee", fontWeight: "700", fontSize: "18px", margin: "0 0 8px" }}>Drop your gaming clip here</p>
            <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>MP4, MOV, AVI supported</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div style={{ marginTop: "20px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(34,211,238,0.2)" }}>
          <video src={previewUrl} controls style={{ width: "100%", display: "block", maxHeight: "300px" }} />
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploading && !processing && highlights.length === 0 && (
        <button
          onClick={handleUpload}
          style={{
            marginTop: "20px", width: "100%", padding: "16px",
            background: "linear-gradient(135deg, #22d3ee, #6366f1)",
            color: "#fff", fontWeight: "700", fontSize: "16px",
            border: "none", borderRadius: "12px", cursor: "pointer",
            boxShadow: "0 0 20px rgba(34,211,238,0.3)",
            letterSpacing: "0.5px",
          }}
        >
          ⚡ Upload + Analyze with AI
        </button>
      )}

      {/* Loading State */}
      {(uploading || processing) && (
        <div style={{ marginTop: "24px", textAlign: "center", padding: "24px", background: "rgba(34,211,238,0.05)", borderRadius: "12px", border: "1px solid rgba(34,211,238,0.1)" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>{uploading ? "☁️" : "🤖"}</div>
          <p style={{ color: "#22d3ee", fontWeight: "600", fontSize: "16px", margin: "0 0 8px" }}>
            {uploading ? "Uploading to Cloud..." : "AI Analyzing your clip..."}
          </p>
          <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>
            {processing && "This may take 1-2 minutes"}
          </p>
          <div style={{ marginTop: "16px", height: "3px", background: "rgba(34,211,238,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, #22d3ee, #6366f1)", borderRadius: "2px", animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: "16px", padding: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px" }}>
          <p style={{ color: "#ef4444", margin: 0, fontSize: "14px" }}>❌ {error}</p>
        </div>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "4px", height: "24px", background: "linear-gradient(#22d3ee, #6366f1)", borderRadius: "2px" }} />
            <p style={{ color: "#fff", fontWeight: "700", fontSize: "18px", margin: 0 }}>AI Highlights</p>
            <span style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", border: "1px solid rgba(34,211,238,0.2)" }}>
              {highlights.length} clips found
            </span>
          </div>
          {highlights.map((h, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.1)",
              borderRadius: "12px", padding: "16px", marginBottom: "10px",
              transition: "border-color 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: "#475569", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>Clip #{i + 1}</span>
                  <p style={{ color: "#e2e8f0", fontSize: "14px", margin: "4px 0 0", lineHeight: "1.5" }}>{h.text}</p>
                </div>
                <span style={{
                  background: i === 0 ? "rgba(34,211,238,0.15)" : "rgba(99,102,241,0.15)",
                  color: i === 0 ? "#22d3ee" : "#818cf8",
                  padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                  marginLeft: "12px", whiteSpace: "nowrap",
                  border: `1px solid ${i === 0 ? "rgba(34,211,238,0.3)" : "rgba(99,102,241,0.3)"}`
                }}>
                  {(h.rank * 100).toFixed(0)}% match
                </span>
              </div>
              {h.timestamps?.[0] && (
                <button
                  onClick={() => handleClip(i, h.timestamps[0].start, h.timestamps[0].end)}
                  disabled={clipping === i}
                  style={{
                    background: clipping === i ? "rgba(71,85,105,0.5)" : "linear-gradient(135deg, #22d3ee, #6366f1)",
                    color: clipping === i ? "#64748b" : "#fff",
                    fontWeight: "600", padding: "8px 20px", borderRadius: "8px",
                    border: "none", cursor: clipping === i ? "not-allowed" : "pointer",
                    fontSize: "13px", transition: "opacity 0.2s",
                  }}
                >
                  {clipping === i ? "⏳ Processing..." : "⬇️ Download Clip"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
          <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 10px" }}>Full Transcript</p>
          <p style={{ color: "#475569", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>{transcript}</p>
        </div>
      )}

    </div>
  );
}