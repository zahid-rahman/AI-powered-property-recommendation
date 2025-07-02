"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/health", (_req, res) => {
    res.json({ status: "ok" });
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
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
