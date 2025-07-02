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
      //   {
      //     title: "Modern 2BR Apartment",
      //     description: "Pet-friendly unit with parking and WiFi",
      //     location: "Brooklyn",
      //     price: 1800,
      //     bedrooms: 2,
      //     bathrooms: 1,
      //     type: "apartment",
      //     amenities: ["wifi", "parking", "pet-friendly"],
      //     availableFrom: new Date("2025-08-01")
      //   },
      //   {
      //     title: "Cozy 1BR Condo",
      //     description: "Quiet neighborhood, ideal for singles",
      //     location: "Queens",
      //     price: 1400,
      //     bedrooms: 1,
      //     bathrooms: 1,
      //     type: "condo",
      //     amenities: ["wifi"],
      //     availableFrom: new Date("2025-07-15")
      //   },
      ...moddifiedSeedInformation,
      // Add more test listings here...
    ],
  });

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
