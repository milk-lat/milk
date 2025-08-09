import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: "缺少标题或内容" }, { status: 400 });
  }
  const post = await prisma.post.create({
    data: { title, content, authorId: session.user.id },
  });
  return NextResponse.json(post);
}