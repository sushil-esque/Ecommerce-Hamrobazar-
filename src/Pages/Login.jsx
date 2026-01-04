import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { login, loginFakeStore } from "../api/login";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
function Login() {
  const{setToken} = useAuthStore();
  const{setUser} = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { toast } = useToast()
  const queryClient = useQueryClient();
  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login,
    onError: (err) => {
      console.log(err);
      toast({
        title: "Login Failed",
        description: "Invalid Credentials",
        variant: "destructive",
        position: "top-right",
      })
    },

    onSuccess: (data) => {
      console.log(data);
      setUser(data.user);
      // localStorage.setItem("token", data.token);
      // setToken(data.token); 
      if(data.user.role==="user")
      navigate("/");
      else if(data.user.role==="admin")
      navigate("/AdminDashboard");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Login Successfull",
        description: "Welcome to Fake Store",
      })
    },
  });
  const onSubmit = (data) => {
    const cusData = {
      email: data.email,
      password: data.password,
    };
    loginMutate(cusData);
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                {...register("email", {
                  required: { message: "Email is required", value: true },
                
                })}
              />
              {errors.username && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                {...register("password", {
                  required: {
                    message: "Password is required",
                    value: true,
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-600">
                  {errors.password.message}
                </span>
              )}
            </div>
            {/* <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                type="confirm-password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div> */}
            
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <NavLink
                to={"/signup"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
}

export default Login;
