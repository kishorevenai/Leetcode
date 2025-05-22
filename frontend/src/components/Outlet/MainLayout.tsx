import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="border">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
