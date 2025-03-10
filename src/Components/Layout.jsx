import { Outlet } from "react-router-dom"
import Header from "./Header"
import BottomNavBar from "./BottomNavBar"
import Footer from "./Footer"

function Layout() {
  return (
    <>
    <Header/>
    <div className="mt-20">
    <Outlet />

    </div>
      <BottomNavBar/>
      <Footer />
    </>
  )
}

export default Layout