const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/Users");

router.post("/signup", async (req,res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ msg: `User already exists!` });
    }

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, name, password: hashedPassword });

    await user.save();

    return res.status(201).json({ msg: `Registration with email ${email} successful`, user });
  } catch (error) {
    console.error(`Error in registering user with email ${email}:`, error);
    return res.status(500).json({ msg: `Internal Server Error` });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: `User with ${email} not found` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        return res.status(200).json({ msg: "Login successful" });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
