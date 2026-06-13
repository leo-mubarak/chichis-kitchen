import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const orders = await prisma.order.findMany({
      where: {
        ...(status && status !== "ALL" ? { status: status as never } : {}),
        ...(search
          ? {
              OR: [
                { customer: { fullname: { contains: search } } },
                { customer: { phone: { contains: search } } },
                { id: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        customer: true,
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullname, phone, deliveryAddress, notes, items } = body;

    if (!fullname || !phone || !deliveryAddress || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert customer
    let customer = await prisma.customer.findFirst({ where: { phone } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { fullname, phone, address: deliveryAddress },
      });
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, i: { price: number; quantity: number }) =>
        sum + i.price * i.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalAmount: total,
        deliveryAddress,
        notes: notes || null,
        orderItems: {
          create: items.map((i: {
            menuItemId: string;
            sizeLabel: string;
            quantity: number;
            price: number;
          }) => ({
            menuItemId: i.menuItemId,
            sizeLabel: i.sizeLabel,
            quantity: i.quantity,
            subtotal: i.price * i.quantity,
          })),
        },
      },
      include: {
        customer: true,
        orderItems: { include: { menuItem: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
