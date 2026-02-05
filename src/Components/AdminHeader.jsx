// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { logout } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { CiShoppingCart } from "react-icons/ci";
import { FaMagnifyingGlass, FaSquarePlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserRound } from "lucide-react";

// Example: Solid Icon
function AdminHeader() {
  const { clearToken, user, setUser } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useMutation({
    mutationFn: logout,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      setUser(null);
      clearToken();
      toast({ title: "Logout Successfull" });
      navigate("/");
    },
  });
  return (
    <div className="flex z-10 items-center py-3 lg:px-7 px-2 box-border border-solid border-b-[1px] bg-white">
      <div className="text-black  text-lg w-full   bg-white  flex justify-between  items-center gap-1 sm:gap-2">
        <div className="flex gap-4">
          <SidebarTrigger />

          <div className="">
            {console.log(user)}

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
        </div>

        {/* <div className="border border-black rounded-md flex items-center px-6 max-w-[37rem]   ">
          <input
            type="search"
            className=" px-2 py-1 w-full outline-none"
            placeholder="Search for accesories"
          />
          <FaMagnifyingGlass />
        </div> */}

        {user ? (
           
            <DropdownMenu className="">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full sm:flex items-center justify-center hidden focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <UserRound className="h-full w-full text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <UserRound className="h-full w-full text-gray-600 " />
                      <div>
                        <p className="text-xs ">{user.email}</p>
                        <p className="text-xs text-gray-500">visit profile</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => logoutMutate()}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) :(
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
