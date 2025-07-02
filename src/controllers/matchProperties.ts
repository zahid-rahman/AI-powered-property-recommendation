// import { demoService } from "@/services/demoService";
import prisma from "@/prisma";
import { NextFunction, Request, Response } from "express";

const matchProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // request body
    const { location, budget, bedrooms, amenities = [], moveInDate } = req.body;

    const where: any = {};
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (budget) where.price = { lte: budget };
    if (bedrooms) where.bedrooms = { gte: bedrooms };
    if (moveInDate) where.availableFrom = { lte: new Date(moveInDate) };
    if (amenities.length > 0) where.amenities = { hasEvery: amenities };

    const properties = await prisma.property.findMany({
      where,
      orderBy: { price: "asc" },
    });

    // Convert amenities array to object for each property
    const propertiesWithAmenitiesObj = properties.map((p) => ({
      ...p,
      amenities: amenities.reduce(
        (acc: Record<string, boolean>, key: string) => {
          acc[key] = p.amenities.includes(key);
          return acc;
        },
        {}
      ),
    }));

    res.json({
      matches: propertiesWithAmenitiesObj,
      count: propertiesWithAmenitiesObj.length,
    });
  } catch (error) {
    console.error("Error matching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default matchProperties;
