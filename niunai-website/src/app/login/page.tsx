"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/");
    } else {
      setError("登录失败");
    }
  }

  return (
    <div className="max-w-sm">
      <h2 className="text-xl font-semibold mb-4">登录</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full" type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="px-3 py-2 rounded bg-foreground text-background w-full" type="submit">登录</button>
      </form>
    </div>
  );
}