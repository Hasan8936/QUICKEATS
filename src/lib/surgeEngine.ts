import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data for local testing
const MOCK_SURGE_DATA: Record<string, { orders: number; partners: number }> = {
  'zone-1': { orders: 8, partners: 4 },
  'zone-2': { orders: 12, partners: 3 },
  'zone-3': { orders: 5, partners: 5 },
};

export function getDemandLevel(multiplier: number): 'low' | 'medium' | 'high' | 'critical' {
  if (multiplier >= 1.8) return 'critical';
  if (multiplier >= 1.5) return 'high';
  if (multiplier > 1.0) return 'medium';
  return 'low';
}

export async function calculateSurgeMultiplier(zoneId: string): Promise<{ multiplier: number; label: string; reason: string }> {
  try {
    // Use mock data - Redis disabled for local development
    const mockData = MOCK_SURGE_DATA[zoneId] || { orders: 5, partners: 5 };
    const activeOrders = mockData.orders;
    const availablePartners = mockData.partners;

    if (availablePartners === 0) {
      return { multiplier: 1.0, label: 'Low', reason: 'No available partners' };
    }

    const demandRatio = activeOrders / availablePartners;
    const surgePolicy = await prisma.surgePolicy.findFirst({ where: { zoneId } });

    if (!surgePolicy) {
      // Return calculated surge based on demand ratio
      let multiplier = 1.0;
      if (demandRatio > 2) multiplier = 1.5;
      if (demandRatio > 3) multiplier = 1.8;
      
      const demandLevel = getDemandLevel(multiplier);
      const label = demandLevel.charAt(0).toUpperCase() + demandLevel.slice(1);
      return { multiplier, label, reason: `Demand ratio: ${demandRatio.toFixed(2)}` };
    }

    let multiplier = 1.0;
    let label = 'Low';

    if (demandRatio > surgePolicy.threshold) {
      multiplier = surgePolicy.multiplier;
      const demandLevel = getDemandLevel(multiplier);
      label = demandLevel.charAt(0).toUpperCase() + demandLevel.slice(1);
    }

    return { multiplier, label, reason: `Demand ratio: ${demandRatio.toFixed(2)}` };
  } catch (error) {
    // Fallback to default
    return { multiplier: 1.0, label: 'Low', reason: 'Service temporarily unavailable' };
  }
}
