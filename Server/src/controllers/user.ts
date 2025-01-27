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
                interest: 1,
                friends: 1,
                freindRequestSent: 1,
                friendRequestRecieved: 1
            }
        }
    ]);

    // console.log(userList);

    if (!userList.length)
        throw new AppError("UserList not found", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        allUsers: userList
    });
}

export const userDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    // console.log("userId", userId)

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
                friends: 1,
                freindRequestSent: 1,
                friendRequestRecieved: 1
            }
        }
    ]);
    // console.log("user[0]", user[0])

    if (!user.length)
        throw new AppError("User not found", 401);

    return res.status(200).json({
        success: true,
        user: user[0]
    })
}


export const getUserData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.query;


    const user = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId as string) }
        },
        {
            $project: {
                _id: 1,
                userName: 1,
                fullName: 1,
                profileImage: 1,
                interest: 1,
                friends: 1,
                freindRequestSent: 1,
                friendRequestRecieved: 1
            }
        }
    ]);
    console.log("user[0]", user[0])

    if (!user.length)
        throw new AppError("User not found", 404);

    return res.status(200).json({
        success: true,
        userData: user[0]
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
                _id: '$friendDetails._id',
                userName: '$friendDetails.userName',
                fullName: '$friendDetails.fullName',
                profileImage: '$friendDetails.profileImage',
                interest: '$friendDetails.interest',
            }
        }
    ]);

    if (!friendList.length)
        throw new AppError("Freinds not available", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        friends: friendList
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
                _id: '$friendDetails._id',
                userName: '$friendDetails.userName',
                fullName: '$friendDetails.fullName',
                profileImage: '$friendDetails.profileImage',
                interest: '$friendDetails.interest',
            }
        }
    ]);

    if (!requestRecievedList.length)
        throw new AppError("Freinds not available", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        requestReceived: requestRecievedList
    })
}

export const getRequestSended = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    console.log("userId", userId);

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
            $unwind: {
                path: '$friendDetails', // Unwinds the friendDetails array
                preserveNullAndEmptyArrays: true // if no match is found, the field will still exist but be null
            }
        },
        {
            $project: {
                _id: '$friendDetails._id',
                userName: '$friendDetails.userName',
                fullName: '$friendDetails.fullName',
                profileImage: '$friendDetails.profileImage',
                interest: '$friendDetails.interest',
            }
        }
    ]);

    console.log("requestSentList", requestSentList)

    if (!requestSentList.length)
        throw new AppError("Freinds not available", StatusCodes.NO_CONTENT);

    return res.status(StatusCodes.OK).json({
        success: true,
        requestSent: requestSentList
    })
}

export const sendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const { recieverId } = req.query;
    console.log("req.query", req.query);

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
        { _id: senderID, freindRequestSent: userId },
        { $pull: { freindRequestSent: userId } }
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

    console.log("opponentId", opponentID);

    const updateUser = UserModel.updateOne(
        { _id: userId, friends: opponentID },
        { $pull: { friends: opponentID } }
    );

    const updateOpponentUser = UserModel.updateOne(
        { _id: opponentID, friends: userId },
        { $pull: { friends: userId } }
    );

    const [user, opponent] = await Promise.all([updateUser, updateOpponentUser]);
    console.log("user", user);
    console.log("opponent", opponent);

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

    console.log("reciverID type", typeof userId);


    const updateUser = UserModel.updateOne(
        { _id: userId, freindRequestSent: recieverID },
        { $pull: { freindRequestSent: recieverID } }
    );
    const user = await UserModel.findById(userId);
    console.log("user", user);
    const reciever = await UserModel.findById(recieverID);
    console.log("user", reciever);

    const updateReceiver = UserModel.updateOne(
        { _id: recieverID, friendRequestRecieved: userId },
        { $pull: { friendRequestRecieved: userId } }
    );

    const [User, recievered] = await Promise.all([updateUser, updateReceiver]);
    console.log("User", User);
    console.log("reciever", recievered);

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

    const user = await UserModel.findById(userId).select("interest");
    console.log("recommendation", user);

    if (!user?.interest) {
        return res.status(404).json({
            success: false,
            message: 'No interests found'
        });
    }

    const userInterests = user.interest;
    const usersWithCommonInterests = await UserModel.find({
        _id: { $ne: userId },
        interest: { $in: userInterests },
      }).select("userName fullName profileImage interest friends _id");

    // const recommendations = await UserModel.aggregate([
    //     {
    //         // Step 2: Match the user by their ID and get their interests
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(userId),
    //         },
    //     },
    //     {
    //         // Step 3: Project only the interests array from the user
    //         $project: {
    //             interests: "$interest", // Alias the interest field
    //         },
    //     },
    //     {
    //         // Step 4: Lookup users with common interests
    //         $lookup: {
    //             from: "users", // The collection we are joining with (users)
    //             let: { userInterests: "$interests" }, // Pass the user's interests to the lookup stage
    //             pipeline: [
    //                 {
    //                     // Match users who have at least one common interest
    //                     $match: {
    //                         $expr: {
    //                             $in: ["$interest", "$$userInterests"], // Check if user's interest exists in the other users' interest array
    //                         },
    //                         _id: { $ne: userId }, // Exclude the given user from results
    //                     },
    //                 },
    //                 {
    //                     // Step 5: Project the relevant user fields
    //                     $project: {
    //                         userName: 1,
    //                         fullName: 1,
    //                         profileImage: 1,
    //                         interest: 1,
    //                     },
    //                 },
    //             ],
    //             as: "commonInterests", // Store the matched users in the "commonInterests" array
    //         },
    //     },
    //     {
    //         // Step 6: Unwind the "commonInterests" array so we get a flat list of users
    //         $unwind: {
    //             path: "$commonInterests",
    //             preserveNullAndEmptyArrays: true, // Keep users without common interests
    //         },
    //     },
    //     // {
    //     //     // Step 7: Project the final result with the matched user data
    //     //     $replaceRoot: {
    //     //         newRoot: "$commonInterests", // Replace the root with the "commonInterests" object
    //     //     },
    //     // },
    // ]);
    console.log("recommedation", usersWithCommonInterests);
    const recommendations = usersWithCommonInterests.length > 0 ? usersWithCommonInterests : [];

    return res.status(200).json({
        success: true,
        recommendations
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