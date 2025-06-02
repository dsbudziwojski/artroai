import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import LostPassword from "./pages/LostPassword";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Search from "./pages/Search";
import { AuthProvider } from "./AuthContext";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/edit/:username" element={<EditProfile />} />
          <Route path="/lostpassword" element={<LostPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes >
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
