import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllUser = createAsyncThunk(
    "user/getAllUser",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/allUsers");
            // console.log("res:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.allUsers;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const searchUser = createAsyncThunk(
    "user/searchUser",
    async ({ query }: { query: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/search", {
                params: { query }
            });
            // console.log("res:", response);
            if (response.status === 200) {
                console.log("response.data.user", response.data.allUsers)
                return response?.data?.allUsers;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getAllFriend = createAsyncThunk(
    "user/getAllFriend",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/friends");
            console.log("res:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.friends;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getAllRequestSent = createAsyncThunk(
    "user/getAllRequestSent",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/requestSended");
            console.log("get all request sent:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.requestSent;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getAllRequestRecieved = createAsyncThunk(
    "user/getAllRequestRecieved",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/requestRecieved");
            console.log("res:", response);
            if (response.status === 200 || response.status === 204) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.requestReceived ?? [];
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getAllInterest = createAsyncThunk(
    "user/getAllInterest",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/getAllInterest");
            console.log("res:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.allUsers;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getRecommendation = createAsyncThunk(
    "user/getRecommendation",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/getRecommendation");
            console.log("res:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.recommendations;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);


// put
export const sendFriendRequest = createAsyncThunk(
    "user/sendFriendRequest",
    async ({ recieverId }: { recieverId: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put("/user/friendRequestSent", null, {
                params: { recieverId }
            });
            console.log("res:", response);
            if (response.status === 200) {
                toast.success("Friend request sent.");
                getAllUser();
                getAllRequestSent();
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const acceptFriendRequest = createAsyncThunk(
    "user/acceptFriendRequest",
    async ({ senderID }: { senderID: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put("/user/acceptFriendRequest", null, {
                params: { senderID }
            });
            console.log("res:", response);
            if (response.status === 200) {
                toast.success("Friend request accepted.");
                getAllUser();
                getAllRequestRecieved();
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const rejectFriendRequest = createAsyncThunk(
    "user/rejectFriendRequest",
    async ({ senderID }: { senderID: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put("/user/rejectFriendRequest", null, {
                params: { senderID }
            });
            console.log("res:", response);
            if (response.status === 200) {
                toast.success("Request Rejected");
                getAllUser();
                getAllRequestRecieved();
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const withdrawRequest = createAsyncThunk(
    "user/withdrawRequest",
    async ({ recieverID }: { recieverID: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put("/user/withdrawFriendRequest", null, {
                params: { recieverID }
            });
            console.log("res:", response);
            if (response.status === 200) {
                toast.success("Request Withdrawn.");
                getAllRequestSent();
            }

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Request Withdrawn failed: Server error."
            );
        }
    }
);

export const unfollowFriend = createAsyncThunk(
    "user/withdrawRequest",
    async ({ opponentID }: { opponentID: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put("/user/unfollow", null, {
                params: { opponentID }
            });
            console.log("res:", response);
            if (response.status === 200) {
                toast.success("Unfollowed successfully");
            }
            getAllFriend();
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const updateInterest = createAsyncThunk(
    "user/updateInterest",
    async ({ selectedInterests }: { selectedInterests: string[] },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put("/user/updateInterest", { interests: selectedInterests });
            console.log("res:", response);
            if (response.status === 200) {
                toast.success("Interests updated successfully")
                return response?.data;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getUserData = createAsyncThunk(
    "user/getUserData",
    async ({ userId }: { userId: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/getUserData", {
                params: { userId }
            });
            console.log("res:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.userData;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);

export const getMutualFriends = createAsyncThunk(
    "user/getMutualFriends",
    async ({opponentID} :{opponentID:string},
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("/user/getMutualFriends", {
                params:{opponentID}
            });
            console.log("res:", response);
            if (response.status === 200) {
                // console.log("response.data.user", response.data.user)
                return response?.data?.mutualFriends;
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Password updation failed: Server error."
            );
        }
    }
);
