import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/appError";
import * as model from "../crud/base_mongo_crud";
import { UserModel } from "../models/Users";
import mongoose from "mongoose";

export const allUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const userList = await UserModel.aggregate([
        {
            $project: {
                _id: 1,
                userName: 1,
                fullName: 1,
                profileImage: 1,
                interest: 1
            }
        }
    ]);

    console.log(userList);

    if (!userList.length)
        throw new AppError("UserList not found", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        userList: userList
    });
}

export const userDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const user = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $project: {
                _id: 1,
                userName: 1,
                fullName: 1,
                profileImage: 1,
                interest: 1,
            }
        }
    ]);

    if (!user[0].length)
        throw new AppError("User not found", 401);

    return res.status(200).json({
        success: true,
        user: user[0]
    })
}

export const searchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { query } = req.query;
    const userId = req.user?.id;

    if (!query) {
        const allUsers = await UserModel.find({
            _id: { $ne: userId }
        }).select('_id username fullName profileImage interest')
        return res.status(400).json({
            success: true,
            message: "Search query is required",
            allUsers
        });
    }

    // Use $regex with optimized pattern to handle case-insensitivity
    const regex = new RegExp(query as string, 'i'); // Case-insensitive matching

    const users = await UserModel.find({
        $or: [
            { username: { $regex: regex } },
            { fullName: { $regex: regex } }
        ],
        _id: { $ne: userId }
    }).select('_id username fullName profileImage interest')

    return res.status(200).json({
        success: true,
        users
    });

}

export const friends = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const friendList = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'friends',
                foreignField: '_id',
                as: 'friendDetails'
            }
        },
        {
            $unwind: '$friendDetails',
        },
        {
            $project: {
                friendId: '$friendDetails._id',
                userName: '$friendDetails.userName',
                fullName: '$friendDetails.fullName',
                profileImage: '$friendDetails.profileImage',
                interest: '$friendDetails.interest',
            }
        }
    ]);

    if (!friendList[0].length)
        throw new AppError("Freinds not available", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        friendsList: friendList[0]
    })
}

export const getRequestRecieved = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const requestRecievedList = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'friendRequestRecieved',
                foreignField: '_id',
                as: 'friendDetails'
            }
        },
        {
            $unwind: '$friendDetails',
        },
        {
            $project: {
                friendId: '$friendDetails._id',
                userName: '$friendDetails.userName',
                fullName: '$friendDetails.fullName',
                profileImage: '$friendDetails.profileImage',
                interest: '$friendDetails.interest',
            }
        }
    ]);

    if (!requestRecievedList[0].length)
        throw new AppError("Freinds not available", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        requestRecievedList: requestRecievedList[0]
    })
}

export const getRequestSended = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const requestSentList = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'freindRequestSent',
                foreignField: '_id',
                as: 'friendDetails'
            }
        },
        {
            $unwind: '$friendDetails',
        },
        {
            $project: {
                friendId: '$friendDetails._id',
                userName: '$friendDetails.userName',
                fullName: '$friendDetails.fullName',
                profileImage: '$friendDetails.profileImage',
                interest: '$friendDetails.interest',
            }
        }
    ]);

    if (!requestSentList[0].length)
        throw new AppError("Freinds not available", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        requestSentList: requestSentList[0]
    })
}

export const sendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const { recieverId } = req.query;

    if (!recieverId)
        throw new AppError("Feild not Found", StatusCodes.BAD_REQUEST);

    const [sender, reciever] = await Promise.all([
        model.findById(UserModel, userId),
        model.findById(UserModel, String(recieverId)),
    ]);

    if (!sender || !reciever)
        throw new AppError("Friend does not exist", StatusCodes.NOT_FOUND);

    // /checking they are already request is pending or friend
    if (reciever.friendRequestRecieved.includes(new mongoose.Types.ObjectId(sender._id as string)) || sender.friends.includes(new mongoose.Types.ObjectId(reciever._id as string))) {
        throw new AppError("Rquest alredy exist", StatusCodes.CONFLICT);
    }

    reciever.friendRequestRecieved.push(new mongoose.Types.ObjectId(sender._id as string));
    sender.freindRequestSent.push(new mongoose.Types.ObjectId(reciever._id as string));

    const [updatedReciever, updatedSender] = await Promise.all([reciever.save(), sender.save()]);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Request sent successfully"
    });
}

export const acceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { senderID } = req.query;
    const userId = req.user?.id;

    if (!senderID)
        throw new AppError("Feild not Found", StatusCodes.BAD_REQUEST);

    const [user, sender] = await Promise.all([
        model.findById(UserModel, userId),
        model.findById(UserModel, String(senderID)),
    ]);

    if (!user || !sender)
        throw new AppError("Sender not Found", StatusCodes.NOT_FOUND);


    const updatedUser = UserModel.updateOne(
        { _id: req.user?.id },
        { $push: { friends: senderID }, $pull: { friendRequestRecieved: new mongoose.Types.ObjectId(senderID as string) } }
    );

    const updateSender = UserModel.updateOne(
        { _id: senderID },
        { $push: { friends: req.user?.id }, $pull: { freindRequestSent: new mongoose.Types.ObjectId(req.user?.id) } }
    );

    await Promise.all([updatedUser, updateSender]);

    return res.status(200).json({
        success: true,
        message: "Friend request accepted"
    });
};

export const rejectFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { senderID } = req.query;
    const userId = req.user?.id

    const updateSender = UserModel.updateOne(
        { _id: senderID, friendRequestSent: userId },
        { $pull: { friendRequestSent: userId } }
    );

    const updateUser = UserModel.updateOne(
        { _id: userId, friendRequestRecieved: senderID },
        { $pull: { friendRequestRecieved: senderID } }
    );

    await Promise.all([updateSender, updateUser]);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Rejected successfully"
    })
}

export const unfollow = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { opponentID } = req.query;
    const userId = req.user?.id;

    const updateUser = UserModel.updateOne(
        { _id: userId, friends: opponentID },
        { $pull: { friends: opponentID } }
    );

    const updateOpponentUser = UserModel.updateOne(
        { _id: opponentID, friends: userId },
        { $pull: { friends: userId } }
    );

    await Promise.all([updateUser, updateOpponentUser]);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Unfollowed from friend list"
    });
}

export const withdrawRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { recieverID } = req.query;
    const userId = req.user?.id;

    const updateUser = UserModel.updateOne(
        { _id: userId, friendRequestSent: recieverID },
        { $pull: { friendRequestSent: recieverID } }
    );

    const updateReceiver = UserModel.updateOne(
        { _id: recieverID, friendRequestRecieved: userId },
        { $pull: { friendRequestRecieved: userId } }
    );

    await Promise.all([updateUser, updateReceiver]);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Request withdrawn successfully"
    });
}

export const getAllInterest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const interests = [
        'Coding',
        'Reading Books',
        'Machine Learning',
        'Travelling',
        'Music',
        'Sports',
        'Photography',
        'Gaming',
        'Cooking',
        'Writing',
        'Movies',
        'Fitness',
    ];

    res.status(200).json({
        success: true,
        message: "Interest Fetched successfully",
        interests
    });
}

export const getRecommendation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const userInterest = await UserModel.findById(userId);
    console.log("recommendation", userInterest);

    if (!userInterest?.interest) {
        return res.status(404).json({
            success: false,
            message: 'No interests found'
        });
    }

    const recommendations = await UserModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'users', 
                let: { userInterests: "$interest" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$interest", "$$userInterests"] }
                        }
                    },
                    {
                        $match: {
                            _id: { $nin: userInterest?.friends },
                            // _id: { $ne: userInterest?._id }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            profileImage: 1,
                            interest: 1
                        }
                    }
                ],
                as: 'recommendations' 
            }
        },
        {
            $project: {
                recommendations: 1
            }
        }
    ]);

    const recommendedUsers = recommendations.length > 0 ? recommendations[0].recommendations : [];

    return res.status(200).json({
        success: true,
        recommendedUsers: recommendedUsers
    });

}

export const updateInterest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const { interests } = req.body;  

    const userUpdateResult = await UserModel.updateOne(
        { _id: userId },
        {
            $addToSet: {
                interest: { $each: interests } 
            }
        }
    );

    if (userUpdateResult.modifiedCount === 0) {
        return res.status(404).json({
            success: false,
            message: 'User not found or no updates made'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'User interests updated successfully'
    });

}