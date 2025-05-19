import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import router from "./Routes/user.route.js";
import getRoutes from "./Utils/getRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api", router);

app.get("/", (req, res) => {
  const routes = getRoutes(router);
  res.status(200).json({
    status: "success",
    message: "Welcome to the GatherPay Event Management API",
    version: "1.0.0",
    author: "Suryansh Singh",
    availableEndpoints: routes,
  });
});

export default app;
