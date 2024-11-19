import { Outlet } from "react-router-dom";
import Navbar from "@/components/core/navbar.tsx";
import useNotification from "./hooks/useNotification";

const Layout = () => {
  const addNotification = useNotification();
  return (
    <div className={"w-full bg-background   relative"}>
      <Navbar />

      {/* Notification Test */}
      <button
        onClick={() => {
          addNotification({
            message: "Hello",
            type: "success",
          });
        }}
      >
        Click
      </button>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
