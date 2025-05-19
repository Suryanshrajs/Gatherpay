import Event from "../Models/Event.model.js";
import User from "../Models/User.model.js";
import fs from "fs";
import path from "path";

function getStatus(date, time) {
  const now = new Date();
  const eventDate = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  eventDate.setHours(hours, minutes, 0, 0);

  const diffMs = eventDate - now;
  const isToday = eventDate.toDateString() === now.toDateString();

  if (isToday && Math.abs(diffMs) <= 1000 * 60 * 60 * 4) {
    return "ongoing";
  } else if (eventDate > now) {
    return "upcoming";
  } else {
    return "completed";
  }
}

const createEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    location,
    fee: rawFee,
    category,
  } = req.body;

  const status = getStatus(date, time);

  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const fee = Number(rawFee);

  if (!title || !description || !date || !time || !location || !fee) {
    return res.status(400).json({
      message: "All required fields must be provided",
    });
  }

  if (typeof fee !== "number" || fee < 0) {
    return res.status(400).json({
      message: "Fee must be a positive number",
    });
  }

  try {
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      fee,
      status,
      image: req.file ? req.file.filename : "",
      category,
      organizer: {
        userId: user._id,
        name: user.name,
      },
    });

    const savedEvent = await event.save();
    res.status(201).json({
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getEventsByOwner = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const organizerId = req.user._id;

    const events = await Event.find({ "organizer.userId": organizerId }).lean();

    let totalCollection = 0;
    let totalParticipants = 0;

    const eventsWithStats = events.map((event) => {
      const completedContributions =
        event.contributions?.filter((c) => c.paymentStatus === "completed") ||
        [];

      const eventParticipants = completedContributions.length;
      const eventCollection = completedContributions.reduce(
        (sum, c) => sum + c.amount,
        0
      );

      totalParticipants += eventParticipants;
      totalCollection += eventCollection;

      return {
        ...event,
        totalParticipants: eventParticipants,
        totalCollection: eventCollection,
      };
    });

    const statusOrder = {
      ongoing: 1,
      upcoming: 2,
      completed: 3,
      cancelled: 4,
    };

    const eventsWithStatsSorted = eventsWithStats.sort(
      (a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
    );

    return res.status(200).json({
      message: "Events fetched successfully",
      totalParticipants,
      totalCollection,
      events: eventsWithStatsSorted,
    });
  } catch (error) {
    console.error("Error fetching events by organizer:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  const statusOrder = {
    ongoing: 1,
    upcoming: 2,
    completed: 3,
    cancelled: 4,
  };

  try {
    const events = await Event.find().sort({ createdAt: -1 });

    const sortedEvents = events.sort((a, b) => {
      const statusA = statusOrder[a.status] || 99;
      const statusB = statusOrder[b.status] || 99;
      return statusA - statusB;
    });

    return res.status(200).json({
      message: "Events fetched successfully",
      events: sortedEvents,
    });
  } catch (error) {
    console.error("Error in fetching events", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in fetching events" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const completedContributions =
      event.contributions?.filter((c) => c.paymentStatus === "completed") || [];

    const totalParticipants = completedContributions.length;
    const totalCollection = completedContributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    return res.status(200).json({
      message: "Event fetched successfully",
      event: {
        ...event.toObject(),
        totalParticipants,
        totalCollection,
      },
    });
  } catch (error) {
    console.error("Error in fetching event", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in fetching event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const newImage = req.file.filename;

      if (event.image) {
        const oldImagePath = path.join("uploads", event.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = newImage;
    } else if (req.body.existingImage) {

      updateData.image = req.body.existingImage;
    } else {
  
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      message: "Internal Server Error in updating event",
      error: error.message,
    });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.image) {
      const imagePath = path.join("uploads", event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`🗑️ Deleted image file: ${event.image}`);
      }
    }
    await event.deleteOne();
    return res
      .status(200)
      .json({ message: "Event and image deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByOwner,
};
