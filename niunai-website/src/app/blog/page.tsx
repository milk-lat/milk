import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">博客</h2>
        <Link href="/blog/new" className="px-3 py-2 rounded bg-foreground text-background">发表</Link>
      </div>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="border rounded p-4">
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{p.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}