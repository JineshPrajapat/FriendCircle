import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import InterestForm from '@/Component/InterestForm';
import { AppDispatch, RootState } from '@/store/store';
import { acceptFriendRequest, getMutualFriends, getUserData, sendFriendRequest, unfollowFriend, withdrawRequest } from '@/services/networkManagement';


const UserProfile: React.FC = () => {
    const mutualFriends = useSelector((state: RootState) => state.userNetwork.mutualFriends);
    const currentUserID = useSelector((state: RootState) => state.user._id);
    const [showInterestForm, setShowInterestForm] = useState<boolean>(false);
    const user: any = useSelector((state: RootState) => state.userNetwork.userData);

    const dispatch = useDispatch<AppDispatch>();
    const { userId } = useParams<{ userId: string }>();

    useEffect(() => {
        if (userId) {
            dispatch(getUserData({ userId }));
        }
        dispatch(getMutualFriends({opponentID: userId as string}));
    }, [dispatch, userId]);

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

    return (
        <div className="flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
                <div className="flex flex-col md:flex-row items-center justify-start md:justify-between gap-4">
                    <div className="flex justify-start items-center gap-4">
                        <img
                            src={user?.profileImage}
                            alt="Profile"
                            className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-sm md:text-3xl font-bold text-gray-800">{user?.fullName}</h2>
                            <p className="text-gray-500">@{user?.userName}</p>
                        </div>
                    </div>
                </div>

                {userId !== currentUserID && (
                    <div className="flex flex-row justify-end">
                        {user?.friendRequestRecieved?.includes(currentUserID as string) ? (
                            <div
                                className="bg-red-500 text-white text-xs md:text-sm px-2 flex items-center py-1 rounded-lg mt-2 hover:bg-red-600 cursor-pointer"
                                onClick={() => handleWithDrawRequest(user._id as string)}
                            >
                                Cancel Request
                            </div>
                        ) : user?.freindRequestSent?.includes(currentUserID as string) ? (
                            <div
                                className="bg-green-500 text-white text-xs md:text-sm px-2 flex items-center py-1 rounded-lg mt-2 hover:bg-green-600 cursor-pointer"
                                onClick={() => handleAcceptRequest(user._id as string)}
                            >
                                Confirm Request
                            </div>
                        ) : user?.friends?.includes(currentUserID as string) ? (
                            <div
                                className="bg-slate-400 text-white text-xs md:text-sm px-2 flex items-center py-1 rounded-lg mt-2 hover:bg-slate-500 cursor-pointer"
                                onClick={() => handleUnfollow(user._id as string)}
                            >
                                Unfollow
                            </div>
                        ) : (
                            <div
                                className="bg-blue-500 text-white text-xs md:text-sm px-2 flex items-center py-1 rounded-lg mt-2 hover:bg-blue-600 cursor-pointer"
                                onClick={() => handleAddFriend(user._id as string)}
                            >
                                Add Friend
                            </div>
                        )}
                    </div>
                )}

                <hr className="mt-2" />
                <div className="text-xl underline text-left">Interest</div>
                <div className="flex flex-wrap gap-2 mt-2 pl-2">
                    {user?.interest?.map((interest : string, index :number) => (
                        <div key={index} className={`px-1 py-1 rounded-md`}>
                            {interest},
                        </div>
                    ))}
                </div>

                {/* Mutual Connections */}
                {userId !== currentUserID ? (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800">Mutual Connections</h3>
                        {mutualFriends?.length > 0 && (
                            <p className="text-gray-500 whitespace-nowrap text-left">{mutualFriends.length} mutual connections.</p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {mutualFriends?.length > 0 ? (
                                mutualFriends?.map((friend) => (
                                    <NavLink to={`/user/${friend?._id}`} key={friend._id} className="flex flex-col items-center">
                                        <img
                                            src={friend?.profileImage}
                                            alt={friend?.userName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <p className="mt-2 text-gray-700">{friend.fullName}</p>
                                        <NavLink to={`/user/${friend?._id}`} className="text-gray-500 hover:underline">@{friend.userName}</NavLink>
                                    </NavLink>
                                ))
                            ) : (
                                <p className="text-gray-500 whitespace-nowrap">No mutual connections yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => setShowInterestForm(!showInterestForm)}
                            className={`px-2 py-1 hover:cursor-pointer rounded-md mt-4 ${showInterestForm ? 'bg-slate-800 text-white' : 'bg-blue-300'}`}
                        >
                            {showInterestForm ? 'Close' : 'Add Interest'}
                        </button>

                        {showInterestForm && <InterestForm />}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
