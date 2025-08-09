"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json().catch(() => ({ error: "注册失败" }));
      setError(data.error || "注册失败");
    }
  }

  return (
    <div className="max-w-sm">
      <h2 className="text-xl font-semibold mb-4">注册</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full" placeholder="昵称（可选）" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full" type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full" type="password" placeholder="密码（至少6位）" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="px-3 py-2 rounded bg-foreground text-background w-full" type="submit">注册</button>
      </form>
    </div>
  );
}