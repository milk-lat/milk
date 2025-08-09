"use client";

import { useEffect, useRef, useState } from "react";

export default function StopwatchPage() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setMs((m) => m + 10), 10);
    } else if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  function format(ms: number) {
    const s = Math.floor(ms / 1000);
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  }

  return (
    <div className="space-y-3 max-w-sm">
      <h3 className="text-lg font-medium">秒表</h3>
      <div className="text-3xl font-mono">{format(ms)}</div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setRunning(!running)}>{running ? "暂停" : "开始"}</button>
        <button className="px-3 py-2 rounded border" onClick={() => setMs(0)}>复位</button>
        <button className="px-3 py-2 rounded border" onClick={() => setLaps([ms, ...laps])}>计次</button>
      </div>
      <ul className="text-sm font-mono space-y-1">
        {laps.map((l, i) => (<li key={i}>#{laps.length - i} {format(l)}</li>))}
      </ul>
    </div>
  );
}