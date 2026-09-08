import { getZones, getRestaurants } from '@/lib/queries';
import { HomePageClient } from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [zones, restaurants] = await Promise.all([getZones(), getRestaurants()]);

  return <HomePageClient zones={zones} restaurants={restaurants} />;
}
