"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/todos", label: "待办" },
  { href: "/search", label: "搜索" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="w-full border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">牛奶的网站</Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "underline underline-offset-4"
                  : "hover:underline underline-offset-4"
              }
            >
              {l.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/account">账号</Link>
              <button onClick={() => signOut()} className="px-2 py-1 rounded bg-foreground text-background">
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login">登录</Link>
              <Link href="/register">注册</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}