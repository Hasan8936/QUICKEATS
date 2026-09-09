import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order, OrderStatus } from '@/models/Order';
import { handleMongoDBError } from '@/lib/mongodbError';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'cooking',
  'ready',
  'picked',
  'delivered',
  'cancelled',
];

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleMongoDBError(error);
  }
}

// PUT { status } — update an order's status (e.g. kitchen marking it
// "cooking", a partner marking it "picked" / "delivered").
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const update: Record<string, unknown> = { status };
    if (status === 'delivered') update.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleMongoDBError(error);
  }
}

// DELETE — cancel an order. Only allowed while still pending, matching the
// original intent of this endpoint (can't cancel food that's already
// cooking). Sets status to 'cancelled' rather than deleting the record, so
// it's preserved for analytics/audit history.
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel an order once the kitchen has started on it' },
        { status: 400 }
      );
    }

    order.status = 'cancelled';
    await order.save();
    return NextResponse.json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    return handleMongoDBError(error);
  }
}
