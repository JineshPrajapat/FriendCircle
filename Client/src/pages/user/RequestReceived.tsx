import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AppDispatch, RootState } from '@/store/store';
import { acceptFriendRequest, getAllRequestRecieved, rejectFriendRequest } from '@/services/networkManagement';


const RequestReceived: React.FC = () => {
  const requestReceived = useSelector((state: RootState) => state.userNetwork.requestReceived);
  // const isLoading = useSelector((state: RootState) => state.userNetwork.loading);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getAllRequestRecieved());
    }, 2000);

    return () => clearInterval(intervalId);
    // dispatch(getAllRequestRecieved());
  }, [dispatch]);

  const handleAcceptRequest = (senderID: string) => {
    dispatch(acceptFriendRequest({ senderID }));
  };

  const handleRejectRequest = (senderID: string) => {
    dispatch(rejectFriendRequest({ senderID }));
  };

  return (
    <section className="bg-white md:p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Requests Received</h2>

      <ul className="space-y-4 p-1">
        {/* {isLoading ? (
          <Loader />
        ) : (
          <>
            {requestReceived.length > 0 && requestReceived[0]._id ? (
              requestReceived.map((user) => (
                <li key={user._id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg text-xs">
                  <NavLink to={`/user/${user._id}`} className="flex flex-row gap-2 items-center">
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full"
                    />
                    <span className="font-medium text-xs md:text-xl">{user.fullName}</span>
                  </NavLink>
                  <div>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-green-600"
                      onClick={() => handleAcceptRequest(user._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => handleRejectRequest(user._id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No request received</p>
            )}
          </>
        )} */}
        <>
          {requestReceived.length > 0 && requestReceived[0]._id ? (
            requestReceived.map((user) => (
              <li key={user._id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg text-xs">
                <NavLink to={`/user/${user._id}`} className="flex flex-row gap-2 items-center">
                  <img
                    src={user.profileImage}
                    alt="User"
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full"
                  />
                  <span className="font-medium text-xs md:text-xl">{user.fullName}</span>
                </NavLink>
                <div>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-green-600"
                    onClick={() => handleAcceptRequest(user._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => handleRejectRequest(user._id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No request received</p>
          )}
        </>
      </ul>
    </section>
  );
};

export default RequestReceived;
