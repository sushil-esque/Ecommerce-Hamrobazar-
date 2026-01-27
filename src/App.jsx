import { useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { me } from "./api/auth";
import "./App.css";
import Routes from "./Routes/Routes";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import Loader from "./Components/Loader";
function App() {
  const {
    data: user,
    isLoading: userLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: me,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (isSuccess) {
      useAuthStore.setState({ user, isLoggedIn: true, isInitialized: true });
      console.log(useAuthStore.getState().user, "USERRRRrrrr");
    }

    if (isError) {
      useAuthStore.setState({
        user: null,
        isLoggedIn: false,
        isInitialized: true,
      });
    }
  }, [isSuccess, isError, user]);

  if (userLoading) {
    return <Loader />;
  }
  return (
    <>
      <Toaster position="top-center" />
      <Routes />
    </>
  );
}

export default App;
