import { useState, useEffect } from "react";

import { useDispatch,useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store/store";
import { getUserDetails } from "@/services/auth";

export const Header : React.FC= ()=> {
  const user = useSelector((state:RootState) => state.user);
  const [searchName, setSearchName] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // let timeoutId = null;

  const handleSearchInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  useEffect(()=>{
    dispatch(getUserDetails());
  },[])

//   useEffect(() => {
//     if (searchName.trim()) {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }

//       timeoutId = setTimeout(() => {
//         dispatch(searchUsers(searchName));
//       }, 300);
//     }
//     else {
//       dispatch(getAllUser(token));
//     }

//     return () => clearTimeout(timeoutId);
//   }, [searchName, dispatch]);


  const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchName.trim()) {
    //   dispatch(searchUsers(searchName));
    }
  };

  return (
    <header className="sticky top-0 flex justify-between items-center bg-white px-1 py-3 md:p-4 rounded-lg shadow-md">
      <h1 className="text-xs lg:text-2xl font-semibold text-gray-800">Friend Finder</h1>

      {/* Search Bar */}
      <div className="flex flex-row items-center gap-3 relative">
        <form onSubmit={handleSearchSubmit} className="flex items-center rounded-lg px-1 py-1 w-full ">
          <input
            type="search"
            className="w-full px-3 h-[5vh] text-black border rounded-lg outline-none focus:border-b-2 focus:border-blue-500"
            placeholder="Search by username or email"
            value={searchName}
            onChange={handleSearchInputChange}
          />
          <button
          type="submit"
            className="bg-blue-500 text-white p-1 md:px-4 md:py-2 rounded-full ml-2 hover:bg-blue-600"
            // onClick={handleSearchSubmit}
          >
            <Search />
          </button>
        </form>



        <div className='flex flex-col gap-2 items-center cursor-pointer' title={user.fullName} onClick={()=>setShowDropDown(!showDropDown)}>
          <div className='w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-black'>
            <img className='w-full h-full rounded-full' src={user?.profileImage ?? `https://some-cdn.com/default-profile/${user.fullName.charAt(0).toUpperCase()}.png`} alt={"profileImage"} />
          </div>
        </div>

        {showDropDown &&
          <div className=" absolute top-16 bg-gray-300 p-2 rounded-md right-4 font-medium">
            <div className="flex flex-col gap-2 text-left ">
              <NavLink to={`/user/${user._id}`} className="hover:bg-white p-2 rounded-md">{user?.fullName}</NavLink>
              <button
                className="hover:bg-white p-2 rounded-md text-left"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                LogOut
              </button>
            </div>
          </div>
        }

      </div>
    </header>
  )
}

export default Header;