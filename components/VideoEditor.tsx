"use client";
import { useRef, useState, useEffect } from "react";

interface VideoEditorProps {
  videoUrl: string;
  onClose: () => void;
}

export default function VideoEditor({ videoUrl, onClose }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState("none");
  const [text, setText] = useState("");
const [textColor, setTextColor] = useState("#ffffff");
const [textPosition, setTextPosition] = useState("bottom");

  const filters: Record<string, string> = {
  none: "none",
  cinematic: "contrast(1.2) saturate(0.8) brightness(0.9)",
  neon: "hue-rotate(270deg) saturate(2) brightness(1.2)",
  gaming: "contrast(1.4) saturate(1.5) hue-rotate(90deg)",
  dark: "brightness(0.7) contrast(1.3) saturate(0.9)",
  warm: "sepia(0.4) brightness(1.1) saturate(1.2)",
};
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      setDuration(video.duration);
      setTrimEnd(video.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= trimEnd) {
        video.pause();
        video.currentTime = trimStart;
        setIsPlaying(false);
      }
    };
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [trimEnd, trimStart]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.currentTime = trimStart;
      video.play();
    }
    setIsPlaying(!isPlaying);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          startTime: trimStart,
          endTime: trimEnd,
          overlayText: text,
overlayColor: textColor,
overlayPosition: textPosition,
        }),
      });
      const data = await res.json();
      if (data.clipUrl) window.open(data.clipUrl, "_blank");
    } catch (e) {
      alert("Export failed!");
    } finally {
      setExporting(false);
    }
  }

  const startPercent = duration ? (trimStart / duration) * 100 : 0;
  const endPercent = duration ? (trimEnd / duration) * 100 : 100;
  const currentPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "20px"
    }}>
      <div style={{
        background: "#0d1117", borderRadius: "20px",
        border: "1px solid rgba(34,211,238,0.2)",
        width: "100%", maxWidth: "800px", padding: "24px", overflowY: "auto", maxHeight: "90vh"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#22d3ee", margin: 0, fontSize: "20px", fontWeight: "700" }}>✂️ Video Editor</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>

        {/* Video Preview */}
        <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
          <video
            ref={videoRef}
            src={videoUrl}
            style={{ width: "100%", borderRadius: "12px", background: "#000", maxHeight: "350px", filter: filters[filter] }}
          />
          {text && (
            <div style={{
              position: "absolute",
              left: 0, right: 0,
              top: textPosition === "top" ? "10px" : textPosition === "center" ? "50%" : "auto",
              bottom: textPosition === "bottom" ? "10px" : "auto",
              transform: textPosition === "center" ? "translateY(-50%)" : "none",
              textAlign: "center", padding: "0 16px",
            }}>
              <span style={{
                color: textColor, fontSize: "20px", fontWeight: "800",
                textShadow: "2px 2px 8px rgba(0,0,0,0.9)",
                background: "rgba(0,0,0,0.3)", padding: "4px 12px", borderRadius: "6px"
              }}>{text}</span>
            </div>
          )}
        </div>

        {/* Time Display */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px", marginTop: "12px" }}>
          <span>Current: {formatTime(currentTime)}</span>
          <span>Duration: {formatTime(duration)}</span>
        </div>

        {/* Timeline */}
        <div style={{ marginTop: "16px", position: "relative" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>Timeline — drag handles to trim</p>
          <div style={{ position: "relative", height: "48px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", overflow: "hidden" }}>
            {/* Trimmed region */}
            <div style={{
              position: "absolute", top: 0, bottom: 0,
              left: `${startPercent}%`, width: `${endPercent - startPercent}%`,
              background: "rgba(34,211,238,0.2)", border: "2px solid #22d3ee",
            }} />
            {/* Playhead */}
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: "2px",
              background: "#f59e0b", left: `${currentPercent}%`
            }} />
          </div>

          {/* Trim Start Slider */}
          <div style={{ marginTop: "16px" }}>
            <label style={{ color: "#94a3b8", fontSize: "12px" }}>
              Trim Start: {formatTime(trimStart)}
            </label>
            <input type="range" min={0} max={duration} step={0.1}
              value={trimStart}
              onChange={e => {
                const val = parseFloat(e.target.value);
                if (val < trimEnd) setTrimStart(val);
              }}
              style={{ width: "100%", accentColor: "#22d3ee" }}
            />
          </div>

          {/* Trim End Slider */}
          <div style={{ marginTop: "8px" }}>
            <label style={{ color: "#94a3b8", fontSize: "12px" }}>
              Trim End: {formatTime(trimEnd)}
            </label>
            <input type="range" min={0} max={duration} step={0.1}
              value={trimEnd}
              onChange={e => {
                const val = parseFloat(e.target.value);
                if (val > trimStart) setTrimEnd(val);
              }}
              style={{ width: "100%", accentColor: "#22d3ee" }}
            />
          </div>
        </div>

        {/* Clip Info */}
        <div style={{ marginTop: "16px", padding: "12px", background: "rgba(34,211,238,0.05)", borderRadius: "10px", border: "1px solid rgba(34,211,238,0.1)" }}>
          <p style={{ color: "#22d3ee", margin: 0, fontSize: "14px", fontWeight: "600" }}>
            📎 Clip: {formatTime(trimStart)} → {formatTime(trimEnd)} ({formatTime(trimEnd - trimStart)} long)
          </p>
        </div>
        {/* Filters */}
        <div style={{ marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>🎨 Filters</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.keys(filters).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 14px", borderRadius: "8px", border: "none",
                cursor: "pointer", fontSize: "13px", fontWeight: "600",
                background: filter === f ? "linear-gradient(135deg, #22d3ee, #6366f1)" : "rgba(255,255,255,0.08)",
                color: filter === f ? "#fff" : "#94a3b8",
              }}>
                {f === "none" ? "Original" : f === "cinematic" ? "🎬 Cinematic" : f === "neon" ? "💜 Neon" : f === "gaming" ? "🎮 Gaming" : f === "dark" ? "🌙 Dark" : "🔥 Warm"}
              </button>
            ))}
          </div>
        </div>
        {/* Text Overlay Controls */}
        <div style={{ marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>📝 Text Overlay</p>
          <input
            type="text"
            placeholder="Type your text here..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(34,211,238,0.2)", borderRadius: "8px",
              color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box"
            }}
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
            <label style={{ color: "#94a3b8", fontSize: "12px" }}>Color:</label>
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
              style={{ width: "36px", height: "28px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
            />
            <label style={{ color: "#94a3b8", fontSize: "12px", marginLeft: "8px" }}>Position:</label>
            {["top", "center", "bottom"].map(pos => (
              <button key={pos} onClick={() => setTextPosition(pos)} style={{
                padding: "4px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px",
                background: textPosition === pos ? "linear-gradient(135deg, #22d3ee, #6366f1)" : "rgba(255,255,255,0.08)",
                color: textPosition === pos ? "#fff" : "#94a3b8", fontWeight: "600"
              }}>{pos}</button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={togglePlay} style={{
            flex: 1, padding: "12px", background: "rgba(255,255,255,0.08)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "15px"
          }}>
            {isPlaying ? "⏸ Pause" : "▶️ Preview Clip"}
          </button>
          <button onClick={handleExport} disabled={exporting} style={{
            flex: 1, padding: "12px",
            background: exporting ? "#374151" : "linear-gradient(135deg, #22d3ee, #6366f1)",
            color: "#fff", border: "none", borderRadius: "10px",
            cursor: "pointer", fontWeight: "700", fontSize: "15px"
          }}>
            {exporting ? "⏳ Exporting..." : "⬇️ Export Clip"}
          </button>
        </div>
      </div>
    </div>
  );
}