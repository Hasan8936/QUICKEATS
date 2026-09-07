import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order, User } from '@/db/mongoose/models';

// GET - Retrieve user orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const filter: any = { userId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(
      { success: true, data: orders },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, restaurantId, items, deliveryAddress, paymentMethod } = body;

    // Validation
    if (!userId || !restaurantId || !items || !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Mock delivery fee calculation (replace with actual logic)
    const deliveryFee = Math.max(subtotal * 0.1, 40);
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    // Estimate delivery time (30-45 minutes)
    const estimatedDeliveryTime = new Date(Date.now() + 35 * 60 * 1000);

    const order = new Order({
      userId,
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress,
      paymentMethod: paymentMethod || 'card',
      estimatedDeliveryTime,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await order.save();

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
