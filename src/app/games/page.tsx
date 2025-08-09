import Link from "next/link";

export default function GamesHome() {
  const games = [
    { href: "/games/tictactoe", title: "井字棋", desc: "经典 3x3 井字棋，对战电脑或朋友（本地）。" },
    { href: "/games/guess", title: "数字猜谜", desc: "1-100 随机数字，依据提示逐步逼近答案。" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl p-8 border bg-gradient-to-r from-indigo-500/10 to-cyan-500/10">
        <h1 className="text-3xl font-bold tracking-tight">小游戏展台</h1>
        <p className="mt-2 text-muted-foreground">纯前端 · 即开即玩 · 现代风 UI</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {games.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="group rounded-xl border p-5 transition hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{g.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">Play</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}