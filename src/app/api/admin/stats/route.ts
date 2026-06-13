import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [totalOrders, pendingOrders, deliveredOrders, revenueData, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "DELIVERED" } }),
        prisma.order.aggregate({
          where: { status: { not: "CANCELLED" } },
          _sum: { totalAmount: true },
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            customer: true,
            orderItems: { include: { menuItem: true } },
          },
        }),
      ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: revenueData._sum.totalAmount ?? 0,
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
