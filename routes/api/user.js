const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const userRoles = require("../../models/User_Roles");
const { check, validationResult } = require("express-validator");

//Route POST    api/users
//Description   Register a user

router.post(
  "/",
  [
    check("username", "Username is required")
      .not()
      .isEmpty(),
    check("password", "Incorrect Password type").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      //check if user exists
      let user_present = await User.findOne({ username });
      if (user_present) {
        return res.status(400).json({ msg: "User already present" });
      }
      //register new user
      let newUser = await new User({
        username,
        password
      });
      await newUser.save();
      //get new user by ID
      let user = await User.findById({ _id: newUser.id }).select("-password");
      //Check if user registered is first one
      let users = await User.countDocuments({});
      let role = {};
      //console.log(users);
      //Assign role to first user
      if ((await users) === 1) {
        role = await new userRoles({
          user: user,
          role: "admin"
        });
        await role.save();
        return res.json(role);
      }

      //Assign Role to all other users
      role = await new userRoles({
        user: user
      });
      await role.save();
      res.json(role);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "server error" });
    }
  }
);

//Route GET    api/users
//Description   Retrive all users
router.get("/", async (req, res) => {
  try {
    let user = await User.find();
    res.json(user);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
