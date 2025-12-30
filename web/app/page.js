"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [roomUrl, setRoomUrl] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE;

  async function createRoom() {
    try {
      setStatus("creating...");
      const r = await fetch(`${API}/rooms`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(data));
      setRoomUrl(data.url);
      setStatus("ready");
    } catch (e) {
      setStatus(`error: ${String(e)}`);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Réunion Visio (Daily)</h1>
      <button onClick={createRoom}>Créer une room</button>
      <p>Statut : {status}</p>
      {roomUrl && (
        <p>
          Room: <a href={roomUrl} target="_blank" rel="noreferrer">{roomUrl}</a>
        </p>
      )}
    </main>
  );
}
