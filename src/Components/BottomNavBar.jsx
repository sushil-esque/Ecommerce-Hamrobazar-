import { FaBell, FaHome, FaPlusSquare, FaUser } from "react-icons/fa";
import {
  FaBellConcierge,
  FaHouse,
  FaHouseSignal,
  FaMessage,
  FaSquarePlus,
} from "react-icons/fa6";
import { BiMessageMinus } from "react-icons/bi";
import { VscBell } from "react-icons/vsc";
import { BiSolidUserCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


function BottomNavBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-200 sm:hidden flex justify-between items-center px-4 py-4 text-2xl z-10 fixed bottom-0 w-full">
      <div className="cursor-pointer" onClick={()=> navigate("/")}>
        <FaHouse />
      </div>
      <div className="cursor-pointer">
        <BiMessageMinus />{" "}
      </div>
      <div className="cursor-pointer">
        <FaSquarePlus />
      </div>
      <div className="cursor-pointer">
        <VscBell />
      </div>
      <div className="text-gray-400 cursor-pointer" onClick={()=> navigate("/login")} >

        <BiSolidUserCircle />
      </div>
    </div>
  );
}

export default BottomNavBar;
