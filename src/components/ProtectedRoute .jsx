import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  if (loading)
    return (
      <div className="fixed flex justify-center items-center h-screen inset-0 bg-black/10">
        <div className="">
          <BeatLoader color="#3498db" size={15} />
        </div>
      </div>
    );

  if (!session) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
