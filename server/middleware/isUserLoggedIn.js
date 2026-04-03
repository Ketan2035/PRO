import jwt from "jsonwebtoken";

export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not logged in",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded; // contains user id
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};