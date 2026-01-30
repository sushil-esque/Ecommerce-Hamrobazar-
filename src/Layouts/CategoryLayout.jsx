import AdsCarousel from "@/Components/AdsCarousel";
import Categories from "@/Components/Categories";
import { Outlet } from "react-router-dom";

function CategoryLayout() {
  return (
    <div className="flex max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4 ">
 
      <Categories />
      <div className="flex flex-col flex-1 ">
        <AdsCarousel />

        <Outlet />
      </div>
    </div>
  );
}

export default CategoryLayout;
