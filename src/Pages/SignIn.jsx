import { registerUser } from "@/api/auth";
import { addtoCart } from "@/api/cart";
import useAuthStore from "@/store/useAuthStore";
import { getLocalCart } from "@/utils/cart";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SignUp() {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, redirectTo, clearRedirectTo } =
    useAuthStore();
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: cartMutate } = useMutation({
    mutationFn: addtoCart,
    onError: (err) => {
      console.error(err);
      toast.error("Failed to sync cart");
    },
    onSuccess: () => {
      toast.success("Cart synced successfully");
      localStorage.removeItem("cart");
    },
  });

  const { mutate: registerMutate, isPending } = useMutation({
    mutationFn: registerUser,
    onError: (err) => {
      toast.error(err.error || "something went wrong");
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsLoggedIn(true);

      // Sync local cart
      const localCart = getLocalCart();
      if (localCart && localCart.length > 0) {
        const items = localCart.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        }));
        cartMutate(items);
      }

      if (
        state?.redirect &&
        state.redirect !== "/login" &&
        state.redirect !== "/register" &&
        data.user.role !== "admin"
      ) {
        navigate(state.redirect, { replace: true });
      } else if (
        redirectTo &&
        redirectTo !== "/login" &&
        redirectTo !== "/register" &&
        data.user.role !== "admin"
      ) {
        navigate(redirectTo, { replace: true });
        clearRedirectTo();
      } else if (data.user.role === "user" && data.user.role !== "admin") {
        navigate("/", { replace: true });
      } else if (data.user.role === "admin" && data.user.role !== "user") {
        navigate("/AdminDashboard", { replace: true });
      }

      toast.success("Signup successful");
    },
  });
  const onSubmit = (data) => {
    const cusData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    registerMutate(cusData);
  };
  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="yourname@email.com"
                  required=""
                  {...register("email", {
                    required: { message: "Email is required", value: true },
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-600">{errors.email.message}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </label>
                <input
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="johndoe"
                  required=""
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be between 3 and 20 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Username must be between 3 and 20 characters",
                    },
                    pattern: {
                      value: /^[a-z0-9_.]+$/,
                      message:
                        "Username can only contain lowercase letters, numbers, underscores, and dots",
                    },
                  })}
                />
                {errors.username && (
                  <span className="text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
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
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isPending ? "Signing up..." : "Sign up"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <NavLink
                  to={"/login"}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
