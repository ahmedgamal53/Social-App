import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Layout from "./components/Layout";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Register from "./page/Register";
import Notifications from "./page/Notifications";
import ProtectedRoute from "./components/ProtectedRoute ";
function App() {
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
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
