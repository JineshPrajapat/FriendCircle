import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "@/Component/UserCard";
import { AppDispatch, RootState } from "@/store/store";
import { acceptFriendRequest, getRecommendation, sendFriendRequest, unfollowFriend, withdrawRequest } from "@/services/networkManagement";


const Recommendation: React.FC = () => {
  const recommendation = useSelector((state: RootState) => state.userNetwork.recommendation);
  const currentUserID = useSelector((state: RootState) => state.user._id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const intervalId = setInterval(() => {
        dispatch(getRecommendation());
    }, 2000);

    return () => clearInterval(intervalId);
  }, [dispatch, ]);

  const handleAddFriend = (recieverId: string): void => {
    dispatch(sendFriendRequest({recieverId}));
  };

  const handleWithDrawRequest = (recieverID: string): void => {
    dispatch(withdrawRequest({recieverID} ));
  };

  const handleAcceptRequest = (senderID: string): void => {
    dispatch(acceptFriendRequest({senderID}));
  }

  const handleUnfollow = (opponentID: string): void => {
    dispatch(unfollowFriend({opponentID} ));
  };

  return (
    <section className="bg-white p-4 rounded-lg shadow-md lg:col-span-2">
      <h2 className="text-lg font-semibold mb-4">Friend Recommendations</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendation?.length > 0 ? (
          recommendation.map((user, _) => (
            <UserCard
              key={user._id}
              user={user}
              currentUserID={currentUserID as string}
              handleAddFriend={handleAddFriend}
              handleWithDrawRequest={handleWithDrawRequest}
              handleAcceptRequest={handleAcceptRequest}
              handleUnfollow={handleUnfollow}
            />
          ))
        ) : (
          <div className="flex items-center justify-center">
            <p>No Recommendation available.</p>
          </div>
        )}
      </ul>
    </section>
  );
};

export default Recommendation;
