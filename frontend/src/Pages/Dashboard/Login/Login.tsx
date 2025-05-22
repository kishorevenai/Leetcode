import Logo from "../../../assets/logo.png";
import CustomTypography from "../../../components/Typography";
import Input from "../../../components/Input";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { useState } from "react";
import { useLoginMutation } from "../../../feature/auth/authApiSlice";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [login, { data: loginData, isLoading, isError, isSuccess, error: loginError }] =
    useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    setError("");

    try {
      await login({ email, password }).unwrap();
    } catch (error) {
      console.log("Error logging in:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={Logo} alt="Logo" />
        <CustomTypography variant="h1">LeetCode</CustomTypography>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginTop: "20px" }}>
          <Input
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            type="text"
            placeholder="Username or Email"
            style={{
              width: "100%",
              height: "30px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          />

          <Input
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            type="password"
            placeholder="Password"
            style={{
              width: "100%",
              height: "30px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          />

          {error && (
            <CustomTypography
              style={{ fontSize: "10px", color: "red", margin: "10px" }}
              variant="body1"
            >
              {error}
            </CustomTypography>
          )}
        </div>

        <PrimaryButton disabled={isLoading} onClick={handleLogin} type="submit">
          Sign In
        </PrimaryButton>
      </form>

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CustomTypography
          style={{
            marginTop: "20px",
            cursor: "pointer",
          }}
          variant="h6"
        >
          Forgot Password?
        </CustomTypography>

        <CustomTypography
          style={{
            marginTop: "20px",
            cursor: "pointer",
            color: "#c9aa00",
          }}
          variant="h6"
        >
          Sign Up
        </CustomTypography>
      </div>
    </div>
  );
};

export default Login;
