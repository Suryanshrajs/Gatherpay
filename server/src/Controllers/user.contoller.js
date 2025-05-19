import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      message: "All Credentials are required",
    });
  }

  try {
    let user = await User.findOne({ email }).select("+password -__v");

    if (!user) {
      return res.status(400).json({
        message:
          "No account found with this email. Please register to continue.",
      });
    }

    const verification = await user.isPasswordCorrect(password);

    if (!verification) {
      return res.status(400).json({
        message: "Incorrect password. Please try again.",
      });
    }

    const token = user.generateToken();

    if (!token) {
      return res.status(500).json({
        message: "Internal Server error in generating Token",
      });
    }

    user = user.toObject();
    delete user.password;

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    };

    return res.status(200).cookie("token", token, options).json({
      message: "Successfully Logged in",
      user,
      token,
    });
  } catch (error) {
    console.error("Error in login", error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      name
    )}`;

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    return res.status(200).json({
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.error("Error in registering user", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in Registering User" });
  }
};

const logout = async (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};

const userInfo = async (req, res) => {
  return res.status(200).json({
    message: "User Info Fetched Successfully",
    user: req.user,
  });
};

const isLoggedin = async (req, res) => {
  const token = req?.cookies.token;
  if (!token) {
    return res.status(200).json({
      message: "User is not Logged In",
      isLoggedin: false,
    });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -__v");
    if (!user) {
      return res.status(200).json({
        message: "User is not Logged In",
        isLoggedin: false,
      });
    }
    return res.status(200).json({
      message: "User is Logged In",
      isLoggedin: true,
      user,
    });
  } catch (error) {
    return res.status(200).json({
      message: "User is not Logged In",
      isLoggedin: false,
    });
  }
};

const updatePersonalInfo = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(400).json({ message: "Unathorized Access" });
  }
  try {
    const { phone, email, dob, name } = req.body;
    if (!phone || !email || !dob || !name) {
      return res.status(400).json({ message: "All Field/Data Required" });
    }
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          phone,
          email,
          dob,
          name,
        },
      },
      {
        new: true,
      }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "Internal Server Error in Updating User Personal Info",
      });
    }
    return res.status(200).json({
      message: "User Personal Info Updated Successfully",
      user,
    });
  } catch (error) {
    console.error("Error in Updating personalInfo", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  login,
  registerUser,
  logout,
  userInfo,
  isLoggedin,
  updatePersonalInfo,
};
