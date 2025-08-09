"use client";

import { useState } from "react";

export default function CalculatorPage() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  function calc() {
    try {
      // very basic safe eval: allow digits, operators, dot and parentheses
      if (!/^[-+*/().\d\s]+$/.test(expr)) throw new Error("非法表达式");
      const val = Function(`return (${expr})`)();
      setResult(String(val));
    } catch {
      setResult("错误");
    }
  }
  return (
    <div className="max-w-md space-y-3">
      <h3 className="text-lg font-medium">计算器</h3>
      <input className="w-full" placeholder="例如: (1+2)*3/4" value={expr} onChange={(e) => setExpr(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={calc}>计算</button>
        <button className="px-3 py-2 rounded border" onClick={() => { setExpr(""); setResult(null); }}>清空</button>
      </div>
      {result !== null && <div>结果：<span className="font-mono">{result}</span></div>}
    </div>
  );
}