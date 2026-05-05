const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { cookieOptions } = require("../constants.js");

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim() || req.body.fullName?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const username = req.body.username?.trim().toLowerCase();

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, ...(username ? [{ username }] : [])],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    ...(username ? { username } : {}),
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const createdUser = await User.findById(user._id)?.select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "User registered successfully",
      user: createdUser,
      accessToken,
    });
});

const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password;

  if ((!email && !username) || !password) {
    throw new ApiError(400, "Email/username and password are required");
  }

  const user = await User.findOne({
    $or: [{ email }, ...(username ? [{ username }] : [])],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "User logged in successfully",
      user: loggedInUser,
      accessToken,
    });
});

const verifyGoogleCredential = async (credential) => {
  const { data } = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
    params: { id_token: credential },
    timeout: 10000,
  });

  const expectedAudience = process.env.GOOGLE_CLIENT_ID;
  if (!expectedAudience) {
    throw new Error("Google client ID is not configured");
  }

  if (data.aud !== expectedAudience) {
    throw new Error("Google token audience mismatch");
  }

  if (!data.email || data.email_verified !== "true") {
    throw new Error("Google account email is not verified");
  }

  return data;
};

const googleAuth = asyncHandler(async (req, res) => {
  const credential = req.body.credential;
  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  const googleProfile = await verifyGoogleCredential(credential);
  const email = googleProfile.email.trim().toLowerCase();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: googleProfile.name || email.split("@")[0],
      email,
      googleId: googleProfile.sub,
      username: email.split("@")[0],
    });
  } else {
    let shouldSave = false;

    if (!user.googleId) {
      user.googleId = googleProfile.sub;
      shouldSave = true;
    }
    if (!user.name && googleProfile.name) {
      user.name = googleProfile.name;
      shouldSave = true;
    }
    if (!user.username) {
      user.username = email.split("@")[0];
      shouldSave = true;
    }

    if (shouldSave) {
      await user.save({ validateBeforeSave: false });
    }
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "Google authentication successful",
      user: loggedInUser,
      accessToken,
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        "Access token refreshed successfully",
      ),
    );
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await User.findOneAndUpdate(
      { refreshToken },
      { $set: { refreshToken: null } },
      { new: true },
    );
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      message: "User logged out successfully",
    });
});

module.exports = {
  register,
  login,
  googleAuth,
  refreshAccessToken,
  logout,
};
