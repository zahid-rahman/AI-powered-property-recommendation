import { PrismaClient } from "@prisma/client";
import { fakeProperties } from "../db/fakedata";
import { de, faker } from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  const moddifiedSeedInformation = fakeProperties.map((property) => {
    const copyProperty: any = { ...property };
    delete copyProperty.id; // Remove id to avoid conflict with auto-increment
    return {
      ...copyProperty,
      availableFrom: new Date(copyProperty.availableFrom),
    };
  });
  await prisma.property.createMany({
    data: [
      ...moddifiedSeedInformation,
    ],
  });

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
