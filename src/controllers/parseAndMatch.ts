import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";
import { extractPreference } from "@/utils/preference";
import { generateRecommendation } from "@/utils/generateRecommendation";

export default async function parseAndMatch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { message } = req.body;
    const preference = await extractPreference(message);

    const {
      location,
      budget,
      bedrooms,
      bathrooms,
      amenities = [],
      move_in_date,
      type,
    } = preference;
    const where: any = {};
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (budget) where.price = { lte: budget };
    if (bedrooms) where.bedrooms = { gte: bedrooms };
    if (bathrooms) where.bathrooms = { gte: bathrooms };
    if (move_in_date) where.availableFrom = { lte: new Date(move_in_date) };
    if (amenities.length > 0) where.amenities = { hasEvery: amenities };
    if (type) where.type = { equals: type };

    const properties = await prisma.property.findMany({
      where,
      orderBy: {
        price: "asc",
      },
    });

    // calling the recommendation message through AI
    let recommendationMessage = null;
    let preferences = where;
    if (properties.length > 0) {
      // send the entire result set to the LLM (or just top 5 to keep token usage low)
      recommendationMessage = await generateRecommendation(
        preferences,
        properties.slice(0, 5)
      );
    }

    res.json({
      extractedPreferences: preference,
      matches: properties,
      recommendation: recommendationMessage,
    });
  } catch (error) {
    console.error("Error matching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
