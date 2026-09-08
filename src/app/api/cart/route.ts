import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Cart } from '@/models/Cart';
import { Restaurant, RestaurantDocument } from '@/models/Restaurant';
import { getOrCreateCartId } from '@/lib/cartSession';

export async function GET() {
  try {
    await connectToDatabase();
    const cartId = getOrCreateCartId();
    const cart = await Cart.findOne({ cartId }).lean();
    return NextResponse.json(cart ?? { cartId, restaurantId: null, items: [] });
  } catch (error) {
    console.error('GET /api/cart failed:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST { restaurantId, itemId } — add one unit of a menu item to the cart.
// QuickEats only supports ordering from one restaurant at a time (matching
// how the original CartDrawer UI was already scoped to a single
// `restaurantName`), so adding from a different restaurant replaces the cart.
export async function POST(request: NextRequest) {
  try {
    const { restaurantId, itemId } = await request.json();
    if (!restaurantId || !itemId) {
      return NextResponse.json(
        { error: 'restaurantId and itemId are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findOne({ id: restaurantId }).lean<RestaurantDocument>();
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    const menuItem = restaurant.menu.find((m) => m.id === itemId);
    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const cartId = getOrCreateCartId();
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = new Cart({ cartId, restaurantId, items: [] });
    } else if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      // Switching restaurants clears the previous cart.
      cart.items = [];
      cart.restaurantId = restaurantId;
    } else {
      cart.restaurantId = restaurantId;
    }

    const existingLine = cart.items.find((i: { itemId: string }) => i.itemId === itemId);
    if (existingLine) {
      existingLine.quantity += 1;
    } else {
      cart.items.push({
        itemId: menuItem.id,
        restaurantId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      });
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('POST /api/cart failed:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PATCH { itemId, quantity } — set a line item's quantity. quantity <= 0 removes it.
export async function PATCH(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();
    if (!itemId || typeof quantity !== 'number') {
      return NextResponse.json(
        { error: 'itemId and numeric quantity are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cartId = getOrCreateCartId();
    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i: { itemId: string }) => i.itemId !== itemId);
    } else {
      const line = cart.items.find((i: { itemId: string }) => i.itemId === itemId);
      if (!line) {
        return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });
      }
      line.quantity = quantity;
    }

    if (cart.items.length === 0) cart.restaurantId = null;

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('PATCH /api/cart failed:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE — empty the cart entirely (used after an order is placed).
export async function DELETE() {
  try {
    await connectToDatabase();
    const cartId = getOrCreateCartId();
    await Cart.findOneAndUpdate({ cartId }, { items: [], restaurantId: null });
    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('DELETE /api/cart failed:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
