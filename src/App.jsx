import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { me } from "./api/auth";
import "./App.css";
import Routes from "./Routes/Routes";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import Loader from "./Components/Loader";
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.error === "cart not found") return;
      toast.error(error.error || "something went wrong");
    },
  }),
});

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
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <Routes />
      </QueryClientProvider>
    </>
  );
}

export default App;
