import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import "colors"
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";
import AppError from "../utils/appError";
import * as model from "../crud/base_mongo_crud";
import { UserModel } from "../models/Users";

// userName, fullName, password
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userName, fullName, password } = req.body;

  try {
    
    const user = await model.exists(UserModel, { userName });
    if (user) {
      return next(new AppError("User already exists", StatusCodes.CONFLICT));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${userName}`;
    
    const createdUser = await model.create(UserModel, { password: hashedPassword, userName, fullName, profileImage });
    if (!createdUser)
      throw new AppError("DB Error", StatusCodes.BAD_GATEWAY)

    const accessToken = generateAccessToken({
      id: createdUser._id as string,
      userName: createdUser.userName,
    });
    const refreshToken = generateRefreshToken({
      id: createdUser._id as string,
      userName: createdUser.userName,
    });

    await model.findOneAndUpdate(UserModel, { _id: createdUser.id }, { refreshToken });

    res
      .status(StatusCodes.CREATED)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "Registration successful", accessToken });
  } catch (err: any) {
    console.log(err.message)
    throw new AppError("Error registering user", StatusCodes.INTERNAL_SERVER_ERROR)
  }
};

// userName, email
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { userName, password } = req.body;

  try {
    const user = await model.findOne(UserModel, { userName });
    if (!user)
      throw new AppError(`User is not registered`, StatusCodes.NOT_FOUND);

    if (!await bcrypt.compare(password, user.password))
      throw new AppError("Invalid Password", StatusCodes.FORBIDDEN)

    const accessToken = generateAccessToken({ id: String(user._id), userName: user.userName });
    const refreshToken = generateRefreshToken({ id: String(user._id), userName: user.userName });
    await model.findOneAndUpdate(UserModel, { _id: user._id }, { refreshToken: refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })


    return res.status(StatusCodes.OK).json({
      message: "Login succesfully", 
      accessToken, 
      user:{
        userName :user.userName,
        fullName: user.fullName
      }
    });
  } catch (err: any) {
    console.log(err.message)
    throw new AppError("Error while login", StatusCodes.INTERNAL_SERVER_ERROR)
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token is required", StatusCodes.FORBIDDEN)
  }

  try {
    const user = await model.findOne(UserModel, { refreshToken });
    if (!user) {
      throw new AppError("Invalid refresh token", StatusCodes.FORBIDDEN)
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      id: payload.id,
      userName: payload.userName
    });

    res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch (err: any) {
    throw new AppError("Invalid refresh token", StatusCodes.FORBIDDEN)
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token is required", StatusCodes.FORBIDDEN)
  }

  try {
    const user = await model.findOneAndUpdate(UserModel, { refreshToken }, { refreshToken: "" });
    if (!user) {
      throw new AppError("Invalid refresh token", StatusCodes.FORBIDDEN)
    }

    res
      .status(StatusCodes.OK)
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({ message: "Logged out successfully" });
  } catch (err: any) {
    throw new AppError("Error logging out", StatusCodes.INTERNAL_SERVER_ERROR)
  }
};


