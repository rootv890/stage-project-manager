import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="section bg-zinc-900">
      <h1>Authentication Screem</h1>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
