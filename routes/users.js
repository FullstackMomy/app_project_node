const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");

const { User, validateUser } = require("../models/users");
const auth = require("../middleware/auth");

//  register user

router.post("/", async (req, res) => {
  //validate user input:
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //validate system input:
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User alredy registered");
    return;
  }
  //process:
  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);
  await user.save();
  //result:
  // res.json(_.pick(user, ["_id", "name", "email", "biz"]));
  res.json(user);
});

// login

router.post("/login", async (req, res) => {
  //validate input
  const { error } = validate(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }
  const passCheck = await bcrypt.compare(req.body.password, user.password);
  if (!passCheck) {
    res.status(400).send("Invalid email or password");
    return;
  }
  //process
  const token = user.generateAuthToken();
  res.send({ token });
});

// Get all users

router.get("/", auth("isAdmin"), async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (err) {
    res.status(401).send(err.message);
    return;
  }
});

//Get user by id
router.get("/:id", auth("isAdmin", "userOwner"), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select(
      "-password -__v"
    );
    res.json(user);
  } catch (err) {
    res.statusMessage = "User was not found.";
    res.status(401).send("User was not found.");
    return;
  }
});

//Edit user
router.put("/:id", auth("userOwner"), async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });

  if (user) {
    res.status(401).send("There is a user with this email.");
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

// Change isBusiness status
router.patch("/:id", auth("userOwner"), async (req, res) => {
  if (
    !Object.keys(req.body).includes("isBusiness") ||
    typeof req.body.isBusiness !== "boolean"
  ) {
    res.status(401).send(`"isBusiness" must exist and be of type "boolean".`);
    return;
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isBusiness: req.body.isBusiness },
      { new: true }
    );
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

// Delete user
router.delete("/:id", auth("isAdmin", "userOwner"), async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    if (!user) {
      res.status(401).send("The user does not exist.");
      return;
    }
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email({ tlds: false }),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

module.exports = router;
