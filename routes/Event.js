const router = require("express").Router();
const Event = require("../models/Events");
const verifyToken = require("../middlewares/verifyToken"); // Import token verification middleware

//  Create a new event (Protected Route)
router.post("/create", verifyToken, async (req, res) => {
  console.log(`Request received for create event`);
  console.log("Request body:", req.body);

  const { title, description, date, time, createdBy } = req.body;

  try {
    // Check if the event already exists
    let eventExists = await Event.findOne({ title, date, time });
    if (eventExists) {
      return res.status(400).json({ msg: "Event already exists." });
    }

    // Create new event
    let event = new Event({ title, description, date, time, createdBy });
    await event.save();
    res.status(201).json({ msg: "Event created successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

//  Get all events (Public Route)
router.get("/", async (req, res) => {
  console.log(`Request received for get all events`);

  try {
    const events = await Event.find().sort({ date: 1, time: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

//  Get an event by ID (Public Route)
router.get("/:id", async (req, res) => {
  console.log(`Request received for get an event`);

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

//  Update an event by ID (Protected Route)
router.put("/:id", verifyToken, async (req, res) => {
  console.log(`Request received for update event`);

  const { title, description, date, time, status } = req.body;

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    console.log(`req.user.id : ${req.user.uid}`)
    console.log(`created by : ${event.createdBy}`)
    // Ensure the user updating the event is the creator
    if (event.createdBy !== req.user.uid) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.status = status || event.status;

    await event.save();
    res.status(200).json({ msg: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Delete an event by ID (Protected Route)
router.delete("/:id", verifyToken, async (req, res) => {
  console.log(`Request received for delete event`);

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Ensure the user deleting the event is the creator
    if (event.createdBy !== req.user.uid) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    await event.deleteOne();
    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

//  Get events created by a specific user (Protected Route)
router.get("/user/:userId", verifyToken, async (req, res) => {
  console.log(`Request received for user created event`);

  // Ensure the user can only access their own events
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ msg: "Unauthorized action" });
  }

  try {
    const events = await Event.find({ createdBy: req.params.userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get events by type for a specific user (Protected Route)
router.get("/:userid/:type", verifyToken, async (req, res) => {
  console.log(`Request received for get event type`);

  const uid = req.params.userid;
  let type = req.params.type.toUpperCase();
  if (type == "ALL") {
    try {
      const events = await Event.find({ _id: uid }).sort({ date: 1, time: 1 });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  } else {
    try {
      const events = await Event.find({ createdBy: uid, status: type });
      return res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
});

//  Mark event as completed (Protected Route)
router.put("/complete/:id", verifyToken, async (req, res) => {
  console.log(`Request received for complete event`);

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Ensure only the event creator can mark it as completed
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    event.status = "COMPLETED";
    await event.save();
    res.status(200).json({ msg: "Event marked as completed", event });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
