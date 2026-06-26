import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Layout from "./components/Layout";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Register from "./page/Register";
import Notifications from "./page/Notifications";
import ProtectedRoute from "./components/ProtectedRoute ";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    let hiddenAt = 0;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
      } else {
        const elapsed = Date.now() - hiddenAt;

        // لو الصفحة كانت مختفية أكتر من دقيقة
        if (elapsed > 60 * 1000) {
          window.location.reload();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />

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
