import { useForm } from "react-hook-form";
import "./Register.css";
export default function Register() {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if(response.status === 201) {
        alert("User registered successfully");
      }
      console.log(await response.text());
    } catch (error) {
      console.log(error);  
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="register-form">
        <input
          className="form-item"
          {...register("first_name", { required: true })}
          type="text"
          placeholder="*First Name"
        />
        {errors.first_name && <span>This field is required</span>}
        <input
          className="form-item"
          {...register("last_name")}
          type="text"
          placeholder="Last Name"
        />
        <input
          className="form-item"
          {...register("email", { required: true })}
          type="email"
          placeholder="*Email"
        />
        {errors.email && <span>This field is required</span>}
        <input
          className="form-item"
          {...register("password", { 
            required: true,
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters, with one uppercase, one lowercase, one number, and one special character",
            },
           })}
          type="password"
          placeholder="*Password"
        />
        {errors.password && <span>This field is required</span>}
        <input
          className="form-item"
          {...register("address_line1", { required: true })}
          type="text"
          placeholder="*Address Line 1"
        />
        {errors.address_line1 && <span>This field is required</span>}
        <input
          className="form-item"
          {...register("address_line2")}
          type="text"
          placeholder="Address Line 2"
        />
        <input
          className="form-item"
          {...register("city")}
          type="text"
          placeholder="*City"
        />
        <input
          className="form-item"
          {...register("state")}
          type="text"
          placeholder="*State"
        />
        <input
          className="form-item"
          {...register("postal_code")}
          type="text"
          placeholder="*Postal Code"
        />
        <input
          className="form-item"
          {...register("country")}
          type="text"
          placeholder="*Country"
        />
        <div>
          <input className="form-item-button" type="submit" value="REGISTER"></input>
        </div>
      </div>
    </form>
  );
}
