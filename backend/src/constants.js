const DB_NAME = "ecom";
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  path: "/",
};

module.exports = {
  DB_NAME,
  cookieOptions,
};
