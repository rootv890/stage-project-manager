import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";

const CourseLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoaded) {
    return <div className="section">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div>
        Not signed in
        <p>
          <button onClick={() => navigate("/auth/sign-in")}>Sign In</button>
        </p>
      </div>
    );
  }

  return (
    <section className="section">
      <h1 className="title">Course Layout</h1>
      <Outlet />
    </section>
  );
};

export default CourseLayout;
