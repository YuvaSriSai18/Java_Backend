const router = require("express").Router();
const Event = require("../models/Events");

//  Create a new event
router.post("/create", async (req, res) => {
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

//  Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

//  Get an event by ID
router.get("/:id", async (req, res) => {
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

//  Update an event by ID
router.put("/:id", async (req, res) => {
  const { title, description, date, time, status } = req.body;

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
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

// ✅ Delete an event by ID
router.delete("/:id", async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    await event.deleteOne();
    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

//  Get events created by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.params.userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/:userid/:type/", async (req, res) => {
  const uid = req.params.userid;
  let type = req.params.type.toUpperCase();

  try {
    const events = await Event.find({ createdBy: uid, status: type });
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});
//  Mark event as completed
router.put("/complete/:id", async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    event.status = "COMPLETED";
    await event.save();
    res.status(200).json({ msg: "Event marked as completed", event });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
