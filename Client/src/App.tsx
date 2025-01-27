import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { setUser } from './store/reducers/userReducer';
import { AuthStates } from './utils/enums';
import Loader from './common/Loader';
import Landing from './pages/Landing';
import Home from './pages/Home';

const App: React.FC = () => {
  const { authState } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAuth = async () => {
      const userToken = localStorage.getItem("accessToken");

      if (!userToken) {
        dispatch(setUser({ authState: AuthStates.IDLE }));
      }

      if (userToken) {
        try {
          // Make API call or any other logic
          dispatch(setUser({ authState: AuthStates.AUTHENTICATED }));
        } catch {
          localStorage.removeItem("accessToken");
          dispatch(setUser({ authState: AuthStates.IDLE }));
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  // if (!isInitialized.current)
  //   return <Loader />

  if (authState === AuthStates.INITIALIZING) return <Loader />;

  return (
    <>
      {authState !== AuthStates.AUTHENTICATED ?
        (
          <>
            <Landing />
          </>
        ) : (
          <>
            <Home />
          </>
        )
      }
    </>
  );
};

export default App;
