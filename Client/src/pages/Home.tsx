import Header from '@/Component/Header';
import NavBar from '@/Component/NavBar';
import { Route, Routes } from 'react-router-dom';
import DashBoard from './user/DashBoard';
import Friend from './user/Friend';
import AllUsers from './user/AllUsers';
import RequestSent from './user/RequestSent';
import RequestReceived from './user/RequestReceived';
import UserProfile from './user/UserProfile';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 md:p-2">
      <Header />
      <div className="mt-2 bg-white rounded-lg shadow-md p-4 ">
        <NavBar />
        <>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/friends" element={<Friend />} />
            <Route path="/requestSent" element={<RequestSent />} />
            <Route path="/requestRecieved" element={<RequestReceived/>}/>
            <Route path="/user/:userId" element={<UserProfile/>}/>
            <Route path="/allUser" element={<AllUsers />} />
          </Routes>
          </>
      </div>
    </div>
  )
}

export default Home;
