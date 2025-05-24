import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/Outlet/MainLayout";
import Dashboard from "./Pages/Explore/Explore";
import PersistLogin from "./feature/auth/PersistLogin";
import Explore from "./Pages/Explore/Explore";
import Problem from "./Pages/Problems/Problem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route element={<PersistLogin />}>
          <Route index element={<Dashboard />}></Route>
          <Route path="explore" element={<Explore />}></Route>
          <Route path="problems" element={<Problem />}></Route>
        </Route>
      </Route >
    </Routes >
  );
}

export default App;
