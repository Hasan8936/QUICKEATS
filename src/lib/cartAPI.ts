import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';

const redis = new Redis();
const prisma = new PrismaClient();

export async function addItemToCart(userId: string, item: { name: string; price: number; quantity: number }) {
  const cartKey = `cart:${userId}`;
  const cart = JSON.parse((await redis.get(cartKey)) || '[]');

  const existingItem = cart.find((i: any) => i.name === item.name);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  await redis.set(cartKey, JSON.stringify(cart));
  return cart;
}

export async function removeItemFromCart(userId: string, itemName: string) {
  const cartKey = `cart:${userId}`;
  const cart = JSON.parse((await redis.get(cartKey)) || '[]');

  const updatedCart = cart.filter((i: any) => i.name !== itemName);
  await redis.set(cartKey, JSON.stringify(updatedCart));
  return updatedCart;
}

export async function placeOrder(userId: string) {
  const cartKey = `cart:${userId}`;
  const cart = JSON.parse((await redis.get(cartKey)) || '[]');

  if (cart.length === 0) {
    throw new Error('Cart is empty');
  }

  const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      items: {
        create: cart.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  await redis.del(cartKey);
  return order;
}