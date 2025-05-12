import Home from "./pages/Home";
import Login from "./pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Profile from "./pages/Profile";
import LostPassword from "./pages/LostPassword";
import NotFound from "./pages/NotFound";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/lostpassword" element={<LostPassword />}/>
          <Route path="*" element={<NotFound />}/>
        </Routes >
      </BrowserRouter>
  );
}

export default App;
