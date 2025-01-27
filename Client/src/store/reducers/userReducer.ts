import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { getUserDetails, login } from "@/services/auth";

interface UserState {
    _id: string | null;
    profileImage: string;
    userName: string;
    fullName: string;
    interest: string[];
    friends: string[],
    freindRequestSent: string[],
    friendRequestRecieved: string[],
    authState: AuthStates;
    loading: boolean;
    error: string | null;
};

const initialState: UserState = {
    _id: null,
    profileImage: "",
    userName: "",
    fullName: "",
    friends: [],
    freindRequestSent: [],
    friendRequestRecieved: [],
    interest: [],
    authState: AuthStates.INITIALIZING,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout(state) {
            state._id = null;
            state.userName = "";
            state.fullName = "";
            state.authState = AuthStates.IDLE;
            state.error = null;
        },
        setUser(state, action: PayloadAction<any>) {
            state.authState = action.payload.authState ?? state.authState;
            state.error = action.payload.error ?? state.error;
        },
        setUserData(state, action: PayloadAction<any>) {
            console.log("action", action.payload)
            state._id = action.payload._id
            state.fullName = action.payload.fullName,
                state.interest = action.payload.interest,
                state.userName = action.payload.userName,
                state.profileImage = action.payload.profileImage
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.authState = AuthStates.INITIALIZING;
                state.error = null;
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
                state.authState = AuthStates.AUTHENTICATED;
                state.userName = action.payload.user.userName;
                state.fullName = action.payload.user.fullName;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.authState = AuthStates.ERROR;
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getUserDetails.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
                console.log("hello", action.payload.freindRequestSent)
                state._id = action.payload._id
                state.fullName = action.payload.fullName,
                state.interest = action.payload.interest,
                state.userName = action.payload.userName,
                state.profileImage = action.payload.profileImage;
                state.friends = action.payload.friends;
                state.freindRequestSent = action.payload.freindRequestSent;
                state.friendRequestRecieved = action.payload.friendRequestRecieved
                state.loading = false;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});



export const { logout, setUser, setUserData } = userSlice.actions;
export default userSlice.reducer

