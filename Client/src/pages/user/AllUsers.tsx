import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { acceptFriendRequest, getAllUser, sendFriendRequest, unfollowFriend, withdrawRequest } from "../Services/operations/userAPI";
import UserCard from "@/Component/UserCard";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowCircleRight } from "@mui/icons-material";
import { acceptFriendRequest, getAllUser, sendFriendRequest, unfollowFriend, withdrawRequest } from "@/services/networkManagement";
import { AppDispatch, RootState } from "@/store/store";
import { User } from "@/store/reducers/userNetworkReducer";



const AllUsers: React.FC = () => {
  const allUser = useSelector((state: RootState) => state.userNetwork.allUsers);
  const currentUserID = useSelector((state: RootState) => state.user?._id);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getAllUser());
    }, 2000);
    return () => clearInterval(intervalId);

    // dispatch(getAllUser());
  }, [dispatch]);

//  handle functions
  const handleAddFriend = (recieverId: string) => {
    dispatch(sendFriendRequest({ recieverId }));
  };

  const handleWithDrawRequest = (recieverID: string) => {
    dispatch(withdrawRequest({ recieverID }));
  };

  const handleAcceptRequest = (senderID: string) => {
    dispatch(acceptFriendRequest({ senderID }));
  };

  const handleUnfollow = (opponentID: string) => {
    dispatch(unfollowFriend({ opponentID }));
  };

  const isHomePage = location.pathname === "/";
  // const displayedUsers = isHomePage ? allUser.slice(0, 10) : allUser;
  const displayedUsers = Array.isArray(allUser) ? (isHomePage ? allUser.slice(0, 10) : allUser) : [];

  return (
    <section className="mt-6 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">All Users</h2>
      <div
        className={`${isHomePage
          ? "flex flex-row gap-3 overflow-hidden overflow-x-auto whitespace-nowrap"
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          }`}
      >
        {displayedUsers.length > 0 ? (
          displayedUsers?.map((user: User, index: number) => (
            user._id != currentUserID &&
            <UserCard
              key={index}
              user={user}
              currentUserID={currentUserID ?? ""}
              handleAddFriend={handleAddFriend}
              handleWithDrawRequest={handleWithDrawRequest}
              handleAcceptRequest={handleAcceptRequest}
              handleUnfollow={handleUnfollow}
            />
          ))
        ) : (
          <p className="text-xl flex items-center justify-center">
            No friends found.
          </p>
        )}

        {isHomePage && allUser?.length >= 10 && (
          <div className="flex items-center justify-center">
            <NavLink
              to="/allUser"
              className="bg-gray-100 hover:bg-gray-200 duration-500 h-full w-full p-4 rounded-lg text-black px-10 py-2 hover:bg-gary-400 flex flex-col items-center justify-center"
            >
              <ArrowCircleRight className="text-blue-500 text-4xl " />
              <p className="whitespace-nowrap">Discover More Users</p>
            </NavLink>
          </div>
        )}
      </div>
    </section>
  );
}

export default AllUsers;
