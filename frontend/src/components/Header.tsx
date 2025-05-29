import Icon from "../assets/logo.png";
import { Link } from "react-router-dom";
import CustomTypography from "./Typography";
import { useState } from "react";
import Login from "../Pages/Dashboard/Login/Login";
import { Modal } from "antd";
import { selectCurrentToken } from "../feature/auth/authSlice";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/authHook";
import { useLogoutMutation } from "../feature/auth/authApiSlice";

const Header = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const accessToken = useSelector(selectCurrentToken);
  const { id, name, email, createdAt, updatedAt } = useAuth();
  const [logout, { isLoading, isError, isSuccess, error }] =
    useLogoutMutation();

  const handleLogin = () => {
    setOpenLogin(!openLogin);
  };

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();

    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const Headers = [
    {
      name: "Explore",
      link: "/",
    },
    {
      name: "Problems",
      link: "/problems",
    },
    {
      name: "Contests",
      link: "/",
    },
    {
      name: "Discuss",
      link: "/",
    },
    {
      name: "Interview",
      link: "/",
    },
  ];

  const HeaderList = Headers.map((header, index) => {
    return (
      <div
        style={{
          margin: "0 20px",
        }}
        key={index}
      >
        <Link
          style={{
            textDecoration: "none",
            color: "black",
          }}
          to={header.link}
          key={index}
        >
          <CustomTypography variant="h6">{header.name}</CustomTypography>
        </Link>
      </div>
    );
  });

  return (
    <div
      style={{
        boxShadow: "0 4px 2px -2px gray",
      }}
      className="flex justify-evenly items-center bg-gray-800 p-4"
    >
      <p
        style={{
          color: "grey",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        Welcome
      </p>
      {name}

      <div
        style={{
          margin: "0 20px",
        }}
        className="w-2/6 flex items-center justify-between bg-gray-800 p-4"
      >
        <img src={Icon} alt="Logo" className="w-1" />
        {HeaderList}
      </div>

      <div
        style={{
          margin: "0 20px",
        }}
        className="w-1/6 flex items-center justify-between bg-gray-800 p-4"
      >
        <CustomTypography
          style={{
            cursor: "pointer",
          }}
          variant="h6"
        >
          Register
        </CustomTypography>

        <p
          style={{
            color: "grey",
          }}
        >
          or
        </p>

        <Modal
          width={350}
          centered
          open={openLogin}
          onCancel={handleLogin}
          footer={null}
        >
          <Login setOpenLogin={setOpenLogin} />
        </Modal>

        {accessToken ? (
          <CustomTypography
            onClick={handleLogout}
            style={{
              cursor: "pointer",
            }}
            variant="h6"
          >
            Log out
          </CustomTypography>
        ) : (
          <CustomTypography
            onClick={handleLogin}
            style={{
              cursor: "pointer",
            }}
            variant="h6"
          >
            Sign In
          </CustomTypography>
        )}
      </div>
    </div>
  );
};

export default Header;
