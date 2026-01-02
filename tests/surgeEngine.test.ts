import { calculateSurgeMultiplier } from '@/lib/surgeEngine';
import { PrismaClient } from '@prisma/client';

jest.mock('ioredis');
jest.mock('@prisma/client', () => {
  const PrismaMock = jest.fn(() => ({
    surgePolicy: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  }));
  return { PrismaClient: PrismaMock };
});

const prismaMock = new PrismaClient();
const { Redis } = require('ioredis');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('calculateSurgeMultiplier', () => {
  it('should return low surge when no active orders or partners', async () => {
    const redisMock = new Redis();
    redisMock.get.mockResolvedValue('0');
    prismaMock.surgePolicy.findFirst.mockResolvedValue(null);

    const result = await calculateSurgeMultiplier('zone-1');

    expect(result).toEqual({
      multiplier: 1.0,
      label: 'Low',
      reason: 'No surge policy defined',
    });
  });

  it('should calculate surge based on demand ratio', async () => {
    const redisMock = new Redis();
    redisMock.get.mockImplementation((key) => {
      if (key === 'active_orders:zone-1') return Promise.resolve('10');
      if (key === 'available_partners:zone-1') return Promise.resolve('2');
      return Promise.resolve('0');
    });

    prismaMock.surgePolicy.findFirst.mockResolvedValue({
      threshold: 4,
      multiplier: 1.5,
    });

    const result = await calculateSurgeMultiplier('zone-1');

    expect(result).toEqual({
      multiplier: 1.5,
      label: 'High',
      reason: 'Demand ratio: 5.00',
    });
  });
});