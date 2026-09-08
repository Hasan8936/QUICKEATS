/**
 * Seeds MongoDB with the app's zones/restaurants/partners (previously only
 * ever used as in-memory mock data) and a batch of historical orders so the
 * analytics dashboard has real aggregates to show instead of hardcoded
 * numbers.
 *
 * Usage: npm run db:seed
 * Requires MONGODB_URI to be set (see .env.example).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { zones, restaurants, deliveryPartners } from '../src/entities/mockData';
import { Zone } from '../src/models/Zone';
import { Restaurant } from '../src/models/Restaurant';
import { DeliveryPartner } from '../src/models/DeliveryPartner';
import { Order } from '../src/models/Order';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Add it to .env.local before seeding.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  await Promise.all([
    Zone.deleteMany({}),
    Restaurant.deleteMany({}),
    DeliveryPartner.deleteMany({}),
    Order.deleteMany({}),
  ]);
  console.log('Cleared existing zones, restaurants, partners, and orders.');

  await Zone.insertMany(zones);
  await Restaurant.insertMany(restaurants);
  await DeliveryPartner.insertMany(deliveryPartners);
  console.log(
    `Inserted ${zones.length} zones, ${restaurants.length} restaurants, ${deliveryPartners.length} partners.`
  );

  // Generate a spread of historical orders over the last 12 days so the
  // analytics dashboard's trend chart and revenue totals reflect real data.
  const statuses = ['delivered', 'delivered', 'delivered', 'cooking', 'pending'] as const;
  const orders = [];
  for (let dayOffset = 11; dayOffset >= 0; dayOffset--) {
    const ordersThatDay = 5 + Math.floor(Math.random() * 15);
    for (let i = 0; i < ordersThatDay; i++) {
      const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
      const menuItem = restaurant.menu[Math.floor(Math.random() * restaurant.menu.length)];
      const quantity = 1 + Math.floor(Math.random() * 3);
      const totalAmount = menuItem.price * quantity;
      const surgeApplied = Math.random() > 0.7 ? 1.5 : 1.0;
      const deliveryFee = restaurant.deliveryFee * surgeApplied;
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - dayOffset);
      createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      orders.push({
        restaurantId: restaurant.id,
        zone: restaurant.zone,
        cartId: `seed-cart-${dayOffset}-${i}`,
        items: [
          {
            itemId: menuItem.id,
            restaurantId: restaurant.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
          },
        ],
        totalAmount,
        deliveryFee,
        surgeApplied,
        finalAmount: totalAmount + deliveryFee,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt,
      });
    }
  }

  await Order.insertMany(orders);
  console.log(`Inserted ${orders.length} historical orders across the last 12 days.`);

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
