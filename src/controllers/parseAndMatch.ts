import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";
import { extractPreference } from "@/utils/preference";

export default async function parseAndMatch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { message } = req.body;
    const preference = await extractPreference(message);

    console.log({
      LLMpreference: preference,
    });

    const {
      location,
      budget,
      bedrooms,
      bathrooms,
      amenities = [],
      move_in_date,
    } = preference;

    const properties = await prisma.property.findMany({
      where: {
        location: { contains: location, mode: "insensitive" },
        price: { lte: budget },
        bedrooms: { gte: bedrooms },
        availableFrom: { lte: new Date(move_in_date) },
        amenities: {
          hasEvery: amenities.length > 0 ? amenities : undefined,
        },
      },
      orderBy: {
        price: "asc",
      },
    });

    res.json({
      extractedPreferences: preference,
      matches: properties,
    });
  } catch (error) {
    console.error("Error matching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
