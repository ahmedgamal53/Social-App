import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Layout from "./components/Layout";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Register from "./page/Register";
import Notifications from "./page/Notifications";
import ProtectedRoute from "./components/ProtectedRoute ";
import { useEffect } from "react";
import { supabase } from "./supabaseClient.js";
function App() {
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        await supabase.auth.refreshSession();
        window.location.reload();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
