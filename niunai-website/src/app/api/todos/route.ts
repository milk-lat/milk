import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);
  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { title } = await request.json();
  if (!title) return NextResponse.json({ error: "缺少标题" }, { status: 400 });
  const todo = await prisma.todo.create({
    data: { title, userId: session.user.id },
  });
  return NextResponse.json(todo);
}