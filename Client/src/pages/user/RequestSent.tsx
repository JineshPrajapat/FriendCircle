import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AppDispatch, RootState } from '@/store/store';
import { getAllRequestSent, withdrawRequest } from '@/services/networkManagement';


interface RequestSentProps { }

const RequestSent: React.FC<RequestSentProps> = () => {
  const requestSent = useSelector((state: RootState) => state.userNetwork.requestSent);
  // const isLoading = useSelector((state: RootState) => state.userNetwork.loading);


  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getAllRequestSent());
    }, 2000);

    return () => clearInterval(intervalId);
    // dispatch(getAllRequestSent());
  }, [dispatch]);

  const handleWithDrawRequest = (recieverID: string) => {
    dispatch(withdrawRequest({ recieverID }));
  };

  return (
    <section className="bg-white md:p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Requests Sent</h2>

      <ul className="space-y-4 p-1">
        {/* {isLoading ? <Loader /> : (
          <>
            {requestSent?.length > 0 && requestSent[0]._id ? requestSent.map((user) => {
              return (
                <li key={user._id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                  <NavLink
                    to={`/user/${user._id}`} className='flex flex-row gap-2 items-center'>
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full"
                    />
                    <span className="font-medium text-xs md:text-xl">{user.fullName}</span>
                  </NavLink>
                  <button className="text-sm text-gray-500 border px-2 py-1 rounded-md duration-500 bg-white hover:bg-red-600 hover:text-white"
                    onClick={() => handleWithDrawRequest(user._id)}>
                    withdraw
                  </button>
                </li>
              );
            }) : <p>No request sent.</p>}
          </>
        )} */}

        <>
          {requestSent?.length > 0 && requestSent[0]._id ? requestSent.map((user) => {
            return (
              <li key={user._id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                <NavLink
                  to={`/user/${user._id}`} className='flex flex-row gap-2 items-center'>
                  <img
                    src={user.profileImage}
                    alt="User"
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full"
                  />
                  <span className="font-medium text-xs md:text-xl">{user.fullName}</span>
                </NavLink>
                <button className="text-sm text-gray-500 border px-2 py-1 rounded-md duration-500 bg-white hover:bg-red-600 hover:text-white"
                  onClick={() => handleWithDrawRequest(user._id)}>
                  withdraw
                </button>
              </li>
            );
          }) : <p>No request sent.</p>}
        </>
      </ul>
    </section>
  );
}

export default RequestSent;
