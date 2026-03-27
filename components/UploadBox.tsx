"use client";
import { useRef, useState } from "react";

export default function UploadBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedUrl(null);
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
      const formData = new FormData();
      formData.append("video", selectedFile);
      setProgress(30);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      setProgress(80);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setProgress(100);
      setUploadedUrl(data.result.secure_url);
    } catch (err: any) {
      setError(err.message || "Kuch gadbad ho gayi!");
    } finally {
      setUploading(false);
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

      {selectedFile && !uploading && !uploadedUrl && (
        <button onClick={handleUpload} style={{ marginTop: "20px", width: "100%", background: "#22d3ee", color: "#000", fontWeight: "bold", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px" }}>
          Upload to Cloud
        </button>
      )}

      {uploading && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#22d3ee", marginBottom: "8px" }}>Uploading... {progress}%</p>
          <div style={{ background: "#1e1e1e", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#22d3ee", transition: "width 0.4s ease" }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", border: "1px solid #ef4444", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginTop: "20px", border: "1px solid #22c55e", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p style={{ color: "#22c55e", fontSize: "20px", fontWeight: "bold" }}>Uploaded to Cloud Successfully!</p>
          <p style={{ color: "#71717a", marginTop: "8px", fontSize: "12px", wordBreak: "break-all" }}>{uploadedUrl}</p>
          <button onClick={() => window.open(uploadedUrl, "_blank")} style={{ marginTop: "12px", background: "#22c55e", color: "#000", fontWeight: "bold", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
            View on Cloudinary
          </button>
        </div>
      )}
    </div>
  );
}