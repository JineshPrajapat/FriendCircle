import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/store/store';
import { ArrowCircleRight } from '@mui/icons-material';
import { getAllFriend, unfollowFriend } from '@/services/networkManagement';
import Loader from '@/common/Loader';
import { User } from '@/store/reducers/userNetworkReducer';

// Define the types for the user and Redux state

function Friend() {
  // Accessing the Redux state
  const friends = useSelector((state: RootState) => state.userNetwork.friends);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const isLoading = false; // Assuming this is managed outside for now

  // Fetching the friends data every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getAllFriend());
    }, 2000);
    
    return () => clearInterval(intervalId);
    // dispatch(getAllFriend());
  }, [dispatch]);

  // Handler function for unfollowing a friend
  const handleUnfollow = (opponentID: string) => {
    console.log("opponentID", opponentID)
    dispatch(unfollowFriend({opponentID}));
  };

  // Determine if we're on the home page
  const isHomePage = location.pathname === "/";
  const displayedFriends =  Array.isArray(friends) ? (isHomePage ? friends.slice(0, 10) : friends) : [];

  return (
    <section className="bg-white md:p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
      <ul
        className={`space-y-4 p-1 ${isHomePage ? "flex flex-col overflow-hidden overflow-y-auto h-[40vh]" : ""}`}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {displayedFriends.length > 0 ? (
              displayedFriends.map((user: User, index: number) => {
                return (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                  >
                    <NavLink
                      to={`/user/${user._id}`}
                      className="flex gap-2 items-center"
                    >
                      <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-black">
                        <img
                          className="w-full h-full rounded-full"
                          src={user.profileImage || "default_image_url"} // Default fallback image
                          alt={user.fullName}
                        />
                      </div>
                      <span className="font-medium text-xs md:text-xl">{user.fullName}</span>
                    </NavLink>
                    <button
                      className="text-red-500 text-sm px-2 py-1 border duration-500 bg-white rounded-md hover:bg-red-500 hover:text-white"
                      onClick={() => handleUnfollow(user._id)}
                    >
                      Unfollow
                    </button>
                  </li>
                );
              })
            ) : (
              <p>No friends exist.<br /><br /> Discover and create Friends!</p>
            )}
            {displayedFriends?.length >= 10 && isHomePage && (
              <div className="flex items-center justify-center">
                <NavLink
                  to="/Friends"
                  className="bg-gray-100 duration-500 h-full w-full p-4 rounded-lg text-black px-10 py-2 hover:bg-gray-400 flex flex-col items-center justify-center"
                >
                  <ArrowCircleRight className="text-blue-500 text-4xl " />
                  <p className="whitespace-nowrap">Discover More Users</p>
                </NavLink>
              </div>
            )}
          </>
        )}
      </ul>
    </section>
  );
}

export default Friend;
