import { getAllFriend, getAllRequestRecieved, getAllRequestSent, getAllUser, getMutualFriends, getRecommendation, getUserData, searchUser } from '@/services/networkManagement';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  profileImage?: string;
  userName: string;
  fullName: string;
  friends:string[];
  freindRequestSent:string[];
  friendRequestRecieved:string[]
}

interface UserNetworkState {
  allUsers: User[];
  friends: User[];
  requestReceived: User[];
  requestSent: User[];
  mutualFriends: User[];
  recommendation: User[];
  allInterest: any[];
  userData:User[],
  error: string | null,
  loading:boolean;
}

const initialState: UserNetworkState = {
  allUsers: [],
  friends: [],
  requestReceived: [],
  requestSent: [],
  mutualFriends: [],
  recommendation:[],
  allInterest: [],
  userData:[],
  error:null,
  loading:false
};

const userNetworkSlice = createSlice({
  name: 'userNetwork',
  initialState,
  reducers: {
    setAllUsers: (state, action: PayloadAction<any[]>) => {
      state.allUsers = action.payload;
    },
    setFriends: (state, action: PayloadAction<any[]>) => {
      state.friends = action.payload;
    },
    setRequestReceived: (state, action: PayloadAction<any[]>) => {
      state.requestReceived = action.payload;
    },
    setRequestSent: (state, action: PayloadAction<any[]>) => {
      state.requestSent = action.payload;
    },
    setMutualFriends: (state, action: PayloadAction<any[]>) => {
      state.mutualFriends = action.payload;
    },
    setAllInterest: (state, action: PayloadAction<any[]>) => {
      state.allInterest = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
    // get allusers 
      .addCase(getAllUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action: PayloadAction<any>) => {
        console.log("hello", action)
        state.allUsers = action.payload
        state.loading = false;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // searchUser
      .addCase(searchUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(searchUser.fulfilled, (state, action: PayloadAction<any>) => {
        console.log("hello", action)
        state.allUsers = action.payload
        state.loading = false;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // get all request sent
      .addCase(getAllRequestSent.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllRequestSent.fulfilled, (state, action: PayloadAction<any>) => {
        state.requestSent = action.payload
        state.loading = false;
      })
      .addCase(getAllRequestSent.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // allreqquest recived
      .addCase(getAllRequestRecieved.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllRequestRecieved.fulfilled, (state, action: PayloadAction<any>) => {
        state.requestReceived = action.payload
        state.loading = false;
      })
      .addCase(getAllRequestRecieved.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // getAllfriends
      .addCase(getAllFriend.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllFriend.fulfilled, (state, action: PayloadAction<any>) => {
        state.friends = action.payload
        state.loading = false;
      })
      .addCase(getAllFriend.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // get userdata
      .addCase(getUserData.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action: PayloadAction<any>) => {
        state.userData = action.payload
        state.loading = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // get Recommendation
      .addCase(getRecommendation.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getRecommendation.fulfilled, (state, action: PayloadAction<any>) => {
        state.recommendation = action.payload
        state.loading = false;
      })
      .addCase(getRecommendation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // get mutual Friends
      .addCase(getMutualFriends.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getMutualFriends.fulfilled, (state, action: PayloadAction<any>) => {
        state.mutualFriends = action.payload
        state.loading = false;
      })
      .addCase(getMutualFriends.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  }
});

export const {
  setAllUsers,
  setFriends,
  setRequestReceived,
  setRequestSent,
  setMutualFriends,
  setAllInterest,
} = userNetworkSlice.actions;

export default userNetworkSlice.reducer;
