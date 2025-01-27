import { Request, Response, NextFunction } from 'express';
import { TokenPayload, verifyAccessToken } from '../utils/jwtUtils';
import AppError from '../utils/appError';
import jwt from "jsonwebtoken";
import { UserModel } from '../models/Users';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_Token =
            req.cookies["accessToken"] ||
            req.headers.authorization?.replace("Bearer ", "");
        if (!access_Token) {
            throw new AppError("Token must be provided", 401);
        }

        // console.log("access_toekn", access_Token);

        let decoded: TokenPayload | null = verifyAccessToken(access_Token);
        // try {
        //     decoded = jwt.verify(
        //         access_Token,
        //         process.env.JWT_ACCESS_SECRET as string
        //     ) as TokenPayload;
        // } catch (err: any) {
        //     if (err.name === "TokenExpiredError") {
        //         return next(
        //             new AppError(
        //                 "Access token has expired. Please refresh your token.",
        //                 401
        //             )
        //         );
        //     }
        //     return next(new AppError("Invalid access token", 401));
        // }

        if (!decoded) {
            return next(new AppError("Token verification failed", 401));
        }

        const currentUser = await UserModel.findById(decoded.id).select(
            "-password -refreshToken"
        );
        if (!currentUser) {
            return next(
                new AppError("The user belonging to this token no longer exists.", 401)
            );
        }

        // console.log("decoded", decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Error in authHandler middleware:", err);
        next(
            new AppError("An unexpected error occurred during authentication", 500)
        );
    }
}