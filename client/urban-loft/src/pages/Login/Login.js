import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 200) {
        login(result.token, result.user);
        alert("Login successful");
        navigate("/dashboard");
      } else {
        if (result.general) {
          setError("root", { message: result.general });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "Login failed. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-form">
        <h2>Login</h2>
        
        {errors.root && <div className="error-message">{errors.root.message}</div>}
        
        <input
          className="form-item"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address"
            }
          })}
          type="email"
          placeholder="*Email"
        />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
        
        <input
          className="form-item"
          {...register("password", { 
            required: "Password is required"
          })}
          type="password"
          placeholder="*Password"
        />
        {errors.password && <span className="error-text">{errors.password.message}</span>}
        
        <div>
          <input className="form-item-button" type="submit" value="LOGIN" />
        </div>
        
        <div className="form-links">
          <p>Don't have an account? <a href="/">Register here</a></p>
        </div>
      </div>
    </form>
  );
}