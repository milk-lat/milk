import Link from "next/link";

const features = [
  { href: "/lab/calculator", title: "计算器", desc: "简单四则运算" },
  { href: "/lab/todo", title: "待办（本地）", desc: "本地存储的小清单" },
  { href: "/lab/tictactoe", title: "井字棋", desc: "双人对战" },
  { href: "/lab/stopwatch", title: "秒表", desc: "计时与圈速" },
  { href: "/lab/markdown", title: "Markdown 预览", desc: "所见即所得" },
];

export default function LabPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">功能实验室</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="border rounded p-4 hover:bg-black/[.03] dark:hover:bg-white/[.06]">
            <div className="font-medium">{f.title}</div>
            <div className="text-sm text-muted-foreground">{f.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}