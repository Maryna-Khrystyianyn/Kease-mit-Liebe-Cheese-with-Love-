import { users } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (user:users) => {
    return jwt.sign(
          { nick_name: user.nick_name, email: user.email, username: user.username, avatar:user.avatar, user_status:user.user_status },
          JWT_SECRET,
          { expiresIn: "7d" } 
        );
    
  };