import { Outlet } from "react-router-dom";
import BottomNavBar from "../Components/BottomNavBar";
import Header from "../Components/Header";
import ScrollToTop from "@/Components/ScrollToTop";

function Layout() {
  return (
    <>
          <ScrollToTop/>
    
      <Header />
      <div className="mt-20">
        <Outlet />
      </div>
      <BottomNavBar />
      {/* <Footer /> */}
    </>
  );
}

export default Layout;
