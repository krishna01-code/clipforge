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
      // Direct Cloudinary upload from browser
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "clipforge_unsigned");
      formData.append("resource_type", "video");

     const cloudName = "ddhf9why6";
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload failed");

      const cloudUrl = uploadData.secure_url;
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
      <div onClick={() => inputRef.current?.click()} style={{ border: "2px dashed rgba(34,211,238,0.3)", borderRadius: "16px", padding: "48px 32px", textAlign: "center", cursor: "pointer", background: "rgba(34,211,238,0.03)" }}>
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

      {previewUrl && (
        <div style={{ marginTop: "20px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(34,211,238,0.2)" }}>
          <video src={previewUrl} controls style={{ width: "100%", display: "block", maxHeight: "300px" }} />
        </div>
      )}

      {selectedFile && !uploading && !processing && highlights.length === 0 && (
        <button onClick={handleUpload} style={{ marginTop: "20px", width: "100%", padding: "16px", background: "linear-gradient(135deg, #22d3ee, #6366f1)", color: "#fff", fontWeight: "700", fontSize: "16px", border: "none", borderRadius: "12px", cursor: "pointer" }}>
          ⚡ Upload + Analyze with AI
        </button>
      )}

      {(uploading || processing) && (
        <div style={{ marginTop: "24px", textAlign: "center", padding: "24px", background: "rgba(34,211,238,0.05)", borderRadius: "12px", border: "1px solid rgba(34,211,238,0.1)" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>{uploading ? "☁️" : "🤖"}</div>
          <p style={{ color: "#22d3ee", fontWeight: "600", fontSize: "16px", margin: "0 0 8px" }}>
            {uploading ? "Uploading to Cloud..." : "AI Analyzing your clip..."}
          </p>
          <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>{processing && "This may take 1-2 minutes"}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "16px", padding: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px" }}>
          <p style={{ color: "#ef4444", margin: 0, fontSize: "14px" }}>❌ {error}</p>
        </div>
      )}

      {highlights.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <p style={{ color: "#fff", fontWeight: "700", fontSize: "18px", margin: "0 0 16px" }}>🎯 AI Highlights — {highlights.length} clips found</p>
          {highlights.map((h, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.1)", borderRadius: "12px", padding: "16px", marginBottom: "10px" }}>
              <p style={{ color: "#e2e8f0", fontSize: "14px", margin: "0 0 10px" }}>#{i + 1} — {h.text}</p>
              {h.timestamps?.[0] && (
                <button onClick={() => handleClip(i, h.timestamps[0].start, h.timestamps[0].end)} disabled={clipping === i}
                  style={{ background: clipping === i ? "#374151" : "linear-gradient(135deg, #22d3ee, #6366f1)", color: "#fff", fontWeight: "600", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px" }}>
                  {clipping === i ? "⏳ Processing..." : "⬇️ Download Clip"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {transcript && (
        <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
          <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 10px" }}>Full Transcript</p>
          <p style={{ color: "#475569", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>{transcript}</p>
        </div>
      )}
    </div>
  );
}