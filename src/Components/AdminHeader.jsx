// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { logout } from "@/api/login";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { CiShoppingCart } from "react-icons/ci";
import { FaMagnifyingGlass, FaSquarePlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";

// Example: Solid Icon
function AdminHeader() {
  const { isLoggedIn, clearToken , user, setUser} = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const {mutate: logoutMutate} = useMutation({
    mutationFn: logout,
    onError: (err) => {console.log(err);},
    onSuccess: (data) => {
      console.log(data);
      setUser(null);
      clearToken();
      toast({ title: "Logout Successfull" });
      navigate("/");
    },
  });
  return (
    <div className="flex z-10 items-center py-3 fixed top-0  box-border border-solid border-b-[1px] w-full bg-white">
      <div className="text-black text-lg  bg-white  flex justify-between  items-center gap-1 sm:gap-2 box-border">
                            <SidebarTrigger />

        <div className="">
    {console.log(user) }

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
        <div className="border border-black rounded-md flex items-center px-6 lg:w-[37rem] md:w-[25rem] w-[20rem]  ">
          <input
            type="search"
            className=" px-2 py-1 w-full outline-none"
            placeholder="Search for accesories"
          />
          <FaMagnifyingGlass />
        </div>
        
        <div className="border-r border-black border-[1.5px] h-7 sm:block hidden"></div>
        

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
            <NavLink to="/login">
              <li className="sm:block hidden hover:text-blue-500 transition-colors duration-300 ease-in-out">
                Login
              </li>
            </NavLink>
            
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminHeader;
