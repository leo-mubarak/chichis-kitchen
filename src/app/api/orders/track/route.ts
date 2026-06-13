import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Find customer by phone
    const customer = await prisma.customer.findFirst({
      where: { phone: { contains: phone } },
    });

    if (!customer) {
      return NextResponse.json([]);
    }

    // Get all their orders
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        customer: true,
        orderItems: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
