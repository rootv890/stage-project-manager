import { Outlet } from "react-router-dom";
import Navbar from "@/components/core/navbar.tsx";

const Layout = () => {
  return (
    <div className={"w-full bg-background   relative"}>
      <Navbar />

      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
