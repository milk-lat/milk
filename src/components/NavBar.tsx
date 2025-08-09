"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/games", label: "小游戏" },
  { href: "/lab", label: "功能实验室" },
  { href: "/blog", label: "博客" },
];

export default function NavBar() {
  const pathname = usePathname();

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
        </nav>
      </div>
    </header>
  );
}