import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Login.css";
const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      if(response) {
        // perform redirect
        // navigate("/dashboard");

        // or show alert
        alert("Login successful");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="form-item"
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          value="testuser@gmail.com"
        />
        <input
          className="form-item"
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          value="25BT6ma022@"
        />
        <div className="button-container">
          <button className="form-item-button" type="submit">
            Login
          </button>
          <button
            className="form-item-button"
            type="button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
