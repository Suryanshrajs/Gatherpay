import { Router } from "express";
import verifyJwt from "../Middlewares/verifyJwt.middleware.js";
import upload from "../Middlewares/multer.middleware.js";
import {
  login,
  registerUser,
  logout,
  isLoggedin,
  updatePersonalInfo,
  userInfo,
} from "../Controllers/user.contoller.js";

import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventsByOwner,
} from "../Controllers/event.controller.js";
import {
  createOrder,
  verifyPayment,
} from "../Controllers/payment.controller.js";

const router = Router();

router.post("/login",login);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/logout", verifyJwt, logout);
router.get("/userInfo", verifyJwt, userInfo);
router.get("/isLoggedin", isLoggedin);
router.patch("/updatePersonalInfo", verifyJwt, updatePersonalInfo);

// Event routes
router.post("/createEvent", verifyJwt, upload.single("image"), createEvent);
router.get("/getEvents", getEvents);
router.get("/event/:id", getEventById);
router.patch("/event/:id", verifyJwt, upload.single("image"), updateEvent);
router.delete("/event/:id", verifyJwt, deleteEvent);
router.get("/getEventsByOwner", verifyJwt, getEventsByOwner);

// Payment routes
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
