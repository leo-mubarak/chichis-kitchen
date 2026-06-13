import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: sessionId },
  });

  return admin ?? null;
}

export async function auth() {
  return getAdminSession();
}

export function signOut() {
  return null;
}