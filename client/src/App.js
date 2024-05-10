import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Createappt from "./pages/Createappt";
import Session from "./pages/Session";
import Chat from "./pages/Chat";
import Profile from './pages/Profile';
import Viewchats from './pages/Viewchats';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/createappt" element={<Createappt/>} />
        <Route path='/session' element={<Session/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/viewchats' element={<Viewchats/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </div>
  );
}

export default App;
