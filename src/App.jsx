import { useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { me } from "./api/auth";
import "./App.css";
import Routes from "./Routes/Routes";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
function App() {
  const {
    data: user,

    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: me,
    refetchOnWindowFocus: false,
  });

useEffect(() => {
  if (isSuccess) {
    useAuthStore.setState({ user });
  }

  if (isError) {
    useAuthStore.setState({ user: null });
  }
}, [isSuccess, isError, user]);

  console.log(useAuthStore.getState().user,"USERRRRrrrr");
  return (
    <>
      <Toaster position="top-center" />
      <Routes />
    </>
  );
}

export default App;
