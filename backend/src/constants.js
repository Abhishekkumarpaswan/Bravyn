const DB_NAME = "ecom";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

module.exports = {
  DB_NAME,
  cookieOptions,
};
