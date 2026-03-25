import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (
  token: string | undefined,
  jwtSecret: string
): JwtPayload | null => {

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch (err) {
    return null;
  }
};