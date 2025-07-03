import express, { NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import {matchProperties, parseAndMatch } from "./controllers";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/health", (_req, res) => {
  res.json({ status: "UP" });
});

// middleware (naive way)
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "http://localhost:8081",
//     "http://127.0.0.1:8081",
//   ];

//   const origin = req.headers.origin || '';
//   if(allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     next();
//   } else {
//     res.status(403).json({ message: "Forbidden" });
//   }
// });

// all routes

app.post("/match-properties", matchProperties);
app.post("/parse-and-match", parseAndMatch);
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
