"use client";

import { useMemo, useState } from "react";

function generateTarget() {
  return Math.floor(Math.random() * 100) + 1; // 1..100
}

export default function GuessNumberGamePage() {
  const [target, setTarget] = useState<number>(() => generateTarget());
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("开始猜一个 1-100 的数字！");
  const [attempts, setAttempts] = useState<number>(0);

  function submitGuess() {
    const value = Number(input);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      setResult("请输入 1-100 的整数");
      return;
    }
    setAttempts((n) => n + 1);
    if (value === target) {
      setResult(`正确！答案就是 ${value}。共尝试 ${attempts + 1} 次`);
    } else if (value > target) {
      setResult("有点大了，再小一点~");
    } else {
      setResult("有点小了，再大一点~");
    }
  }

  function reset() {
    setTarget(generateTarget());
    setInput("");
    setAttempts(0);
    setResult("新的一局开始了，试试你的手气！");
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">数字猜谜</h1>
        <p className="text-sm text-muted-foreground mt-1">1-100 之间的随机数，依据提示逐步逼近答案。</p>
      </header>

      <div className="rounded-xl border p-6 space-y-4 max-w-md">
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={100}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入数字..."
            className="w-40 rounded border px-3 py-2"
          />
          <button onClick={submitGuess} className="px-3 py-2 rounded border">猜一猜</button>
          <button onClick={reset} className="px-3 py-2 rounded border">重来</button>
        </div>
        <div className="text-sm text-muted-foreground">尝试次数：{attempts}</div>
        <div className="text-base">{result}</div>
      </div>
    </div>
  );
}