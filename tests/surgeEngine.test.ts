import { calculateSurgeMultiplier } from '@/lib/surgeEngine';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const PrismaMock = jest.fn(() => ({
    surgePolicy: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  }));
  return { PrismaClient: PrismaMock };
});

const prismaMock = new PrismaClient();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('calculateSurgeMultiplier', () => {
  it('should return low surge when no active orders or partners', async () => {
    const result = await calculateSurgeMultiplier('zone-1');

    expect(result).toEqual({
      multiplier: 1.0,
      label: 'Low',
      reason: 'Demand ratio: 2.00',
    });
  });

  it('should calculate surge based on demand ratio', async () => {
    const result = await calculateSurgeMultiplier('zone-2');

    expect(result).toEqual({
      multiplier: 1.8,
      label: 'Critical',
      reason: 'Demand ratio: 4.00',
    });
  });
});