import { posts } from "@/content/posts";

export default async function BlogPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">博客</h2>
      </div>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug} className="border rounded p-4">
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}