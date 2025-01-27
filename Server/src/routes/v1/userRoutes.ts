import express from "express"
import { authHandler } from "../../middlewares/authHandler";
import asyncHandler from "../../utils/asyncHandler";
import { acceptFriendRequest, allUsers, friends, getAllInterest, getRecommendation, getRequestRecieved, getRequestSended, rejectFriendRequest, searchUser, sendFriendRequest, unfollow, updateInterest, userDetail, withdrawRequest, getUserData, getMutualFriends } from "../../controllers/user";

const router = express.Router()


router.route("/allUsers").get(authHandler, asyncHandler(allUsers));
router.route("/friends").get(authHandler, asyncHandler(friends));
router.route("/requestRecieved").get(authHandler, asyncHandler(getRequestRecieved));
router.route("/requestSended").get(authHandler, asyncHandler(getRequestSended));
router.route("/search").get(authHandler, asyncHandler(searchUser));
router.route("/userDetail").get(authHandler, asyncHandler(userDetail));
router.route("/getUserData").get(authHandler, asyncHandler(getUserData));
router.route("/getAllInterest").get(authHandler, asyncHandler(getAllInterest));
router.route("/getRecommendation").get(authHandler, asyncHandler(getRecommendation));
router.route("/getMutualFriends").get(authHandler, asyncHandler(getMutualFriends));

// router.get("/mutualFriends", auth, mutualFriends);

router.route("/friendRequestSent").put(authHandler, asyncHandler(sendFriendRequest));
router.route("/acceptFriendRequest").put(authHandler, asyncHandler(acceptFriendRequest));
router.route("/rejectFriendRequest").put(authHandler, asyncHandler(rejectFriendRequest));
router.route("/unfollow").put(authHandler, asyncHandler(unfollow));
router.route("/withdrawFriendRequest").put(authHandler, asyncHandler(withdrawRequest));
router.route("/updateInterest").put(authHandler, asyncHandler(updateInterest));

export default router