import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "缺少邮箱或密码" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}