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
        body: JSON.stringify({
          videoUrl: uploadedUrl,
          startTime: startMs / 1000,
          endTime: endMs / 1000,
        }),
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
    <div style={{ width: "100%", maxWidth: "600px" }}>

      <div onClick={() => inputRef.current?.click()} style={{ border: "2px dashed #22d3ee", borderRadius: "16px", padding: "40px", textAlign: "center", cursor: "pointer" }}>
        <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
        <p style={{ fontSize: "40px", marginBottom: "12px" }}>🎮</p>
        {selectedFile
          ? <p style={{ color: "#22d3ee", fontWeight: "bold" }}>Selected: {selectedFile.name}</p>
          : <p style={{ color: "#22d3ee", fontWeight: "bold" }}>Drop your gaming clip here</p>
        }
      </div>

      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <video src={previewUrl} controls style={{ width: "100%", borderRadius: "12px", border: "1px solid #22d3ee" }} />
        </div>
      )}

      {selectedFile && !uploading && !processing && highlights.length === 0 && (
        <button onClick={handleUpload} style={{ marginTop: "20px", width: "100%", background: "#22d3ee", color: "#000", fontWeight: "bold", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px" }}>
          Upload + Analyze with AI
        </button>
      )}

      {(uploading || processing) && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#22d3ee", fontSize: "16px" }}>
            {uploading ? "Uploading to Cloud..." : "AI Analyzing video... (1-2 min)"}
          </p>
          <div style={{ marginTop: "12px", width: "40px", height: "40px", border: "4px solid #22d3ee", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "12px auto" }} />
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", border: "1px solid #ef4444", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {highlights.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#22d3ee", fontWeight: "bold", fontSize: "18px", marginBottom: "12px" }}>
            AI Highlights — Click to Download!
          </p>
          {highlights.map((h, i) => (
            <div key={i} style={{ background: "#0f172a", border: "1px solid #22d3ee", borderRadius: "10px", padding: "12px", marginBottom: "8px" }}>
              <p style={{ color: "#22d3ee", fontWeight: "bold" }}>#{i + 1} — {h.text}</p>
              <p style={{ color: "#71717a", fontSize: "12px", marginBottom: "8px" }}>Rank: {(h.rank * 100).toFixed(0)}%</p>
              {h.timestamps?.[0] && (
                <button
                  onClick={() => handleClip(i, h.timestamps[0].start, h.timestamps[0].end)}
                  disabled={clipping === i}
                  style={{ background: clipping === i ? "#374151" : "#22d3ee", color: "#000", fontWeight: "bold", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}
                >
                  {clipping === i ? "Cutting..." : "Download Clip"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {transcript && (
        <div style={{ marginTop: "20px", background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#22d3ee", fontWeight: "bold", marginBottom: "8px" }}>Full Transcript:</p>
          <p style={{ color: "#71717a", fontSize: "13px", lineHeight: "1.6" }}>{transcript}</p>
        </div>
      )}

    </div>
  );
}