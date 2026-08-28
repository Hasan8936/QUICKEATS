import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Define the zones from mock data (we'll create them if they don't exist)
  const zones = [
    { id: 'zone-1', name: 'Hazratganj' },
    { id: 'zone-2', name: 'Gomti Nagar' },
    { id: 'zone-3', name: 'Indira Nagar' },
    { id: 'zone-4', name: 'Charbagh' },
    { id: 'zone-5', name: 'Alambagh' },
    { id: 'zone-6', name: 'Aminabad' },
    { id: 'zone-7', name: 'Chowk' },
    { id: 'zone-8', name: 'Aliganj' },
    { id: 'zone-9', name: 'Mahanagar' },
    { id: 'zone-10', name: 'Rajajipuram' },
  ];

  // Create zones if they don't exist
  for (const zone of zones) {
    await prisma.zone.upsert({
      where: { id: zone.id },
      update: {}, // Don't update if exists
      create: zone,
    });
  }

  // Create initial surge policies for each zone
  // We'll set different thresholds and multipliers for variety
  const surgePolicies = [
    { zoneId: 'zone-1', threshold: 2, multiplier: 1.2 },
    { zoneId: 'zone-2', threshold: 3, multiplier: 1.5 },
    { zoneId: 'zone-3', threshold: 4, multiplier: 1.8 },
    { zoneId: 'zone-4', threshold: 2, multiplier: 1.9 },
    { zoneId: 'zone-5', threshold: 3, multiplier: 1.3 },
    { zoneId: 'zone-6', threshold: 2, multiplier: 1.4 },
    { zoneId: 'zone-7', threshold: 3, multiplier: 1.6 },
    { zoneId: 'zone-8', threshold: 2, multiplier: 1.2 },
    { zoneId: 'zone-9', threshold: 3, multiplier: 1.35 },
    { zoneId: 'zone-10', threshold: 4, multiplier: 1.7 },
  ];

  // Create surge policies if they don't exist
  for (const policy of surgePolicies) {
    await prisma.surgePolicy.upsert({
      where: { zoneId: policy.zoneId },
      update: {}, // Don't update if exists
      create: policy,
    });
  }

  console.log('Seeded zones and surge policies');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });