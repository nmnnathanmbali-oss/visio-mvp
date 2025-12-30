"use client";

import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";

export default function Home() {
  const [roomUrl, setRoomUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const frameRef = useRef(null);
  const containerRef = useRef(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  async function createRoom() {
    setError("");
    try {
      const r = await fetch(`${apiBase}/rooms`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(data));
      setRoomUrl(data.url);
      setStatus("ready");
    } catch (e) {
      setError(String(e));
    }
  }

  async function joinCall() {
    setError("");
    if (!roomUrl) return;
    frameRef.current?.destroy();

    frameRef.current = DailyIframe.createFrame(containerRef.current, {
      showLeaveButton: true,
      iframeStyle: { width: "100%", height: "72vh", border: "1px solid #e5e7eb", borderRadius: "16px" }
    });

    frameRef.current.on("joined-meeting", () => setStatus("in-call"));
    frameRef.current.on("left-meeting", () => setStatus("ready"));
    await frameRef.current.join({ url: roomUrl });
  }

  async function copyLink() {
    if (!roomUrl) return;
    await navigator.clipboard.writeText(roomUrl);
    alert("Lien copié.");
  }

  useEffect(() => () => frameRef.current?.destroy(), []);

  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Réunion Visio (Daily)</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={createRoom}>Créer une room</button>
        <input value={roomUrl} onChange={(e) => setRoomUrl(e.target.value)} placeholder="Room URL" style={{ flex: 1, minWidth: 260 }} />
        <button onClick={copyLink} disabled={!roomUrl}>Copier le lien</button>
        <button onClick={joinCall} disabled={!roomUrl || status === "in-call"}>Rejoindre</button>
      </div>

      {error && <pre>{error}</pre>}
      <div ref={containerRef} />
      <p>Statut : {status}</p>
    </main>
  );
}
