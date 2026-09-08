import { notFound } from 'next/navigation';
import { getRestaurantById } from '@/lib/queries';
import { RestaurantMenuClient } from '@/components/RestaurantMenuClient';

export const dynamic = 'force-dynamic';

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurantById(params.id);
  if (!restaurant) notFound();

  return <RestaurantMenuClient restaurant={restaurant} />;
}
