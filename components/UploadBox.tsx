"use client";
import { useRef, useState } from "react";

export default function UploadBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
      setProgress(0);
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      // Step 1: Cloudinary pe upload
      const formData = new FormData();
      formData.append("video", selectedFile);
      setProgress(30);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const cloudUrl = uploadData.result.secure_url;
      setUploadedUrl(cloudUrl);
      setProgress(50);
      setUploading(false);

      // Step 2: AI processing
      setProcessing(true);
      setProgress(60);

      const processRes = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: cloudUrl }),
      });
      const processData = await processRes.json();
      if (!processRes.ok) throw new Error(processData.error || "Processing failed");

      setProgress(100);
      setHighlights(processData.highlights || []);
      setTranscript(processData.transcript || "");

    } catch (err: any) {
      setError(err.message || "Kuch gadbad ho gayi!");
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>

      {/* Upload Box */}
      <div onClick={() => inputRef.current?.click()} style={{ border: "2px dashed #22d3ee", borderRadius: "16px", padding: "40px", textAlign: "center", cursor: "pointer" }}>
        <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
        <p style={{ fontSize: "40px", marginBottom: "12px" }}>🎮</p>
        {selectedFile
          ? <p style={{ color: "#22d3ee", fontWeight: "bold" }}>Selected: {selectedFile.name}</p>
          : <p style={{ color: "#22d3ee", fontWeight: "bold" }}>Drop your gaming clip here</p>
        }
      </div>

      {/* Preview */}
      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <video src={previewUrl} controls style={{ width: "100%", borderRadius: "12px", border: "1px solid #22d3ee" }} />
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploading && !processing && highlights.length === 0 && (
        <button onClick={handleUpload} style={{ marginTop: "20px", width: "100%", background: "#22d3ee", color: "#000", fontWeight: "bold", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px" }}>
          Upload + Analyze with AI
        </button>
      )}

      {/* Progress */}
      {(uploading || processing) && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#22d3ee", marginBottom: "8px" }}>
            {uploading ? "Uploading to Cloud..." : "AI Analyzing video..."} {progress}%
          </p>
          <div style={{ background: "#1e1e1e", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#22d3ee", transition: "width 0.4s ease" }} />
          </div>
          {processing && (
            <p style={{ color: "#71717a", marginTop: "8px", fontSize: "12px" }}>
              This may take 1-2 minutes for longer videos...
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: "20px", border: "1px solid #ef4444", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#22d3ee", fontWeight: "bold", fontSize: "18px", marginBottom: "12px" }}>
            AI Highlights Found!
          </p>
          {highlights.map((h, i) => (
            <div key={i} style={{ background: "#0f172a", border: "1px solid #22d3ee", borderRadius: "10px", padding: "12px", marginBottom: "8px" }}>
              <p style={{ color: "#22d3ee", fontWeight: "bold" }}>#{i + 1} — {h.text}</p>
              <p style={{ color: "#71717a", fontSize: "12px" }}>Rank: {(h.rank * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div style={{ marginTop: "20px", background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#22d3ee", fontWeight: "bold", marginBottom: "8px" }}>Full Transcript:</p>
          <p style={{ color: "#71717a", fontSize: "13px", lineHeight: "1.6" }}>{transcript}</p>
        </div>
      )}

    </div>
  );
}