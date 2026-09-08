import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Cart } from '@/models/Cart';
import { Restaurant, RestaurantDocument } from '@/models/Restaurant';
import { Order } from '@/models/Order';
import { OrderEvent } from '@/models/Events';
import { getOrCreateCartId } from '@/lib/cartSession';
import { calculateSurgeMultiplier } from '@/lib/surgeEngine';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`order:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    await connectToDatabase();
    const cartId = getOrCreateCartId();
    const cart = await Cart.findOne({ cartId });

    if (!cart || cart.items.length === 0 || !cart.restaurantId) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const restaurant = await Restaurant.findOne({ id: cart.restaurantId }).lean<RestaurantDocument>();
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const surge = await calculateSurgeMultiplier(restaurant.zone);
    const totalAmount = cart.items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );
    const deliveryFee = restaurant.deliveryFee * surge.multiplier;
    const finalAmount = totalAmount + deliveryFee;

    const order = await Order.create({
      restaurantId: restaurant.id,
      zone: restaurant.zone,
      cartId,
      items: cart.items,
      totalAmount,
      deliveryFee,
      surgeApplied: surge.multiplier,
      finalAmount,
      status: 'pending',
    });

    await OrderEvent.create({ orderId: order.id, event: 'order_placed' });

    cart.items = [];
    cart.restaurantId = null;
    await cart.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders failed:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

// GET /api/orders?limit=20 — most recent orders (used by the analytics dashboard).
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 20;
    const orders = await Order.find().sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders failed:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
