import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/Outlet/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PersistLogin from "./feature/auth/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route element={<PersistLogin />}>
          <Route index element={<Dashboard />}></Route>
        </Route>
      </Route >
    </Routes >
  );
}

export default App;
