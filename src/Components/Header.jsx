// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { logout } from "@/api/login";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/useAuthStore";
import { useSearchPlaceHolder } from "@/store/useSearchPlaceHolder";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { FaMagnifyingGlass, FaSquarePlus } from "react-icons/fa6";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

// Example: Solid Icon
function Header() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [, setSearchParams] = useSearchParams();
  const { searchPlaceHolder } = useSearchPlaceHolder();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logout,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      setUser(null);
      toast({ title: "Logout Successfull" });
      navigate("/");
    },
  });
  {
    console.log(searchValue);
  }
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
            setSearchParams({ query: searchValue });
          }}
          className="border border-black rounded-md flex items-center px-6 lg:w-[37rem] md:w-[25rem] w-[20rem]"
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

        <div className="bg-black px-3 py-2 text-white rounded-md sm:flex items-center gap-2 justify-center w-max shrink-0 hidden hover:text-black hover:bg-white transition-colors duration-1000 ease-in-out border-black border-[1.5px] cursor-pointer">
          {/* <FontAwesomeIcon icon={faPlusSquare} className="text-2xl" /> */}
          <FaSquarePlus className="text-2xl" />
          <p className="text-xs font-[400]">Post for free</p>
        </div>
        <div className="border-r border-black border-[1.5px] h-7 sm:block hidden"></div>
        {user && (
          <div>
            <CiShoppingCart
              className="text-2xl cursor-pointer"
              onClick={() => navigate("/cart")}
            />
          </div>
        )}

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
            <NavLink to="login">
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
