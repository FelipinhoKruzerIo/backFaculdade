const User = require("../models/User");
const { ObjectId } = require("mongodb");

const availableFields = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "userType",
  "email",
  "phone",
  "password",
];

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const createNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  try {
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      email,
      password: hashedPwd,
    });

    res
      .status(201)
      .json({ success: `New user ${email} created!`, insertedUser: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      gender: req.body.gender,
      userType: req.body.userType,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    };

    const filteredPayload = Object.entries(payload).reduce(
      (acc, [key, value]) => {
        if (!!value) return { ...acc, [key]: value };
        return acc;
      },
      {}
    );

    if (!req?.params?.id) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const user = await User.findOne({
      _id: new ObjectId(String(req.params.id)),
    }).exec();
    if (!user) {
      return res
        .status(204)
        .json({ message: `No user matches ID ${req.params.id}.` });
    }

    Object.entries(filteredPayload).forEach(([key, value]) => {
      user[key] = value;
    });
    const result = await user.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req?.params?.id)
      return res.status(400).json({ message: "User ID required." });

    const user = await User.findOne({ _id: new Object(req.params.id) }).exec();
    if (!user) {
      return res
        .status(204)
        .json({ message: `No user matches ID ${req.params.id}.` });
    }
    const result = await user.deleteOne(); //{ _id: req.body.id }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    if (!req?.params?.id)
      return res.status(400).json({ message: "User ID required." });

    const user = await User.findOne({
      _id: new ObjectId(String(req.params.id)),
    }).exec();
    if (!user) {
      return res
        .status(204)
        .json({ message: `No user matches ID ${req.params.id}.` });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
};
