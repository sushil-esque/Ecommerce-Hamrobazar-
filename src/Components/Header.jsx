// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { logout } from "@/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useSearchPlaceHolder } from "@/store/useSearchPlaceHolder";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
function Header() {
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [, setSearchParams] = useSearchParams();
  const { searchPlaceHolder, setSearchPlaceHolder } = useSearchPlaceHolder();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logout,
    onError: (err) => {
      toast.error(err.error);
    },
    onSuccess: (data) => {
      console.log(data);
      useCartStore.setState(() => ({ cart: [] }));
      setUser(null);
      localStorage.removeItem("user");

      toast.success("Logout Successfull");
      // navigate("/");
    },
  });
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith("/category"))
      setSearchPlaceHolder("Search for anything");
  }, [pathname]);
  return (
    <div className="flex flex-col justify-center py-3 fixed top-0 z-20 box-border w-full bg-white">
      <div className="text-black text-lg bg-white  flex justify-between lg:mx-24 md:mx-4 sm:mx-4 items-center gap-1 sm:gap-2 box-border">
        <div className="shrink-0">
          {" "}
          <NavLink to="/">
            <picture>
              {/* Small screen logo */}
              <source srcSet="hbsmall.png" media="(max-width: 640px)" />
              {/* Default logo */}
              <img
                src="hamrobazarr.png"
                alt="logo"
                className="w-20 h-10 object-contain sm:w-48 sm:h-12"
              />
            </picture>
          </NavLink>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            if (pathname.startsWith("/category")) {
              setSearchParams({ query: searchValue });
            } else {
              navigate(`/?query=${encodeURIComponent(searchValue)}`);
            }
            setSearchValue("");
          }}
          className="border border-black rounded-md flex items-center px-6 lg:w-[37rem] md:w-[25rem] w-fit"
        >
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-2 py-1 w-full outline-none"
            placeholder={searchPlaceHolder}
          />
          <button type="submit">
            <FaMagnifyingGlass />
          </button>
        </form>

        {/* <div className="bg-black px-3 py-2 text-white rounded-md sm:flex items-center gap-2 justify-center w-max shrink-0 hidden hover:text-black hover:bg-white transition-colors duration-1000 ease-in-out border-black border-[1.5px] cursor-pointer">
          <FaSquarePlus className="text-2xl" />
          <p className="text-xs font-[400]">Post for free</p>
        </div> */}
        <div
          className="bg-black px-3 py-2 text-white rounded-md sm:flex items-center gap-2 justify-center w-max shrink-0 hidden hover:text-black hover:bg-white transition-colors duration-1000 ease-in-out border-black border-[1.5px] cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <div className="relative">
            <PiShoppingCartSimpleFill className="text-2xl cursor-pointer" />
            <Badge className="absolute hover:bg-white bg-white  text-black -top-1 -right-[6px] h-3  rounded-full px-1 font-mono tabular-nums">
              {cart.length}
            </Badge>
          </div>
          <p className="text-xs font-[400]">My Cart</p>
        </div>

        <div className="border-r border-black border-[1.5px] h-7 sm:block hidden"></div>
        {/* {user && (
          <div>
            <CiShoppingCart
              className="text-2xl cursor-pointer"
              onClick={() => navigate("/cart")}
            />
          </div>
        )} */}

        {user ? (
          <button
            className="border border-black px-2 py-1 text-black rounded-md  shrink-0 w-max hover:text-white hover:bg-black transition-colors duration-300 ease-in-out"
            // onClick={() => {
            //   clearToken();
            //   toast({ title: "Logout Successfull" });
            // }}
            onClick={() => logoutMutate()}
          >
            Logout
          </button>
        ) : (
          <ul className="flex gap-6 items-center text-md ">
            <NavLink to="login" state={{ redirect: pathname }} replace>
              <li className="sm:block hidden hover:text-blue-500 transition-colors duration-300 ease-in-out">
                Login
              </li>
            </NavLink>
            <li className="lg:block hidden">
              <NavLink to="signup">
                <button className="border border-black px-2 py-1 text-black rounded-md  shrink-0 w-max hover:text-white hover:bg-black transition-colors duration-300 ease-in-out ">
                  Sign Up
                </button>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Header;
