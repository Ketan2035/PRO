import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, `${process.env.SECRET_KEY}`, {
    expiresIn: "1d",
  });
 console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
