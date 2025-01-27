import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config();


interface TokenPayload {
  id: string;
  userName: string;
}


export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION)  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION) });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
};
