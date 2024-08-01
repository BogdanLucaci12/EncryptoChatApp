import { useEffect } from "react";
import LoginRegisterContainer from "./components/login-register/LoginRegister.component";
import { useSelectored, useDispatcher } from "./store/hooks";
import { setCurrentUser, setUserDetails, type UserDetails, setIsLoading } from "./store/userSlice";
import { checkUserStatus } from "./utils/firebase";
import AppInterface from "./pages/appInterface";
import ErrorMessageContainer from "./components/errorToastify/toastify.component";
import { AppContainer } from "../src/App.styles"
const App = () => {
  const user = useSelectored(state => state.user.user)
  const error = useSelectored(state => state.user.error)
  const dispatch = useDispatcher()
  useEffect(() => {
    const handleUserRegistration = async () => {
      const user = await checkUserStatus()
      if (user === "noUserAuthenticated") {
        dispatch(setCurrentUser({ user: "" }))
        dispatch(setIsLoading({ isLoading: false }))
      }
      else {
        const userDetails = user as UserDetails;
        dispatch(setUserDetails(userDetails as UserDetails))
        dispatch(setCurrentUser({ user: userDetails.displayName }))
        dispatch(setIsLoading({ isLoading: false }))
      }
    }
    handleUserRegistration()
  }, [user, dispatch])
  return (
    <AppContainer className="flex items-center justify-center min-h-screen relative" >
      {
        user ? (
          <AppInterface />
        ) : <LoginRegisterContainer />
      }
      <ErrorMessageContainer subject={error} />
    </AppContainer>
  );
}

export default App;
