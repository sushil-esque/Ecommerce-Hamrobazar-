import { FaBell, FaHome, FaPlusSquare, FaUser } from "react-icons/fa";
import {
  FaBellConcierge,
  FaHouse,
  FaHouseSignal,
  FaMessage,
  FaSquarePlus,
  FaChevronRight,
} from "react-icons/fa6";
import { BiMessageMinus } from "react-icons/bi";
import { VscBell } from "react-icons/vsc";
import { BiSolidUserCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { TbCategory2 } from "react-icons/tb";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useCategories } from "@/hooks/useCategories";
import { NavLink } from "react-router-dom";
import { Separator } from "./ui/separator";
import { UserRound } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useLogout";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/store/useCartStore";

function BottomNavBar() {
  const navigate = useNavigate();
  const { data: categoryData, isLoading, isError, refetch } = useCategories();
  const { user } = useAuthStore();
  const { cart } = useCartStore();

  const categories = isLoading ? (
    Array.from({ length: 8 }).map((_, i) => (
      <li key={i} className="w-full px-4 py-2">
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" />
        <Separator className="my-1" />
      </li>
    ))
  ) : isError ? (
    <div className="flex flex-col items-center justify-center py-8 w-full">
      <p className="text-sm text-red-500 mb-2">Failed to load categories</p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        className="text-xs"
      >
        Retry
      </Button>
    </div>
  ) : (
    categoryData?.data?.map((category, index) => (
      <li key={index} className="w-full">
        <DrawerClose asChild>
          <NavLink
            to={`/category/${category.slug}`}
            className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
          >
            <span>{category.name}</span>
            <FaChevronRight className="text-gray-400 text-sm" />
          </NavLink>
        </DrawerClose>
        <Separator className="my-1" />
      </li>
    ))
  );

  const { logoutMutate } = useLogout();

  return (
    <div className="bg-slate-200 sm:hidden flex justify-between items-center px-4 py-4 text-2xl z-10 fixed bottom-0 w-full">
      <div className="cursor-pointer" onClick={() => navigate("/")}>
        <FaHouse />
      </div>
      <div className="cursor-pointer">
        <Drawer>
          <DrawerTrigger>
            <TbCategory2 />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                <div className="flex items-center gap-2 text-xl">
                  <TbCategory2 />
                  Categories
                </div>
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
              <ul className="flex flex-col items-start w-full">
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="/"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>Latest Products</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                {categories}
              </ul>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {/* <div className="cursor-pointer">
        <FaSquarePlus />
      </div> */}
      {/* <div className="cursor-pointer">
        <VscBell />
      </div> */}
      <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
        <PiShoppingCartSimpleFill className="text-2xl cursor-pointer" />
        <Badge className="absolute hover:bg-white bg-white  text-black -top-1 -right-[6px] h-3  rounded-full px-1 font-mono tabular-nums">
          {cart.length}
        </Badge>
      </div>
      <div className="text-gray-400 cursor-pointer">
        <Drawer>
          <DrawerTrigger>
            <BiSolidUserCircle />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerClose asChild>
              {user ? (
                <div className="flex items-center  gap-2 cursor-pointer">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full  focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <UserRound className="h-5 w-5 text-gray-600" />
                  </Button>
                  <div className="flex flex-col items-start">
                    <p className="text-xs ">{user?.email}</p>
                    <p className="text-xs text-gray-500">visit profile</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mx-2 mt-5 ">
                  <Button className="w-full" onClick={() => navigate("/login")}>
                    {" "}
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </DrawerClose>
            <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
              <ul className="flex flex-col items-start w-full">
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>Settings</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span> Return Policy</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>FAQ</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>Contact Us</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>About Us</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>Terms and Conditions</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
                <li className="w-full">
                  <DrawerClose asChild>
                    <NavLink
                      to="#"
                      className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-100 cursor-pointer"
                    >
                      <span>Privacy Policy</span>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </NavLink>
                  </DrawerClose>
                  <Separator className="my-1" />
                </li>
              </ul>
            </div>
            {user && (
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => logoutMutate()}
                  >
                    Logout
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default BottomNavBar;
